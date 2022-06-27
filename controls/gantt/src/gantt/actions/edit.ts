import { isNullOrUndefined, isUndefined, extend, setValue, getValue, deleteObject, createElement } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { TaskFieldsModel, EditSettingsModel, ResourceFieldsModel } from '../models/models';
import { IGanttData, ITaskData, ITaskbarEditedEventArgs, IValidateArgs, IParent, IPredecessor } from '../base/interface';
import { IActionBeginEventArgs, ITaskAddedEventArgs, ITaskDeletedEventArgs, RowDropEventArgs } from '../base/interface';
import { ColumnModel, Column as GanttColumn } from '../models/column';
import { ColumnModel as GanttColumnModel } from '../models/column';
import { DataManager, DataUtil, Query, AdaptorOptions, ODataAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { ReturnType, RecordDoubleClickEventArgs, Row, Column, IEditCell, EJ2Intance, getUid } from '@syncfusion/ej2-grids';
import { getSwapKey, isScheduledTask, getTaskData, isRemoteData, getIndex, isCountRequired, updateDates } from '../base/utils';
import { RowPosition } from '../base/enum';
import { CellEdit } from './cell-edit';
import { TaskbarEdit } from './taskbar-edit';
import { DialogEdit } from './dialog-edit';
import { Dialog } from '@syncfusion/ej2-popups';
import { NumericTextBoxModel } from '@syncfusion/ej2-inputs';
import { MultiSelect, CheckBoxSelection, DropDownList } from '@syncfusion/ej2-dropdowns';
import { ConnectorLineEdit } from './connector-line-edit';
import { ITreeData } from '@syncfusion/ej2-treegrid';




/**
 * The Edit Module is used to handle editing actions.
 *
 */
export class Edit {
    private parent: Gantt;
    public validatedChildItems: IGanttData[];
    private isFromDeleteMethod: boolean = false;
    private targetedRecords: IGanttData[] = [];
    /**
     * @private
     */
    /** @hidden */
    private ganttData: Object[] | DataManager;
    /** @hidden */
    private treeGridData: ITreeData[];
    /** @hidden */
    private draggedRecord: IGanttData;
    /** @hidden */
    private updateParentRecords: IGanttData[] = [];
    /** @hidden */
    private droppedRecord: IGanttData;
    /** @hidden */
    private isTreeGridRefresh: boolean;
    /** @hidden */
    public isaddtoBottom: boolean = false;
    /** @hidden */
    public addRowPosition: RowPosition;
    /** @hidden */
    public addRowIndex: number;
    /** @hidden */
    private dropPosition: string;
    public confirmDialog: Dialog = null;
    private taskbarMoved: boolean = false;
    private predecessorUpdated: boolean = false;
    public newlyAddedRecordBackup: IGanttData;
    public isBreakLoop: boolean = false;
    public addRowSelectedItem: IGanttData;
    public cellEditModule: CellEdit;
    public taskbarEditModule: TaskbarEdit;
    public dialogModule: DialogEdit;
    constructor(parent?: Gantt) {
        this.parent = parent;
        this.validatedChildItems = [];
        if (this.parent.editSettings.allowEditing && this.parent.editSettings.mode === 'Auto') {
            this.cellEditModule = new CellEdit(this.parent);
        }
        if (this.parent.taskFields.dependency) {
            this.parent.connectorLineEditModule = new ConnectorLineEdit(this.parent);
        }
        if (this.parent.editSettings.allowAdding || (this.parent.editSettings.allowEditing &&
            (this.parent.editSettings.mode === 'Dialog' || this.parent.editSettings.mode === 'Auto'))) {
            this.dialogModule = new DialogEdit(this.parent);
        }
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.taskbarEditModule = new TaskbarEdit(this.parent);
        }
        if (this.parent.editSettings.allowDeleting) {
            const confirmDialog: HTMLElement = createElement('div', {
                id: this.parent.element.id + '_deleteConfirmDialog'
            });
            this.parent.element.appendChild(confirmDialog);
            this.renderDeleteConfirmDialog();
        }
        this.parent.treeGrid.recordDoubleClick = this.recordDoubleClick.bind(this);
        this.parent.treeGrid.editSettings.allowAdding = this.parent.editSettings.allowAdding;
        this.parent.treeGrid.editSettings.allowDeleting = this.parent.editSettings.allowDeleting;
        this.parent.treeGrid.editSettings.showDeleteConfirmDialog = this.parent.editSettings.showDeleteConfirmDialog;
        this.parent.treeGrid.editSettings.allowNextRowEdit = this.parent.editSettings.allowNextRowEdit;
        this.updateDefaultColumnEditors();
    }

    private getModuleName(): string {
        return 'edit';
    }

    /**
     * Method to update default edit params and editors for Gantt
     *
     * @returns {void} .
     */
    private updateDefaultColumnEditors(): void {
        const customEditorColumns: string[] =
            [this.parent.taskFields.id, this.parent.taskFields.progress, this.parent.taskFields.resourceInfo, 'taskType'];
        for (let i: number = 0; i < customEditorColumns.length; i++) {
            if (!isNullOrUndefined(customEditorColumns[i]) && customEditorColumns[i].length > 0) {
                // eslint-disable-next-line
                const column: ColumnModel = this.parent.getColumnByField(customEditorColumns[i], this.parent.treeGridModule.treeGridColumns);
                if (column) {
                    if (column.field === this.parent.taskFields.id) {
                        this.updateIDColumnEditParams(column);
                    } else if (column.field === this.parent.taskFields.progress) {
                        this.updateProgessColumnEditParams(column);
                    } else if (column.field === this.parent.taskFields.resourceInfo) {
                        this.updateResourceColumnEditor(column);
                    } else if (column.field === 'taskType') {
                        this.updateTaskTypeColumnEditor(column);
                    }
                }
            }
        }
    }
    /**
     * Method to update editors for id column in Gantt
     *
     * @param {ColumnModel} column .
     * @returns {void} .
     */
    private updateIDColumnEditParams(column: ColumnModel): void {
        const editParam: NumericTextBoxModel = {
            min: 0,
            decimals: 0,
            validateDecimalOnType: true,
            format: 'n0',
            showSpinButton: false
        };
        this.updateEditParams(column, editParam);
    }

    /**
     * Method to update edit params of default progress column
     *
     * @param {ColumnModel} column .
     * @returns {void} .
     */
    private updateProgessColumnEditParams(column: ColumnModel): void {
        const editParam: NumericTextBoxModel = {
            min: 0,
            decimals: 0,
            validateDecimalOnType: true,
            max: 100,
            format: 'n0'
        };
        this.updateEditParams(column, editParam);
    }
    /**
     * Assign edit params for id and progress columns
     *
     * @param {ColumnModel} column .
     * @param {object} editParam .
     * @returns {void} .
     */
    private updateEditParams(column: ColumnModel, editParam: object): void {
        if (isNullOrUndefined(column.edit)) {
            column.edit = {};
            column.edit.params = {};
        } else if (isNullOrUndefined(column.edit.params)) {
            column.edit.params = {};
        }
        extend(editParam, column.edit.params);
        column.edit.params = editParam;
        const ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
        ganttColumn.edit = column.edit;
    }
    /**
     * Method to update resource column editor for default resource column
     *
     * @param {ColumnModel} column .
     * @returns {void} .
     */
    private updateResourceColumnEditor(column: ColumnModel): void {
        if (this.parent.editSettings.allowEditing && isNullOrUndefined(column.edit) && this.parent.editSettings.mode === 'Auto') {
            column.editType = 'dropdownedit';
            column.edit = this.getResourceEditor();
            const ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
            ganttColumn.editType = 'dropdownedit';
            ganttColumn.edit = column.edit;
        }
    }

    /**
     * Method to create resource custom editor
     *
     * @returns {IEditCell} .
     */
    private getResourceEditor(): IEditCell {
        const resourceSettings: ResourceFieldsModel = this.parent.resourceFields;
        const editObject: IEditCell = {};
        let editor: MultiSelect;
        MultiSelect.Inject(CheckBoxSelection);
        editObject.write = (args: { rowData: Object, element: Element, column: GanttColumn, row: HTMLElement, requestType: string }) => {
            this.parent.treeGridModule.currentEditRow = {};
            editor = new MultiSelect({
                dataSource: new DataManager(this.parent.resources),
                fields: { text: resourceSettings.name, value: resourceSettings.id },
                mode: 'CheckBox',
                showDropDownIcon: true,
                popupHeight: '350px',
                delimiterChar: ',',
                value: this.parent.treeGridModule.getResourceIds(args.rowData as IGanttData) as number[]
            });
            editor.appendTo(args.element as HTMLElement);
        };
        editObject.read = (element: HTMLElement): string => {
            let value: Object[] = (<EJ2Intance>element).ej2_instances[0].value;
            const resourcesName: string[] = [];
            if (isNullOrUndefined(value)) {
                value = [];
            }
            for (let i: number = 0; i < value.length; i++) {
                for (let j: number = 0; j < this.parent.resources.length; j++) {
                    if (this.parent.resources[j][resourceSettings.id] === value[i]) {
                        resourcesName.push(this.parent.resources[j][resourceSettings.name]);
                        break;
                    }
                }
            }
            this.parent.treeGridModule.currentEditRow[this.parent.taskFields.resourceInfo] = value;
            return resourcesName.join(',');
        };
        editObject.destroy = () => {
            if (editor) {
                editor.destroy();
            }
        };
        return editObject;
    }
    /**
     * Method to update task type column editor for task type
     *
     * @param {ColumnModel} column .
     * @returns {void} .
     */
    private updateTaskTypeColumnEditor(column: ColumnModel): void {
        if (this.parent.editSettings.allowEditing && isNullOrUndefined(column.edit) && this.parent.editSettings.mode === 'Auto') {
            column.editType = 'dropdownedit';
            column.edit = this.getTaskTypeEditor();
            const ganttColumn: ColumnModel = this.parent.getColumnByField(column.field, this.parent.ganttColumns);
            ganttColumn.editType = 'dropdownedit';
            ganttColumn.edit = column.edit;
        }
    }
    /**
     * Method to create task type custom editor
     *
     * @returns {IEditCell} .
     */
    private getTaskTypeEditor(): IEditCell {
        const editObject: IEditCell = {};
        let editor: DropDownList;
        const types: Object[] = [{ 'ID': 1, 'Value': 'FixedUnit' }, { 'ID': 2, 'Value': 'FixedWork' }, { 'ID': 3, 'Value': 'FixedDuration' }];
        editObject.write = (args: { rowData: Object, element: Element, column: GanttColumn, row: HTMLElement, requestType: string }) => {
            this.parent.treeGridModule.currentEditRow = {};
            editor = new DropDownList({
                dataSource: new DataManager(types),
                fields: { value: 'Value' },
                popupHeight: '350px',
                value: getValue('taskType', (args.rowData as IGanttData).ganttProperties)
            });
            editor.appendTo(args.element as HTMLElement);
        };
        editObject.read = (element: HTMLElement): string => {
            const value: string = (<EJ2Intance>element).ej2_instances[0].value;
            const key: string = 'taskType';
            this.parent.treeGridModule.currentEditRow[key] = value;
            return value;
        };
        editObject.destroy = () => {
            if (editor) {
                editor.destroy();
            }
        };
        return editObject;
    }
    /**
     * @returns {void} .
     * @private
     */
    public reUpdateEditModules(): void {
        const editSettings: EditSettingsModel = this.parent.editSettings;
        if (editSettings.allowEditing) {
            if (this.parent.editModule.cellEditModule && editSettings.mode === 'Dialog') {
                this.cellEditModule.destroy();
                this.parent.treeGrid.recordDoubleClick = this.recordDoubleClick.bind(this);
            } else if (isNullOrUndefined(this.parent.editModule.cellEditModule) && editSettings.mode === 'Auto') {
                this.cellEditModule = new CellEdit(this.parent);
            }
            if (this.parent.editModule.dialogModule && editSettings.mode === 'Auto') {
                this.parent.treeGrid.recordDoubleClick = undefined;
            } else if (isNullOrUndefined(this.parent.editModule.dialogModule)) {
                this.dialogModule = new DialogEdit(this.parent);
            }
        } else {
            if (this.cellEditModule) {
                this.cellEditModule.destroy();
            }
            if (this.dialogModule) {
                this.dialogModule.destroy();
            }
        }

        if (editSettings.allowDeleting && editSettings.showDeleteConfirmDialog) {
            if (isNullOrUndefined(this.confirmDialog)) {
                const confirmDialog: HTMLElement = createElement('div', {
                    id: this.parent.element.id + '_deleteConfirmDialog'
                });
                this.parent.element.appendChild(confirmDialog);
                this.renderDeleteConfirmDialog();
            }
        } else if (!editSettings.allowDeleting || !editSettings.showDeleteConfirmDialog) {
            if (this.confirmDialog && !this.confirmDialog.isDestroyed) {
                this.confirmDialog.destroy();
            }
        }

        if (editSettings.allowTaskbarEditing) {
            if (isNullOrUndefined(this.parent.editModule.taskbarEditModule)) {
                this.taskbarEditModule = new TaskbarEdit(this.parent);
            }
        } else {
            if (this.taskbarEditModule) {
                this.taskbarEditModule.destroy();
            }
        }
    }

    private recordDoubleClick(args: RecordDoubleClickEventArgs): void {
        if (this.parent.editSettings.allowEditing && this.parent.editSettings.mode === 'Dialog') {
            let ganttData: IGanttData;
            if (args.row) {
                const rowIndex: number = getValue('rowIndex', args.row);
                ganttData = this.parent.currentViewData[rowIndex];
            }
            if (!isNullOrUndefined(ganttData)) {
                this.dialogModule.openEditDialog(ganttData);
            }
        }
        this.parent.ganttChartModule.recordDoubleClick(args);
    }
    /**
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        if (this.cellEditModule) {
            this.cellEditModule.destroy();
        }
        if (this.taskbarEditModule) {
            this.taskbarEditModule.destroy();
        }
        if (this.dialogModule) {
            this.dialogModule.destroy();
        }
        if (this.confirmDialog && !this.confirmDialog.isDestroyed) {
            this.confirmDialog.destroy();
        }
    }
    /**
     * @private
     */
    public deletedTaskDetails: IGanttData[] = [];
    /**
     * Method to update record with new values.
     *
     * @param {Object} data - Defines new data to update.
     * @returns {void} .
     */
    public updateRecordByID(data: Object): void {
        if (!this.parent.readOnly) {
            const tasks: TaskFieldsModel = this.parent.taskFields;
            if (isNullOrUndefined(data) || isNullOrUndefined(data[tasks.id])) {
                return;
            }
            const ganttData: IGanttData = this.parent.viewType === 'ResourceView' ?
                this.parent.flatData[this.parent.getTaskIds().indexOf('T' + data[tasks.id])] : this.parent.getRecordByID(data[tasks.id]);
            if (!isNullOrUndefined(this.parent.editModule) && ganttData) {
                this.parent.isOnEdit = true;
                this.validateUpdateValues(data, ganttData, true);
                if (data[this.parent.taskFields.resourceInfo]) {
                    if (ganttData.ganttProperties.duration === 0) {
                        this.parent.dataOperation.updateWorkWithDuration(ganttData)
                    }
                    this.updateResourceRelatedFields(ganttData, 'resource');
                    this.parent.dateValidationModule.calculateEndDate(ganttData);
                }
                const keys: string[] = Object.keys(data);
                if (keys.indexOf(tasks.startDate) !== -1 || keys.indexOf(tasks.endDate) !== -1 ||
                    keys.indexOf(tasks.duration) !== -1) {
                    this.parent.dataOperation.calculateScheduledValues(ganttData, ganttData.taskData, false);
                }
                this.parent.dataOperation.updateWidthLeft(ganttData);
                if (!isUndefined(data[this.parent.taskFields.dependency]) &&
                    data[this.parent.taskFields.dependency] !== ganttData.ganttProperties.predecessorsName) {
                    this.parent.connectorLineEditModule.updatePredecessor(
                        ganttData, data[this.parent.taskFields.dependency]);
                } else {
                    const args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
                    args.data = ganttData;
                    if (this.parent.viewType === 'ResourceView') {
                        args.action = 'methodUpdate';
                    }
                    this.parent.editModule.initiateUpdateAction(args);
                }
            }
        }
    }
    /**
     *
     * @param {object} data .
     * @param {IGanttData} ganttData .
     * @param {boolean} isFromDialog .
     * @returns {void} .
     * @private
     */
    public validateUpdateValues(data: Object, ganttData: IGanttData, isFromDialog?: boolean): void {
        const ganttObj: Gantt = this.parent;
        const tasks: TaskFieldsModel = ganttObj.taskFields;
        const ganttPropByMapping: Object = getSwapKey(ganttObj.columnMapping);
        const scheduleFieldNames: string[] = [];
        let isScheduleValueUpdated: boolean = false;
        for (const key of Object.keys(data)) {
            if ([tasks.startDate, tasks.endDate, tasks.duration].indexOf(key) !== -1) {
                if (isNullOrUndefined(data[key]) && !ganttObj.allowUnscheduledTasks) {
                    continue;
                }
                if (isFromDialog) {
                    if (tasks.duration === key) {
                        ganttObj.dataOperation.updateDurationValue(data[key], ganttData.ganttProperties);
                        if (ganttData.ganttProperties.duration > 0 && ganttData.ganttProperties.isMilestone) {
                            this.parent.setRecordValue('isMilestone', false, ganttData.ganttProperties, true);
                        }
                        ganttObj.dataOperation.updateMappingData(ganttData, ganttPropByMapping[key]);
                    } else {
                        const tempDate: Date = typeof data[key] === 'string' ? new Date(data[key] as string) : data[key];
                        ganttObj.setRecordValue(ganttPropByMapping[key], tempDate, ganttData.ganttProperties, true);
                        ganttObj.dataOperation.updateMappingData(ganttData, ganttPropByMapping[key]);
                    }
                } else {
                    scheduleFieldNames.push(key);
                    isScheduleValueUpdated = true;
                }
            } else if (tasks.resourceInfo === key) {
                const resourceData: Object[] = ganttObj.dataOperation.setResourceInfo(data);
                if (this.parent.viewType === 'ResourceView') {
                    if (JSON.stringify(resourceData) !== JSON.stringify(ganttData.ganttProperties.resourceInfo)) {
                        this.parent.editModule.dialogModule.isResourceUpdate  = true;
                        this.parent.editModule.dialogModule.previousResource = !isNullOrUndefined(ganttData.ganttProperties.resourceInfo) ?
                            [...ganttData.ganttProperties.resourceInfo] : [];
                    } else {
                        this.parent.editModule.dialogModule.isResourceUpdate = false;
                    }
                }
                ganttData.ganttProperties.resourceInfo = resourceData;
                ganttObj.dataOperation.updateMappingData(ganttData, 'resourceInfo');
            } else if (tasks.dependency === key) {
                //..
            } else if ([tasks.progress, tasks.notes, tasks.durationUnit, tasks.expandState,
                tasks.milestone, tasks.name, tasks.baselineStartDate,
                tasks.baselineEndDate, tasks.id, tasks.segments].indexOf(key) !== -1) {
                const column: ColumnModel = ganttObj.columnByField[key];
                /* eslint-disable-next-line */
                let value: any = data[key];
                if (!isNullOrUndefined(column) && (column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit')) {
                    value = ganttObj.dataOperation.getDateFromFormat(value);
                }
                let ganttPropKey: string = ganttPropByMapping[key];
                if (key === tasks.id) {
                    ganttPropKey = 'taskId';
                } else if (key === tasks.name) {
                    ganttPropKey = 'taskName';
                } else if (key === tasks.segments) {
                    ganttPropKey = 'segments';
                    /* eslint-disable-next-line */
                    if (data && !isNullOrUndefined(data[this.parent.taskFields.segments]) && data[this.parent.taskFields.segments].length > 0) {
                        let totDuration: number = 0;
                        for (let i: number = 0; i < ganttData.ganttProperties.segments.length; i++) {
                            totDuration = totDuration + ganttData.ganttProperties.segments[i].duration;
                        }
                        const sdate: Date = ganttData.ganttProperties.startDate;
                        /* eslint-disable-next-line */
                        const edate: Date = this.parent.dataOperation.getEndDate(sdate, totDuration, ganttData.ganttProperties.durationUnit, ganttData.ganttProperties, false);
                        ganttObj.setRecordValue('endDate', ganttObj.dataOperation.getDateFromFormat(edate), ganttData.ganttProperties, true);
                    }
                }
                if (!isNullOrUndefined(ganttPropKey)) {
                    ganttObj.setRecordValue(ganttPropKey, value, ganttData.ganttProperties, true);
                }
                if ((key === tasks.baselineStartDate || key === tasks.baselineEndDate) &&
                    (ganttData.ganttProperties.baselineStartDate && ganttData.ganttProperties.baselineEndDate)) {
                    ganttObj.setRecordValue(
                        'baselineLeft', ganttObj.dataOperation.calculateBaselineLeft(
                            ganttData.ganttProperties),
                        ganttData.ganttProperties, true);
                    ganttObj.setRecordValue(
                        'baselineWidth', ganttObj.dataOperation.calculateBaselineWidth(
                            ganttData.ganttProperties),
                        ganttData.ganttProperties, true);
                }
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                /* eslint-disable-next-line */
                if (key === tasks.segments && data && !isNullOrUndefined(data[this.parent.taskFields.segments]) && data[this.parent.taskFields.segments].length > 0) {
                    ganttObj.dataOperation.setSegmentsInfo(ganttData, true);
                }
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (tasks.indicators === key) {
                const value: Object[] = data[key];
                ganttObj.setRecordValue('indicators', value, ganttData.ganttProperties, true);
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (tasks.work === key) {
                ganttObj.setRecordValue('work', data[key], ganttData.ganttProperties, true);
                this.parent.dataOperation.updateMappingData(ganttData, 'work');
                this.parent.dataOperation.updateMappingData(ganttData, 'duration');
                this.parent.dataOperation.updateMappingData(ganttData, 'endDate');
            } else if (key === 'taskType') {
                ganttObj.setRecordValue('taskType', data[key], ganttData.ganttProperties, true);
                //this.parent.dataOperation.updateMappingData(ganttData, 'taskType');
            } else if (ganttObj.customColumns.indexOf(key) !== -1) {
                const column: ColumnModel = ganttObj.columnByField[key];
                /* eslint-disable-next-line */
                let value: any = data[key];
                if (isNullOrUndefined(column.edit)) {
                    if (column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit') {
                        value = ganttObj.dataOperation.getDateFromFormat(value);
                    }
                }
                ganttObj.setRecordValue('taskData.' + key, value, ganttData);
                ganttObj.setRecordValue(key, value, ganttData);
            } else if (tasks.manual === key) {
                ganttObj.setRecordValue('isAutoSchedule', !data[key], ganttData.ganttProperties, true);
                this.parent.setRecordValue(key, data[key], ganttData);
                this.updateTaskScheduleModes(ganttData);
            }
        }
        if (isScheduleValueUpdated) {
            this.validateScheduleValues(scheduleFieldNames, ganttData, data);
        }
    }

    /**
     * To update duration, work, resource unit
     *
     * @param {IGanttData} currentData .
     * @param {string} column .
     * @returns {void} .
     */
    public updateResourceRelatedFields(currentData: IGanttData, column: string): void {
        const ganttProp: ITaskData = currentData.ganttProperties;
        const taskType: string = ganttProp.taskType;
        let isEffectDriven: boolean;
        const isAutoSchedule: boolean = ganttProp.isAutoSchedule;
        if (!isNullOrUndefined(ganttProp.resourceInfo)) {
            if (ganttProp.work > 0 || column === 'work') {
                switch (taskType) {
                case 'FixedUnit':
                    if (ganttProp.resourceInfo.length === 0) {
                        return;
                    }
                    else if (isAutoSchedule && ganttProp.resourceInfo.length &&
                            (column === 'work' || (column === 'resource'))) {
                        this.parent.dataOperation.updateDurationWithWork(currentData);
                    } else if (!isAutoSchedule && column === 'work') {
                        this.parent.dataOperation.updateUnitWithWork(currentData);
                    } else {
                        this.parent.dataOperation.updateWorkWithDuration(currentData);
                    }
                    break;
                case 'FixedWork':
                    if (ganttProp.resourceInfo.length === 0) {
                        return;
                    } else if (isAutoSchedule) {
                        if (column === 'duration' || column === 'endDate') {
                            this.parent.dataOperation.updateUnitWithWork(currentData);
                            if (ganttProp.duration === 0) {
                                this.parent.setRecordValue('work', 0, ganttProp, true);
                                if (!isNullOrUndefined(this.parent.taskFields.work)) {
                                    this.parent.dataOperation.updateMappingData(currentData, 'work');
                                }
                            }
                        } else {
                            this.parent.dataOperation.updateDurationWithWork(currentData);
                        }
                    } else {
                        if (column === 'work') {
                            this.parent.dataOperation.updateUnitWithWork(currentData);
                        } else {
                            this.parent.dataOperation.updateWorkWithDuration(currentData);
                        }
                    }
                    break;
                case 'FixedDuration':
                    if (ganttProp.resourceInfo.length && (column === 'work' || (isAutoSchedule &&
                            isEffectDriven && (column === 'resource')))) {
                        this.parent.dataOperation.updateUnitWithWork(currentData);
                    } else {
                        this.parent.dataOperation.updateWorkWithDuration(currentData);
                    }
                    break;
                }
            } else {
                this.parent.dataOperation.updateWorkWithDuration(currentData);
            }
        }
    }

    private validateScheduleValues(fieldNames: string[], ganttData: IGanttData, data: Object): void {
        const ganttObj: Gantt = this.parent;
        if (fieldNames.length > 2) {
            ganttObj.dataOperation.calculateScheduledValues(ganttData, data, false);
        } else if (fieldNames.length > 1) {
            this.validateScheduleByTwoValues(data, fieldNames, ganttData);
        } else {
            this.dialogModule.validateScheduleValuesByCurrentField(fieldNames[0], data[fieldNames[0]], ganttData);
        }
    }
    private validateScheduleByTwoValues(data: Object, fieldNames: string[], ganttData: IGanttData): void {
        const ganttObj: Gantt = this.parent; let startDate: Date; let endDate: Date; let duration: string;
        const tasks: TaskFieldsModel = ganttObj.taskFields; const ganttProp: ITaskData = ganttData.ganttProperties;
        const isUnscheduledTask: boolean = ganttObj.allowUnscheduledTasks;
        if (fieldNames.indexOf(tasks.startDate) !== -1) {
            startDate = data[tasks.startDate];
        }
        if (fieldNames.indexOf(tasks.endDate) !== -1) {
            endDate = data[tasks.endDate];
        }
        if (fieldNames.indexOf(tasks.duration) !== -1) {
            duration = data[tasks.duration];
        }
        if (startDate && endDate || (isUnscheduledTask && (fieldNames.indexOf(tasks.startDate) !== -1) &&
            (fieldNames.indexOf(tasks.endDate) !== -1))) {
            ganttObj.setRecordValue('startDate', ganttObj.dataOperation.getDateFromFormat(startDate), ganttProp, true);
            ganttObj.setRecordValue('endDate', ganttObj.dataOperation.getDateFromFormat(endDate), ganttProp, true);
            ganttObj.dataOperation.calculateDuration(ganttData);
        } else if (endDate && duration || (isUnscheduledTask &&
            (fieldNames.indexOf(tasks.endDate) !== -1) && (fieldNames.indexOf(tasks.duration) !== -1))) {
            ganttObj.setRecordValue('endDate', ganttObj.dataOperation.getDateFromFormat(endDate), ganttProp, true);
            ganttObj.dataOperation.updateDurationValue(duration, ganttProp);
        } else if (startDate && duration || (isUnscheduledTask && (fieldNames.indexOf(tasks.startDate) !== -1)
            && (fieldNames.indexOf(tasks.duration) !== -1))) {
            ganttObj.setRecordValue('startDate', ganttObj.dataOperation.getDateFromFormat(startDate), ganttProp, true);
            ganttObj.dataOperation.updateDurationValue(duration, ganttProp);
        }
    }

    private isTaskbarMoved(data: IGanttData): boolean {
        let isMoved: boolean = false;
        const taskData: ITaskData = data.ganttProperties;
        const prevData: IGanttData = this.parent.previousRecords &&
            this.parent.previousRecords[data.uniqueID];
        if (prevData && prevData.ganttProperties) {
            const prevStart: Date = getValue('ganttProperties.startDate', prevData) as Date;
            const prevEnd: Date = getValue('ganttProperties.endDate', prevData) as Date;
            const prevDuration: number = getValue('ganttProperties.duration', prevData);
            const prevDurationUnit: string = getValue('ganttProperties.durationUnit', prevData);
            const keys: string[] = Object.keys(prevData.ganttProperties);
            if (keys.indexOf('startDate') !== -1 || keys.indexOf('endDate') !== -1 ||
                keys.indexOf('duration') !== -1 || keys.indexOf('durationUnit') !== -1) {
                if ((isNullOrUndefined(prevStart) && !isNullOrUndefined(taskData.startDate)) ||
                    (isNullOrUndefined(prevEnd) && !isNullOrUndefined(taskData.endDate)) ||
                    (isNullOrUndefined(taskData.startDate) && !isNullOrUndefined(prevStart)) ||
                    (isNullOrUndefined(taskData.endDate) && !isNullOrUndefined(prevEnd)) ||
                    (prevStart && prevStart.getTime() !== taskData.startDate.getTime())
                    || (prevEnd && prevEnd.getTime() !== taskData.endDate.getTime())
                    || (!isNullOrUndefined(prevDuration) && prevDuration !== taskData.duration)
                    || (!isNullOrUndefined(prevDuration) && prevDuration === taskData.duration &&
                        prevDurationUnit !== taskData.durationUnit)) {
                    isMoved = true;
                }
            }
        }
        return isMoved;
    }

    private isPredecessorUpdated(data: IGanttData): boolean {
        let isPredecessorUpdated: boolean = false;
        const prevData: IGanttData = this.parent.previousRecords[data.uniqueID];
        // eslint-disable-next-line
        if (prevData && prevData.ganttProperties && prevData.ganttProperties.hasOwnProperty('predecessor')) {
            if (data.ganttProperties.predecessorsName !== prevData.ganttProperties.predecessorsName) {
                isPredecessorUpdated = true;
            } else {
                this.parent.setRecordValue('predecessor', prevData.ganttProperties.predecessor, data.ganttProperties, true);
            }
        }
        return isPredecessorUpdated;
    }

    /**
     * Method to check need to open predecessor validate dialog
     *
     * @param {IGanttData} data .
     * @returns {boolean} .
     */
    private isCheckPredecessor(data: IGanttData): boolean {
        let isValidatePredecessor: boolean = false;
        const prevData: IGanttData = this.parent.previousRecords[data.uniqueID];

        if (prevData && this.parent.taskFields.dependency && this.parent.isInPredecessorValidation &&
            this.parent.predecessorModule.getValidPredecessor(data).length > 0) {

            if (this.isTaskbarMoved(data)) {
                isValidatePredecessor = true;
            }
        }
        return isValidatePredecessor;
    }
    /**
     * Method to copy the ganttProperties values
     *
     * @param {IGanttData} data .
     * @param {IGanttData} updateData .
     * @returns {void} .
     * @private
     */
    public updateGanttProperties(data: IGanttData, updateData: IGanttData): void {
        const skipProperty: string[] = ['taskId', 'uniqueID', 'rowUniqueID', 'parentId'];
        Object.keys(data.ganttProperties).forEach((property: string) => {
            if (skipProperty.indexOf(property) === -1) {
                updateData.ganttProperties[property] = data.ganttProperties[property];
            }
        });
    }
    /**
     * Method to update all dependent record on edit action
     *
     * @param {ITaskAddedEventArgs} args .
     * @returns {void} .
     * @private
     */
    public initiateUpdateAction(args: ITaskbarEditedEventArgs): void {
        const isValidatePredecessor: boolean = this.isCheckPredecessor(args.data);
        this.taskbarMoved = this.isTaskbarMoved(args.data);
        this.predecessorUpdated = this.isPredecessorUpdated(args.data);
        if (this.predecessorUpdated) {
            this.parent.isConnectorLineUpdate = true;
            this.parent.connectorLineEditModule.addRemovePredecessor(args.data);
        }
        let validateObject: object = {};
        if (isValidatePredecessor) {
            validateObject = this.parent.connectorLineEditModule.validateTypes(args.data);
            this.parent.isConnectorLineUpdate = true;
            if (!isNullOrUndefined(getValue('violationType', validateObject))) {
                const newArgs: IValidateArgs = this.validateTaskEvent(args);
                if (newArgs.validateMode.preserveLinkWithEditing === false &&
                    newArgs.validateMode.removeLink === false &&
                    newArgs.validateMode.respectLink === false) {
                    this.parent.connectorLineEditModule.openValidationDialog(validateObject);
                } else {
                    this.parent.connectorLineEditModule.applyPredecessorOption();
                }
            } else {
                this.updateEditedTask(args);
            }
        } else {
            if (this.taskbarMoved) {
                this.parent.isConnectorLineUpdate = true;
            }
            this.updateEditedTask(args);
        }
    }

    /**
     *
     * @param {ITaskbarEditedEventArgs} editedEventArgs method to trigger validate predecessor link by dialog
     * @returns {IValidateArgs} .
     */
    private validateTaskEvent(editedEventArgs: ITaskbarEditedEventArgs): IValidateArgs {
        const newArgs: IValidateArgs = {};
        this.resetValidateArgs();
        this.parent.currentEditedArgs = newArgs;
        newArgs.cancel = false;
        newArgs.data = editedEventArgs.data;
        newArgs.requestType = 'validateLinkedTask';
        newArgs.validateMode = this.parent.dialogValidateMode;
        newArgs.editEventArgs = editedEventArgs;
        this.parent.actionBeginTask(newArgs);
        return newArgs;
    }

    private resetValidateArgs(): void {
        this.parent.dialogValidateMode.preserveLinkWithEditing = true;
        this.parent.dialogValidateMode.removeLink = false;
        this.parent.dialogValidateMode.respectLink = false;
    }

    /**
     *
     * @param {ITaskAddedEventArgs} args - Edited event args like taskbar editing, dialog editing, cell editing
     * @returns {void} .
     * @private
     */
    public updateEditedTask(args: ITaskbarEditedEventArgs): void {
        const ganttRecord: IGanttData = args.data;
        this.updateParentChildRecord(ganttRecord);
        if (this.parent.isConnectorLineUpdate) {
            /* validating predecessor for updated child items */
            for (let i: number = 0; i < this.validatedChildItems.length; i++) {
                const child: IGanttData = this.validatedChildItems[i];
                if (child.ganttProperties.predecessor && child.ganttProperties.predecessor.length > 0) {
                    this.parent.editedTaskBarItem = child;
                    this.parent.predecessorModule.validatePredecessor(child, [], '');
                }
            }
            /** validating predecessor for current edited records */
            if (ganttRecord.ganttProperties.predecessor) {
                this.parent.isMileStoneEdited = ganttRecord.ganttProperties.isMilestone;
                if (this.taskbarMoved) {
                    this.parent.editedTaskBarItem = ganttRecord;
                }
                this.parent.predecessorModule.validatePredecessor(ganttRecord, [], '');
            }
            this.updateParentItemOnEditing();
        }
        /** Update parent up-to zeroth level */
        if (ganttRecord.parentItem ) {
            this.parent.dataOperation.updateParentItems(ganttRecord, true);
        }
        this.initiateSaveAction(args);
    }

    private updateParentItemOnEditing(): void {
        const childRecord: object[] = getValue('parentRecord', this.parent.predecessorModule);
        for (let i: number = 0; i < childRecord.length; i++) {
            this.parent.dataOperation.updateParentItems(childRecord[i]);
        }
        setValue('parentRecord', [], this.parent.predecessorModule);
        setValue('parentIds', [], this.parent.predecessorModule);
    }
    /**
     * To update parent records while perform drag action.
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public updateParentChildRecord(data: IGanttData): void {
        const ganttRecord: IGanttData = data;
        if (ganttRecord.hasChildRecords && this.taskbarMoved && this.parent.taskMode === 'Auto' && (!isNullOrUndefined(this.parent.editModule.cellEditModule) && !this.parent.editModule.cellEditModule.isResourceCellEdited)) {
            this.updateChildItems(ganttRecord);
        }
        if (!isNullOrUndefined(this.parent.editModule.cellEditModule)) {
            this.parent.editModule.cellEditModule.isResourceCellEdited = false;
        }
    }
    /**
     * To update records while changing schedule mode.
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public updateTaskScheduleModes(data: IGanttData): void {
        const currentValue: Date = data[this.parent.taskFields.startDate];
        const ganttProp: ITaskData = data.ganttProperties;
        if (data.hasChildRecords && ganttProp.isAutoSchedule) {
            this.parent.setRecordValue('startDate', ganttProp.autoStartDate, ganttProp, true);
            this.parent.setRecordValue('endDate', ganttProp.autoEndDate, ganttProp, true);
            this.parent.setRecordValue('width', this.parent.dataOperation.calculateWidth(data, true), ganttProp, true);
            this.parent.setRecordValue('left', this.parent.dataOperation.calculateLeft(ganttProp, true), ganttProp, true);
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(ganttProp.width, ganttProp.progress),
                ganttProp,
                true
            );
            this.parent.dataOperation.calculateDuration(data);
        } else if (data.hasChildRecords && !ganttProp.isAutoSchedule) {
            this.parent.dataOperation.updateWidthLeft(data);
            this.parent.dataOperation.calculateDuration(data);
            this.parent.setRecordValue('autoStartDate', ganttProp.startDate, ganttProp, true);
            this.parent.setRecordValue('autoEndDate', ganttProp.endDate, ganttProp, true);
            this.parent.setRecordValue('autoDuration', this.parent.dataOperation.calculateAutoDuration(data), ganttProp, true);
            this.parent.dataOperation.updateAutoWidthLeft(data);
        } else {
            const startDate: Date = this.parent.dateValidationModule.checkStartDate(currentValue, data.ganttProperties);
            this.parent.setRecordValue('startDate', startDate, data.ganttProperties, true);
            this.parent.dataOperation.updateMappingData(data, 'startDate');
            this.parent.dateValidationModule.calculateEndDate(data);
            this.parent.setRecordValue(
                'taskData.' + this.parent.taskFields.manual,
                data[this.parent.taskFields.manual], data);
            this.parent.dataOperation.updateWidthLeft(data);
        }
    }

    /**
     *
     * @param {IGanttData} data .
     * @param {Date} newStartDate .
     * @returns {void} .
     */
    private calculateDateByRoundOffDuration(data: IGanttData, newStartDate: Date): void {
        const ganttRecord: IGanttData = data;
        const taskData: ITaskData = ganttRecord.ganttProperties;
        const projectStartDate: Date = new Date(newStartDate.getTime());
        if (!isNullOrUndefined(taskData.endDate) && isNullOrUndefined(taskData.startDate)) {
            const endDate: Date = this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData, null);
            this.parent.setRecordValue(
                'endDate',
                this.parent.dateValidationModule.checkEndDate(endDate, ganttRecord.ganttProperties),
                taskData,
                true);
        } else {
            this.parent.setRecordValue(
                'startDate',
                this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData, false),
                taskData,
                true);
            if (!isNullOrUndefined(taskData.duration)) {
                this.parent.dateValidationModule.calculateEndDate(ganttRecord);
            }
        }
        this.parent.dataOperation.updateWidthLeft(data);
        this.parent.dataOperation.updateTaskData(ganttRecord);
    }

    /**
     * To update progress value of parent tasks
     *
     * @param {IParent} cloneParent .
     * @returns {void} .
     * @private
     */
    public updateParentProgress(cloneParent: IParent): void {
        let parentProgress: number = 0;
        const parent: IGanttData = this.parent.getParentTask(cloneParent);
        const childRecords: IGanttData[] = parent.childRecords;
        const childCount: number = childRecords ? childRecords.length : 0;
        let totalProgress: number = 0;
        let milesStoneCount: number = 0;
        let taskCount: number = 0;
        let totalDuration: number = 0;
        let progressValues: Object = {};
        if (childRecords) {
            for (let i: number = 0; i < childCount; i++) {
                if ((!childRecords[i].ganttProperties.isMilestone || childRecords[i].hasChildRecords) &&
                    isScheduledTask(childRecords[i].ganttProperties)) {
                    progressValues = this.parent.dataOperation.getParentProgress(childRecords[i]);
                    totalProgress += getValue('totalProgress', progressValues);
                    totalDuration += getValue('totalDuration', progressValues);
                } else {
                    milesStoneCount += 1;
                }
            }
            taskCount = childCount - milesStoneCount;
            parentProgress = taskCount > 0 ? Math.round(totalProgress / totalDuration) : 0;
            if (isNaN(parentProgress)) {
                parentProgress = 0;
            }
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(
                    parent.ganttProperties.isAutoSchedule ? parent.ganttProperties.width : parent.ganttProperties.autoWidth,
                    parentProgress),
                parent.ganttProperties,
                true);
            this.parent.setRecordValue('progress', Math.floor(parentProgress), parent.ganttProperties, true);
            this.parent.setRecordValue('totalProgress', totalProgress, parent.ganttProperties, true);
            this.parent.setRecordValue('totalDuration', totalDuration, parent.ganttProperties, true);
        }
        this.parent.dataOperation.updateTaskData(parent);
        if (parent.parentItem) {
            this.updateParentProgress(parent.parentItem);
        }
    }

    /**
     * Method to revert cell edit action
     *
     * @param {object} args .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    public revertCellEdit(args: object): void {
        this.parent.editModule.reUpdatePreviousRecords(false, true);
        this.resetEditProperties();
    }

    /**
     * @param {boolean} isRefreshChart .
     * @param {boolean} isRefreshGrid .
     * @returns {void} .
     * @private
     */
    public reUpdatePreviousRecords(isRefreshChart?: boolean, isRefreshGrid?: boolean): void {
        const collection: object = this.parent.previousRecords;
        const keys: string[] = Object.keys(collection);
        for (let i: number = 0; i < keys.length; i++) {
            const uniqueId: string = keys[i];
            const prevTask: IGanttData = collection[uniqueId] as IGanttData;
            const originalData: IGanttData = this.parent.getTaskByUniqueID(uniqueId);
            this.copyTaskData(originalData.taskData, prevTask.taskData);
            delete prevTask.taskData;
            this.copyTaskData(originalData.ganttProperties, prevTask.ganttProperties);
            delete prevTask.ganttProperties;
            this.copyTaskData(originalData, prevTask);
            const rowIndex: number = this.parent.currentViewData.indexOf(originalData);
            if (isRefreshChart) {
                this.parent.chartRowsModule.refreshRow(rowIndex);
            }
            if (isRefreshGrid) {
                const dataId: number | string = this.parent.viewType === 'ProjectView' ? originalData.ganttProperties.taskId : originalData.ganttProperties.rowUniqueID;
                this.parent.treeGrid.grid.setRowData(dataId, originalData);
                const row: Row<Column> = this.parent.treeGrid.grid.getRowObjectFromUID(
                    this.parent.treeGrid.grid.getDataRows()[rowIndex].getAttribute('data-uid'));
                row.data = originalData;
            }
        }
    }
    /**
     * Copy previous task data value to edited task data
     *
     * @param {object} existing .
     * @param {object} newValue .
     * @returns {void} .
     */
    private copyTaskData(existing: Object, newValue: object): void {
        if (!isNullOrUndefined(newValue)) {
            extend(existing, newValue);
        }
    }

    /**
     * To update schedule date on editing.
     *
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private updateScheduleDatesOnEditing(args: ITaskbarEditedEventArgs): void {
        //..
    }

    /**
     *
     * @param {IGanttData} ganttRecord .
     * @returns {void} .
     */
    private updateChildItems(ganttRecord: IGanttData): void {
        const previousData: IGanttData = this.parent.previousRecords[ganttRecord.uniqueID];
        let previousStartDate: Date;
        if (isNullOrUndefined(previousData) ||
            (isNullOrUndefined(previousData) && !isNullOrUndefined(previousData.ganttProperties))) {
            previousStartDate = new Date(ganttRecord.ganttProperties.startDate.getTime());
        } else {
            previousStartDate = new Date(previousData.ganttProperties.startDate.getTime());
        }
        const currentStartDate: Date = ganttRecord.ganttProperties.startDate;
        const childRecords: IGanttData[] = [];
        let validStartDate: Date;
        let validEndDate: Date;
        let calcEndDate: Date;
        let isRightMove: boolean;
        let durationDiff: number;
        this.getUpdatableChildRecords(ganttRecord, childRecords);
        if (childRecords.length === 0) {
            return;
        }
        if (previousStartDate.getTime() > currentStartDate.getTime()) {
            validStartDate = this.parent.dateValidationModule.checkStartDate(currentStartDate);
            validEndDate = this.parent.dateValidationModule.checkEndDate(previousStartDate, ganttRecord.ganttProperties);
            isRightMove = false;
        } else {
            validStartDate = this.parent.dateValidationModule.checkStartDate(previousStartDate);
            validEndDate = this.parent.dateValidationModule.checkEndDate(currentStartDate, ganttRecord.ganttProperties);
            isRightMove = true;
        }
        //Get Duration
        if (validStartDate.getTime() >= validEndDate.getTime()) {
            durationDiff = 0;
        } else {
            durationDiff = this.parent.dateValidationModule.getDuration(validStartDate, validEndDate, 'minute', true, false);
        }
        for (let i: number = 0; i < childRecords.length; i++) {
            if (childRecords[i].ganttProperties.isAutoSchedule) {
                if (durationDiff > 0) {
                    const startDate: Date = isScheduledTask(childRecords[i].ganttProperties) ?
                        childRecords[i].ganttProperties.startDate : childRecords[i].ganttProperties.startDate ?
                            childRecords[i].ganttProperties.startDate : childRecords[i].ganttProperties.endDate ?
                                childRecords[i].ganttProperties.endDate : new Date(previousStartDate.toString());
                    if (isRightMove) {
                        calcEndDate = this.parent.dateValidationModule.getEndDate(
                            this.parent.dateValidationModule.checkStartDate(
                                startDate,
                                childRecords[i].ganttProperties,
                                childRecords[i].ganttProperties.isMilestone),
                            durationDiff,
                            'minute',
                            childRecords[i].ganttProperties,
                            false
                        );
                    } else {
                        calcEndDate = this.parent.dateValidationModule.getStartDate(
                            this.parent.dateValidationModule.checkEndDate(startDate, childRecords[i].ganttProperties),
                            durationDiff,
                            'minute',
                            childRecords[i].ganttProperties);
                    }
                    this.calculateDateByRoundOffDuration(childRecords[i], calcEndDate);
                    if (this.parent.isOnEdit && this.validatedChildItems.indexOf(childRecords[i]) === -1) {
                        this.validatedChildItems.push(childRecords[i]);
                    }
                } else if (isNullOrUndefined(previousData)) {
                    calcEndDate = previousStartDate;
                    this.calculateDateByRoundOffDuration(childRecords[i], calcEndDate);
                    if (this.parent.isOnEdit && this.validatedChildItems.indexOf(childRecords[i]) === -1) {
                        this.validatedChildItems.push(childRecords[i]);
                    }
                }
            }
        }
        if (childRecords.length) {
            this.parent.dataOperation.updateParentItems(ganttRecord, true);
        }
    }

    /**
     * To get updated child records.
     *
     * @param {IGanttData} parentRecord .
     * @param {IGanttData} childLists .
     * @returns {void} .
     */
    private getUpdatableChildRecords(parentRecord: IGanttData, childLists: IGanttData[]): void {
        const childRecords: IGanttData[] = parentRecord.childRecords;
        for (let i: number = 0; i < childRecords.length; i++) {
            if (childRecords[i].ganttProperties.isAutoSchedule) {
                childLists.push(childRecords[i]);
                if (childRecords[i].hasChildRecords) {
                    this.getUpdatableChildRecords(childRecords[i], childLists);
                }
            }
        }
    }

    /**
     * @param {ITaskbarEditedEventArgs} args .
     * @returns {void} .
     * @private
     */
    public initiateSaveAction(args: ITaskbarEditedEventArgs): void {
        this.parent.showSpinner();
        let eventArgs: IActionBeginEventArgs = {};
        eventArgs.requestType = 'beforeSave';
        eventArgs.data = args.data;
        eventArgs.cancel = false;
        eventArgs.modifiedRecords = this.parent.editedRecords;
        if (!isNullOrUndefined(args.target)) {
            eventArgs.target = args.target;
        }
        eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords, true);
        if (args.action && args.action === 'DrawConnectorLine') {
            eventArgs.action = 'DrawConnectorLine';
        }
        this.parent.trigger('actionBegin', eventArgs, (eventArg: IActionBeginEventArgs) => {
            if (eventArg.cancel) {
                this.reUpdatePreviousRecords();
                this.parent.chartRowsModule.refreshRecords([args.data]);
                this.resetEditProperties(eventArgs);
                // Trigger action complete event with save canceled request type
            } else {
                eventArg.modifiedTaskData = getTaskData(eventArg.modifiedRecords, null, null, this.parent);
                if (isRemoteData(this.parent.dataSource)) {
                    const data: DataManager = this.parent.dataSource as DataManager;
                    const updatedData: object = {
                        changedRecords: eventArg.modifiedTaskData
                    };
                    const query: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
                    let crud: Promise<Object> = null;
                    const dataAdaptor: AdaptorOptions = data.adaptor;
                    if (!(dataAdaptor instanceof WebApiAdaptor && dataAdaptor instanceof ODataAdaptor) || data.dataSource.batchUrl) {
                        crud = data.saveChanges(updatedData, this.parent.taskFields.id, null, query) as Promise<Object>;
                    } else {
                        const changedRecords: string = 'changedRecords';
                        crud = data.update(this.parent.taskFields.id, updatedData[changedRecords], null, query) as Promise<Object>;
                    }
                    crud.then((e: ReturnType) => this.dmSuccess(e, args))
                        .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                } else {
                    this.saveSuccess(args);
                }
            }
        });
    }

    private dmSuccess(e: ReturnType, args: ITaskbarEditedEventArgs): void {
        this.saveSuccess(args);
    }

    private dmFailure(e: { result: Object[] }, args: ITaskbarEditedEventArgs): void {// eslint-disable-line
        if (this.deletedTaskDetails.length) {
            const deleteRecords: IGanttData[] = this.deletedTaskDetails;
            for (let d: number = 0; d < deleteRecords.length; d++) {
                deleteRecords[d].isDelete = false;
            }
            this.deletedTaskDetails = [];
        }
        this.reUpdatePreviousRecords(true, true);
        this.resetEditProperties();
        this.parent.trigger('actionFailure', { error: e });
    }
    private updateSharedTask(data: IGanttData): void {
        const ids: string[] = data.ganttProperties.sharedTaskUniqueIds;
        for (let i: number = 0; i < ids.length; i++) {
            const editRecord: IGanttData = this.parent.flatData[this.parent.ids.indexOf(ids[i].toString())];
            if (editRecord.uniqueID !== data.uniqueID) {
                this.updateGanttProperties(data, editRecord);
                this.parent.setRecordValue('taskData', data.taskData, editRecord, true);
                this.parent.dataOperation.updateTaskData(editRecord);
                this.parent.dataOperation.updateResourceName(editRecord);
                if (!isNullOrUndefined(editRecord.parentItem)) {
                    this.parent.dataOperation.updateParentItems(editRecord.parentItem);
                }
            }
        }
    }
    /**
     * Method for save action success for local and remote data
     *
     * @param {ITaskAddedEventArgs} args .
     * @returns {void} .
     */
    private saveSuccess(args: ITaskbarEditedEventArgs): void {
        const eventArgs: IActionBeginEventArgs = {};
        if (this.parent.timelineSettings.updateTimescaleView) {
            const tempArray: IGanttData[] = this.parent.editedRecords;
            this.parent.timelineModule.updateTimeLineOnEditing([tempArray], args.action);
        }
        if (this.parent.viewType === 'ResourceView') {
            if (args.action === 'TaskbarEditing') {
                this.updateSharedTask(args.data);
            } else if (args.action === 'DialogEditing' || args.action === 'CellEditing'  || args.action === 'methodUpdate') {
                if (this.parent.editModule.dialogModule.isResourceUpdate) {
                    /* eslint-disable-next-line */
                    this.updateResoures(this.parent.editModule.dialogModule.previousResource, args.data.ganttProperties.resourceInfo, args.data);
                    this.updateSharedTask(args.data);
                    this.isTreeGridRefresh = true;
                } else {
                    this.updateSharedTask(args.data);
                }
            }
            // method to update the edited parent records
            for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                this.parent.dataOperation.updateParentItems(this.updateParentRecords[k]);
            }
            this.updateParentRecords = [];
            this.parent.editModule.dialogModule.isResourceUpdate = false;
            this.parent.editModule.dialogModule.previousResource = [];
        }
        if (!this.isTreeGridRefresh) {
            this.parent.chartRowsModule.refreshRecords(this.parent.editedRecords);
            if (this.parent.isConnectorLineUpdate && !isNullOrUndefined(this.parent.connectorLineEditModule)) {
                this.parent.updatedConnectorLineCollection = [];
                this.parent.connectorLineIds = [];
                this.parent.connectorLineEditModule.refreshEditedRecordConnectorLine(this.parent.editedRecords);
                this.updateScheduleDatesOnEditing(args);
            }
        }
        if (!this.parent.editSettings.allowTaskbarEditing || (this.parent.editSettings.allowTaskbarEditing &&
            !this.taskbarEditModule.dependencyCancel)) {
            eventArgs.requestType = 'save';
            eventArgs.data = args.data;
            eventArgs.modifiedRecords = this.parent.editedRecords;
            eventArgs.modifiedTaskData = getTaskData(this.parent.editedRecords, null, null, this.parent);
            if (!isNullOrUndefined(args.action)) {
                setValue('action', args.action, eventArgs);
            }
            if (args.action === 'TaskbarEditing') {
                eventArgs.taskBarEditAction = args.taskBarEditAction;
            }
            this.endEditAction(args);
            this.parent.trigger('actionComplete', eventArgs);
        } else {
            this.taskbarEditModule.dependencyCancel = false;
            this.resetEditProperties();
        }
        if (this.parent.viewType === 'ResourceView' && this.isTreeGridRefresh) {
            this.parent.treeGrid.parentData = [];
            this.parent.treeGrid.refresh();
            this.isTreeGridRefresh = false;
        }
    }

    private updateResoures(prevResource: Object[], currentResource: Object[], updateRecord: IGanttData): void {
        const flatRecords: IGanttData[] = this.parent.flatData;
        const currentLength: number = currentResource ? currentResource.length : 0;
        const previousLength: number = prevResource ? prevResource.length : 0;
        if (currentLength === 0 && previousLength === 0) {
            return;
        }
        for (let index: number = 0; index < currentLength; index++) {
            const recordIndex: number[] = [];
            const resourceID: number = parseInt(currentResource[index][this.parent.resourceFields.id], 10);
            for (let i: number = 0; i < prevResource.length; i++) {
                if (parseInt(prevResource[i][this.parent.resourceFields.id], 10) === resourceID) {
                    recordIndex.push(i);
                    break;
                }
            }
            if (recordIndex.length === 0) {
                const parentRecord: IGanttData = flatRecords[this.parent.getTaskIds().indexOf('R' + resourceID)];
                if (parentRecord) {
                    this.addNewRecord(updateRecord, parentRecord);
                }
            } else {
                prevResource.splice(parseInt(recordIndex[0].toString(), 10), 1);
            }
        }
        const prevLength: number = prevResource ? prevResource.length : 0;
        for (let index: number = 0; index < prevLength; index++) {
            const taskID: string = updateRecord.ganttProperties.taskId;
            const resourceID: string = prevResource[index][this.parent.resourceFields.id];
            const record: IGanttData = flatRecords[this.parent.getTaskIds().indexOf('R' + resourceID)];
            for (let j: number = 0; j < record.childRecords.length; j++) {
                if (record.childRecords[j].ganttProperties.taskId === taskID) {
                    this.removeChildRecord(record.childRecords[j]);
                }
            }
        }
        if (currentLength > 0) {
            const parentTask: IGanttData = this.parent.getParentTask(updateRecord.parentItem);
            if (parentTask) {
                if (parentTask.ganttProperties.taskName === this.parent.localeObj.getConstant('unassignedTask')) {
                    this.removeChildRecord(updateRecord);
                }
            }
        }
        //Assign resource to unassigned task
        if (currentLength === 0) {
            this.checkWithUnassignedTask(updateRecord);
        }
    }
    /**
     * @param {IGanttData} updateRecord .
     * @returns {void} .
     * @private
     */
    public checkWithUnassignedTask(updateRecord: IGanttData): void {
        let unassignedTasks: IGanttData = null;
        // Block for check the unassigned task.
        for (let i: number = 0; i < this.parent.flatData.length; i++) {
            if (this.parent.flatData[i].ganttProperties.taskName === this.parent.localeObj.getConstant('unassignedTask')) {
                unassignedTasks = this.parent.flatData[i];
            }
        }
        if (!isNullOrUndefined(unassignedTasks)) {
            this.addNewRecord(updateRecord, unassignedTasks);
        } else {
            // Block for create the unassigned task.
            const unassignTaskObj: Object = {};
            unassignTaskObj[this.parent.taskFields.id] = 0;
            unassignTaskObj[this.parent.taskFields.name] = this.parent.localeObj.getConstant('unassignedTask');
            const beforeEditStatus: boolean = this.parent.isOnEdit;
            this.parent.isOnEdit = false;
            const cAddedRecord: IGanttData = this.parent.dataOperation.createRecord(unassignTaskObj, 0);
            this.parent.isOnEdit = beforeEditStatus;
            this.addRecordAsBottom(cAddedRecord);
            const parentRecord: IGanttData = this.parent.flatData[this.parent.flatData.length - 1];
            this.addNewRecord(updateRecord, parentRecord);
        }
    }

    private addRecordAsBottom(cAddedRecord: IGanttData): void {
        const recordIndex1: number = this.parent.flatData.length;
        this.parent.currentViewData.splice(recordIndex1 + 1, 0, cAddedRecord);
        this.parent.flatData.splice(recordIndex1 + 1, 0, cAddedRecord);
        this.parent.ids.splice(recordIndex1 + 1, 0, cAddedRecord.ganttProperties.rowUniqueID.toString());
        const taskId: string = cAddedRecord.level === 0 ? 'R' + cAddedRecord.ganttProperties.taskId : 'T' + cAddedRecord.ganttProperties.taskId;
        this.parent.getTaskIds().splice(recordIndex1 + 1, 0, taskId);
        this.updateTreeGridUniqueID(cAddedRecord, 'add');
    }

    private addNewRecord(updateRecord: IGanttData, parentRecord: IGanttData): void {
        let cAddedRecord: IGanttData = null;
        cAddedRecord = extend({}, {}, updateRecord, true);
        this.parent.setRecordValue('uniqueID', getUid(this.parent.element.id + '_data_'), cAddedRecord);
        this.parent.setRecordValue('uniqueID', cAddedRecord.uniqueID, cAddedRecord.ganttProperties, true);
        const uniqueId: string = cAddedRecord.uniqueID.replace(this.parent.element.id + '_data_', '');
        this.parent.setRecordValue('rowUniqueID', uniqueId, cAddedRecord);
        this.parent.setRecordValue('rowUniqueID', uniqueId, cAddedRecord.ganttProperties, true);
        this.parent.setRecordValue('level', 1, cAddedRecord);
        if (this.parent.taskFields.parentID) {
            this.parent.setRecordValue('parentId', parentRecord.ganttProperties.taskId, cAddedRecord.ganttProperties, true);
        }
        this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentRecord), cAddedRecord);
        const parentUniqId: string = cAddedRecord.parentItem ? cAddedRecord.parentItem.uniqueID : null;
        this.parent.setRecordValue('parentUniqueID', parentUniqId, cAddedRecord);
        updateRecord.ganttProperties.sharedTaskUniqueIds.push(uniqueId);
        cAddedRecord.ganttProperties.sharedTaskUniqueIds = updateRecord.ganttProperties.sharedTaskUniqueIds;
        this.addRecordAsChild(parentRecord, cAddedRecord);
    }
    private removeChildRecord(record: IGanttData): void {
        const gObj: Gantt = this.parent;
        let data: IGanttData[] = [];
        if (this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.json.length > 0) {
            data = this.parent.dataSource.dataSource.json;
        } else {
            data = this.parent.currentViewData;
        }
        const dataSource: Object = this.parent.dataSource;
        const deletedRow: IGanttData = record;
        const flatParentData: IGanttData = this.parent.getParentTask(deletedRow.parentItem);
        if (deletedRow) {
            if (deletedRow.parentItem) {
                const deleteChildRecords: IGanttData[] = flatParentData ? flatParentData.childRecords : [];
                let childIndex: number = 0;
                if (deleteChildRecords && deleteChildRecords.length > 0) {
                    if (deleteChildRecords.length === 1) {
                        //For updating the parent record which has no child reords.
                        this.parent.isOnDelete = true;
                        deleteChildRecords[0].isDelete = true;
                        this.parent.dataOperation.updateParentItems(flatParentData);
                        this.parent.isOnDelete = false;
                        deleteChildRecords[0].isDelete = false;
                    }
                    childIndex = deleteChildRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    // collection for updating parent record
                    this.updateParentRecords.push(flatParentData);
                }
            }
            if (deletedRow.ganttProperties.sharedTaskUniqueIds.length) {
                const uniqueIDIndex: number =
                    deletedRow.ganttProperties.sharedTaskUniqueIds.indexOf(deletedRow.ganttProperties.rowUniqueID);
                deletedRow.ganttProperties.sharedTaskUniqueIds.splice(uniqueIDIndex, 1);
            }
            this.updateTreeGridUniqueID(deletedRow, 'delete');
            //method to delete the record from datasource collection
            if (!this.parent.taskFields.parentID) {
                const deleteRecordIDs: string[] = [];
                deleteRecordIDs.push(deletedRow.ganttProperties.rowUniqueID.toString());
                this.parent.editModule.removeFromDataSource(deleteRecordIDs);
            }
            const flatRecordIndex: number = this.parent.flatData.indexOf(deletedRow);
            if (gObj.taskFields.parentID) {
                let idx: number;
                const ganttData: IGanttData[] = this.parent.currentViewData;
                for (let i: number = 0; i < ganttData.length; i++) {
                    if (ganttData[i].ganttProperties.rowUniqueID === deletedRow.ganttProperties.rowUniqueID) {
                        idx = i;
                    }
                }
                if (idx !== -1) {
                    if ((dataSource as IGanttData[]).length > 0) {
                        (dataSource as IGanttData[]).splice(idx, 1);
                    }
                    data.splice(idx, 1);
                    this.parent.flatData.splice(flatRecordIndex, 1);
                    this.parent.ids.splice(flatRecordIndex, 1);
                    this.parent.getTaskIds().splice(flatRecordIndex, 1);
                }
            }
            const recordIndex: number = data.indexOf(deletedRow);
            if (!gObj.taskFields.parentID) {
                const deletedRecordCount: number = this.parent.editModule.getChildCount(deletedRow, 0);
                data.splice(recordIndex, deletedRecordCount + 1);
                this.parent.flatData.splice(flatRecordIndex, deletedRecordCount + 1);
                this.parent.ids.splice(flatRecordIndex, deletedRecordCount + 1);
                this.parent.getTaskIds().splice(flatRecordIndex, deletedRecordCount + 1);
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                this.parent.setRecordValue('expanded', false, flatParentData);
                this.parent.setRecordValue('hasChildRecords', false, flatParentData);
            }
        }
    }
    // Method to add new record after resource edit
    private addRecordAsChild(droppedRecord: IGanttData, draggedRecord: IGanttData): void {
        const gObj: Gantt = this.parent;
        const recordIndex1: number = this.parent.flatData.indexOf(droppedRecord);
        const childRecords: number = this.parent.editModule.getChildCount(droppedRecord, 0);
        let childRecordsLength: number;
        if (!isNullOrUndefined(this.addRowIndex) && this.addRowPosition && droppedRecord.childRecords && this.addRowPosition !== 'Child') {
            const dropChildRecord: IGanttData = droppedRecord.childRecords[this.addRowIndex];
            const position: RowPosition = this.addRowPosition === 'Above' || this.addRowPosition === 'Below' ? this.addRowPosition :
                'Child';
            childRecordsLength = dropChildRecord ? this.addRowIndex + recordIndex1 + 1 :
                childRecords + recordIndex1 + 1;
            childRecordsLength = position === 'Above' ? childRecordsLength : childRecordsLength + 1;
        } else {
            childRecordsLength = (isNullOrUndefined(childRecords) ||
                childRecords === 0) ? recordIndex1 + 1 :
                childRecords + recordIndex1 + 1;
        }
        //this.ganttData.splice(childRecordsLength, 0, this.draggedRecord);
        this.parent.currentViewData.splice(childRecordsLength, 0, draggedRecord);
        this.parent.flatData.splice(childRecordsLength, 0, draggedRecord);
        this.parent.ids.splice(childRecordsLength, 0, draggedRecord.ganttProperties.rowUniqueID.toString());
        this.updateTreeGridUniqueID(draggedRecord, 'add');
        const recordId: string = draggedRecord.level === 0 ? 'R' + draggedRecord.ganttProperties.taskId : 'T' + draggedRecord.ganttProperties.taskId;
        this.parent.getTaskIds().splice(childRecordsLength, 0, recordId);
        if (!droppedRecord.hasChildRecords) {
            this.parent.setRecordValue('hasChildRecords', true, droppedRecord);
            this.parent.setRecordValue('expanded', true, droppedRecord);
            if (!droppedRecord.childRecords.length) {
                droppedRecord.childRecords = [];
                if (!gObj.taskFields.parentID && isNullOrUndefined(droppedRecord.taskData[this.parent.taskFields.child])) {
                    droppedRecord.taskData[this.parent.taskFields.child] = [];
                }
            }
        }
        droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
        if (!isNullOrUndefined(draggedRecord) && !this.parent.taskFields.parentID
            && !isNullOrUndefined(droppedRecord.taskData[this.parent.taskFields.child])) {
            droppedRecord.taskData[this.parent.taskFields.child].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
        }

        if (!isNullOrUndefined(draggedRecord.parentItem)) {
            //collection to update the parent records
            this.updateParentRecords.push(droppedRecord);
        }
    }

    private resetEditProperties(args?: object): void {
        this.parent.currentEditedArgs = {};
        this.resetValidateArgs();
        this.parent.editedTaskBarItem = null;
        this.parent.isOnEdit = false;
        this.validatedChildItems = [];
        this.parent.isConnectorLineUpdate = false;
        this.parent.editedTaskBarItem = null;
        this.taskbarMoved = false;
        this.predecessorUpdated = false;
        if (!isNullOrUndefined(this.dialogModule) && (isNullOrUndefined(args) ||
        (!isNullOrUndefined(args) && args['requestType'] === 'beforeSave' && !args['cancel']))) {
            if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                this.dialogModule.dialogObj.hide();
            }
            this.dialogModule.dialogClose();
        }
        this.parent.hideSpinner();
        this.parent.initiateEditAction(false);
    }
    /**
     * @param {ITaskAddedEventArgs} args .
     * @returns {void} .
     * @private
     */
    public endEditAction(args: ITaskbarEditedEventArgs): void {
        this.resetEditProperties();
        if (args.action === 'TaskbarEditing') {
            this.parent.trigger('taskbarEdited', args);
        } else if (args.action === 'CellEditing') {
            this.parent.trigger('endEdit', args);
        } else if (args.action === 'DialogEditing') {
            if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
                this.dialogModule.dialogObj.hide();
            }
            this.dialogModule.dialogClose();
        }
    }
    // eslint-disable-next-line
    private saveFailed(args: ITaskbarEditedEventArgs): void {
        this.reUpdatePreviousRecords();
        this.parent.hideSpinner();
        //action failure event trigger
    }

    /**
     * To render delete confirmation dialog
     *
     * @returns {void} .
     */
    private renderDeleteConfirmDialog(): void {
        const dialogObj: Dialog = new Dialog({
            width: '320px',
            isModal: true,
            visible: false,
            content: this.parent.localeObj.getConstant('confirmDelete'),
            buttons: [
                {
                    click: this.confirmDeleteOkButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('okText'), isPrimary: true }
                },
                {
                    click: this.closeConfirmDialog.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('cancel') }
                }],
            target: this.parent.element,
            animationSettings: { effect: 'None' }
        });
        dialogObj.appendTo('#' + this.parent.element.id + '_deleteConfirmDialog');
        this.confirmDialog = dialogObj;
    }

    private closeConfirmDialog(): void {
        this.confirmDialog.hide();
    }

    private confirmDeleteOkButton(): void {
        this.deleteSelectedItems();
        this.confirmDialog.hide();
        const focussedElement: HTMLElement = this.parent.element.querySelector('.e-treegrid');
        focussedElement.focus();
    }
    /**
     * @returns {void} .
     * @private
     */
    public startDeleteAction(): void {
        if (this.parent.editSettings.allowDeleting && !this.parent.readOnly) {
            if (this.parent.editSettings.showDeleteConfirmDialog) {
                this.confirmDialog.show();
            } else {
                this.deleteSelectedItems();
            }
        }
    }
    /**
     *
     * @param {IGanttData[]} selectedRecords - Defines the deleted records
     * @returns {void} .
     * Method to delete the records from resource view Gantt.
     */
    private deleteResourceRecords(selectedRecords: IGanttData[]): void {
        const deleteRecords: IGanttData[] = [];
        for (let i: number = 0; i < selectedRecords.length; i++) {
            if (selectedRecords[i].parentItem) {
                const data: IGanttData = selectedRecords[i];
                const ids: string[] = data.ganttProperties.sharedTaskUniqueIds;
                for (let j: number = 0; j < ids.length; j++) {
                    deleteRecords.push(this.parent.flatData[this.parent.ids.indexOf(ids[j].toString())]);
                }
            }
        }
        this.deleteRow(deleteRecords);
    }

    private deleteSelectedItems(): void {
        if (!this.isFromDeleteMethod) {
            let selectedRecords: IGanttData[] = [];
            if (this.parent.selectionSettings.mode !== 'Cell') {
                selectedRecords = this.parent.selectionModule.getSelectedRecords();
            } else if (this.parent.selectionSettings.mode === 'Cell') {
                selectedRecords = this.parent.selectionModule.getCellSelectedRecords();
            }
            if (this.parent.viewType === 'ResourceView') {
                this.deleteResourceRecords(selectedRecords);
            } else {
                this.deleteRow(selectedRecords);
            }
        } else {
            if (this.targetedRecords.length) {
                if (this.parent.viewType === 'ResourceView') {
                    this.deleteResourceRecords(this.targetedRecords);
                } else {
                    this.deleteRow(this.targetedRecords);
                }
            }
            this.isFromDeleteMethod = false;
        }
    }

    /**
     * Method to delete record.
     *
     * @param {number | string | number[] | string[] | IGanttData | IGanttData[]} taskDetail - Defines the details of data to delete.
     * @returns {void} .
     * @public
     */
    public deleteRecord(taskDetail: number | string | number[] | string[] | IGanttData | IGanttData[]): void {
        this.isFromDeleteMethod = true;
        const variableType: string = typeof (taskDetail);
        this.targetedRecords = [];
        switch (variableType) {
        case 'number':
        case 'string':
        {
            const taskId: string = taskDetail.toString();
            if (this.parent.viewType === 'ResourceView') {
                if (!isNullOrUndefined(taskId) && this.parent.getTaskIds().indexOf('T' + taskId) !== -1) {
                    this.targetedRecords.push(this.parent.flatData[this.parent.getTaskIds().indexOf('T' + taskId)]);
                }
            } else {
                if (!isNullOrUndefined(taskId) && this.parent.ids.indexOf(taskId) !== -1) {
                    this.targetedRecords.push(this.parent.getRecordByID(taskId));
                }
            }
            break;
        }
        case 'object':
            if (!Array.isArray(taskDetail)) {
                this.targetedRecords.push(taskDetail.valueOf());
            } else {
                this.updateTargetedRecords(taskDetail as object[]);
            }
            break;
        default:
        }
        this.startDeleteAction();
    }
    /**
     * To update 'targetedRecords collection' from given array collection
     *
     * @param {object[]} taskDetailArray .
     * @returns {void} .
     */
    private updateTargetedRecords(taskDetailArray: object[]): void {
        if (taskDetailArray.length) {
            const variableType: string = typeof (taskDetailArray[0]);
            if (variableType === 'object') {
                this.targetedRecords = taskDetailArray;
            } else {
                // Get record from array of task ids
                for (let i: number = 0; i < taskDetailArray.length; i++) {
                    const id: string = taskDetailArray[i].toString();
                    if (this.parent.viewType === 'ResourceView') {
                        if (!isNullOrUndefined(id) && this.parent.getTaskIds().indexOf('T' + id) !== -1) {
                            this.targetedRecords.push(this.parent.flatData[this.parent.getTaskIds().indexOf('T' + id)]);
                        }
                    } else if (!isNullOrUndefined(id) && this.parent.ids.indexOf(id) !== -1) {
                        this.targetedRecords.push(this.parent.getRecordByID(id));
                    }
                }
            }
        }
    }

    private deleteRow(tasks: IGanttData[]): void {
        let rowItems: IGanttData[] = tasks && tasks.length ? tasks :
            this.parent.selectionModule.getSelectedRecords();
        this.parent.addDeleteRecord = true;
        if (rowItems.length) {
            this.parent.isOnDelete = true;
            rowItems.forEach((item: IGanttData): void => {
                item.isDelete = true;
            });
            if (this.parent.viewType === 'ResourceView' && !tasks.length) {
                rowItems = [];
            }
            for (let i: number = 0; i < rowItems.length; i++) {
                const deleteRecord: IGanttData = rowItems[i];
                if (this.deletedTaskDetails.indexOf(deleteRecord) !== -1) {
                    continue;
                }
                if (deleteRecord.parentItem) {
                    const childRecord: IGanttData[] = this.parent.getParentTask(deleteRecord.parentItem).childRecords;
                    const filteredRecord: IGanttData[] = childRecord.length === 1 ?
                        childRecord : childRecord.filter((data: IGanttData): boolean => {
                            return !data.isDelete;
                        });
                    if (filteredRecord.length > 0) {
                        this.parent.dataOperation.updateParentItems(deleteRecord.parentItem);
                    }
                }
                const predecessor: IPredecessor[] = deleteRecord.ganttProperties.predecessor;
                if (predecessor && predecessor.length) {
                    this.removePredecessorOnDelete(deleteRecord);
                }
                this.deletedTaskDetails.push(deleteRecord);
                if (deleteRecord.hasChildRecords) {
                    this.deleteChildRecords(deleteRecord);
                }
            }
            if (this.parent.selectionModule && this.parent.allowSelection) {
                // clear selection
                this.parent.selectionModule.clearSelection();
            }
            const delereArgs: ITaskDeletedEventArgs = {};
            delereArgs.deletedRecordCollection = this.deletedTaskDetails;
            delereArgs.updatedRecordCollection = this.parent.editedRecords;
            delereArgs.cancel = false;
            delereArgs.action = 'delete';
            this.initiateDeleteAction(delereArgs);
            this.parent.isOnDelete = false;
        }
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }

    public removePredecessorOnDelete(record: IGanttData): void {
        const predecessors: IPredecessor[] = record.ganttProperties.predecessor;
        for (let i: number = 0; i < predecessors.length; i++) {
            const predecessor: IPredecessor = predecessors[i];
            const recordId: string = this.parent.viewType === 'ResourceView' ? record.ganttProperties.taskId :
                record.ganttProperties.rowUniqueID;
            if (predecessor.from.toString() === recordId.toString()) {
                const toRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor.to.toString());
                if (!isNullOrUndefined(toRecord)) {
                    const toRecordPredcessor: IPredecessor[] = extend([], [], toRecord.ganttProperties.predecessor, true) as IPredecessor[];
                    let index: number;
                    for (let t: number = 0; t < toRecordPredcessor.length; t++) {
                        const toId: string = this.parent.viewType === 'ResourceView' ? toRecord.ganttProperties.taskId :
                            toRecord.ganttProperties.rowUniqueID;
                        if (toRecordPredcessor[t].to.toString() === toId.toString()
                            && toRecordPredcessor[t].from.toString() === recordId.toString()) {
                            index = t;
                            break;
                        }
                    }
                    toRecordPredcessor.splice(index, 1);
                    this.updatePredecessorValues(toRecord, toRecordPredcessor);
                }
            } else if (predecessor.to.toString() === recordId.toString()) {
                const fromRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor.from.toString());
                if (!isNullOrUndefined(fromRecord)) {
                    const fromRecordPredcessor: IPredecessor[] = extend(
                        [], [], fromRecord.ganttProperties.predecessor, true) as IPredecessor[];
                    let index: number;
                    for (let t: number = 0; t < fromRecordPredcessor.length; t++) {
                        const fromId: string = this.parent.viewType === 'ResourceView' ? fromRecord.ganttProperties.taskId :
                            fromRecord.ganttProperties.rowUniqueID;
                        if (fromRecordPredcessor[t].from.toString() === fromId.toString()
                            && fromRecordPredcessor[t].to.toString() === recordId.toString()) {
                            index = t;
                            break;
                        }
                    }
                    fromRecordPredcessor.splice(index, 1);
                    this.updatePredecessorValues(fromRecord, fromRecordPredcessor);
                }
            }
        }
    }

    private updatePredecessorValues(record: IGanttData, predcessorArray: IPredecessor[]): void {
        this.parent.setRecordValue('predecessor', predcessorArray, record.ganttProperties, true);
        const predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
    }

    /**
     * Method to update TaskID of a gantt record
     *
     * @param {string | number} currentId .
     * @param {number | string} newId .
     * @returns {void} .
     */
    public updateTaskId(currentId: string | number, newId: number | string): void {
        if (!this.parent.readOnly) {
            const cId: string = typeof currentId === 'number' ? currentId.toString() : currentId;
            const nId: string = typeof newId === 'number' ? newId.toString() : newId;
            const ids: string[] = this.parent.ids;
            if (!isNullOrUndefined(cId) && !isNullOrUndefined(nId)) {
                const cIndex: number = ids.indexOf(cId);
                const nIndex: number = ids.indexOf(nId);
                // return false for invalid taskID
                if (cIndex === -1 || nIndex > -1) {
                    return;
                }
                const thisRecord: IGanttData = this.parent.flatData[cIndex];
                thisRecord.ganttProperties.taskId = thisRecord.ganttProperties.rowUniqueID = nId;
                thisRecord.taskData[this.parent.taskFields.id] = nId;
                thisRecord[this.parent.taskFields.id] = nId;
                ids[cIndex] = nId;
                if (thisRecord.hasChildRecords && this.parent.taskFields.parentID) {
                    const childRecords: IGanttData[] = thisRecord.childRecords;
                    for (let count: number = 0; count < childRecords.length; count++) {
                        const childRecord: IGanttData = childRecords[count];
                        childRecord[this.parent.taskFields.parentID] = newId;
                        this.parent.chartRowsModule.refreshRecords([childRecord]);
                    }
                }
                if (this.parent.taskFields.dependency && !isNullOrUndefined(thisRecord.ganttProperties.predecessor)) {
                    const predecessors: IPredecessor[] = thisRecord.ganttProperties.predecessor;
                    let currentGanttRecord: IGanttData;
                    for (let i: number = 0; i < predecessors.length; i++) {
                        const predecessor: IPredecessor = predecessors[i];
                        if (predecessor.to === cId) {
                            currentGanttRecord = this.parent.flatData[ids.indexOf(predecessor.from)];
                        } else if (predecessor.from === cId) {
                            currentGanttRecord = this.parent.flatData[ids.indexOf(predecessor.to)];
                        }
                        this.updatePredecessorOnUpdateId(currentGanttRecord, cId, nId);
                    }
                }
                this.parent.treeGrid.parentData = [];
                this.parent.treeGrid.refresh();
            }
        }
    }
    private updatePredecessorOnUpdateId(currentGanttRecord: IGanttData, cId: string, nId: string): void {
        if (this.parent.flatData.indexOf(currentGanttRecord) > -1) {
            const pred: IPredecessor[] = currentGanttRecord.ganttProperties.predecessor;
            for (let j: number = 0; j < pred.length; j++) {
                const pre: IPredecessor = pred[j];
                if (pre.to === cId) {
                    pre.to = nId;
                } else if (pre.from === cId) {
                    pre.from = nId;
                }
            }
        }
        this.updatePredecessorValues(currentGanttRecord, currentGanttRecord.ganttProperties.predecessor);
    }

    private deleteChildRecords(record: IGanttData): void {
        const childRecords: IGanttData[] = record.childRecords;
        for (let c: number = 0; c < childRecords.length; c++) {
            const childRecord: IGanttData = childRecords[c];
            if (this.deletedTaskDetails.indexOf(childRecord) !== -1) {
                continue;
            }
            const predecessor: IPredecessor[] = childRecord.ganttProperties.predecessor;
            if (predecessor && predecessor.length) {
                this.removePredecessorOnDelete(childRecord);
            }
            this.deletedTaskDetails.push(childRecord);
            if (childRecord.hasChildRecords) {
                this.deleteChildRecords(childRecord);
            }
        }
    }

    public removeFromDataSource(deleteRecordIDs: string[]): void {
        let dataSource: Object[];
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = this.parent.dataSource.dataSource.json;
        } else {
            dataSource = this.parent.dataSource as Object[];
        }
        this.removeData(dataSource, deleteRecordIDs);
        this.isBreakLoop = false;
    }
    private removeData(dataCollection: Object[], record: string[]): boolean | void {
        for (let i: number = 0; i < dataCollection.length; i++) {
            if (this.isBreakLoop) {
                break;
            }
            if (record.indexOf(getValue(this.parent.taskFields.id, dataCollection[i]).toString()) !== -1) {
                if (dataCollection[i][this.parent.taskFields.child]) {
                    const childRecords: ITaskData[] = dataCollection[i][this.parent.taskFields.child];
                    this.removeData(childRecords, record);
                }
                record.splice(record.indexOf(getValue(this.parent.taskFields.id, dataCollection[i]).toString()), 1);
                dataCollection.splice(i, 1);
                if (record.length === 0) {
                    this.isBreakLoop = true;
                    break;
                }
            } else if (dataCollection[i][this.parent.taskFields.child]) {
                const childRecords: ITaskData[] = dataCollection[i][this.parent.taskFields.child];
                this.removeData(childRecords, record);
            }
        }
    }
    private initiateDeleteAction(args: ITaskDeletedEventArgs): void {
        this.parent.showSpinner();
        let eventArgs: IActionBeginEventArgs = {};
        eventArgs.requestType = 'beforeDelete';
        eventArgs.data = args.deletedRecordCollection;
        eventArgs.modifiedRecords = args.updatedRecordCollection;
        eventArgs.modifiedTaskData = getTaskData(args.updatedRecordCollection, null, null, this.parent);
        this.parent.trigger('actionBegin', eventArgs, (eventArg: IActionBeginEventArgs) => {
            if (eventArg.cancel) {
                const deleteRecords: IGanttData[] = this.deletedTaskDetails;
                for (let d: number = 0; d < deleteRecords.length; d++) {
                    deleteRecords[d].isDelete = false;
                }
                this.deletedTaskDetails = [];
                this.reUpdatePreviousRecords();
                this.parent.initiateEditAction(false);
                this.parent.hideSpinner();
            } else {
                if (isRemoteData(this.parent.dataSource)) {
                    const data: DataManager = this.parent.dataSource as DataManager;
                    if (this.parent.timezone) {
                        updateDates(eventArg.modifiedTaskData as IGanttData, this.parent);
                    }
                    const updatedData: object = {
                        deletedRecords: getTaskData(eventArg.data as IGanttData[], null, null, this.parent), // to check
                        changedRecords: eventArg.modifiedTaskData
                    };
                    const adaptor: AdaptorOptions = data.adaptor;
                    const query: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
                    if (!(adaptor instanceof WebApiAdaptor && adaptor instanceof ODataAdaptor) || data.dataSource.batchUrl) {
                        const crud: Promise<Object> = data.saveChanges(updatedData, this.parent.taskFields.id, null, query) as Promise<Object>;
                        crud.then(() => this.deleteSuccess(args))
                            .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                    } else {
                        const deletedRecords: string = 'deletedRecords';
                        let deleteCrud: Promise<Object> = null;
                        for (let i: number = 0; i < updatedData[deletedRecords].length; i++) {
                            deleteCrud = data.remove(this.parent.taskFields.id, updatedData[deletedRecords][i],
                                                     null, query) as Promise<Object>;
                        }
                        deleteCrud.then(() => {
                            const changedRecords: string = 'changedRecords';
                            const updateCrud: Promise<Object> =
                                data.update(this.parent.taskFields.id, updatedData[changedRecords], null, query) as Promise<Object>;
                            updateCrud.then(() => this.deleteSuccess(args))
                                .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                        }).catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
                    }
                } else {
                    this.deleteSuccess(args);
                }
            }
        });
    }

    private deleteSuccess(args: ITaskDeletedEventArgs): void {
        const flatData: IGanttData[] = this.parent.flatData;
        const currentData: IGanttData[] = this.parent.currentViewData;
        const deletedRecords: IGanttData[] = this.parent.getRecordFromFlatdata(args.deletedRecordCollection);
        const deleteRecordIDs: string[] = [];
        if (deletedRecords.length > 0) {
            this.parent.selectedRowIndex = deletedRecords[deletedRecords.length - 1].index;
        }
        for (let i: number = 0; i < deletedRecords.length; i++) {
            const deleteRecord: IGanttData = deletedRecords[i];
            const currentIndex: number = currentData.indexOf(deleteRecord);
            const flatIndex: number = flatData.indexOf(deleteRecord);
            const treeGridParentIndex: number = this.parent.treeGrid.parentData.indexOf(deleteRecord);
            const tempData: ITaskData[] = getValue('dataOperation.dataArray', this.parent);
            const dataIndex: number = tempData.indexOf(deleteRecord.taskData);
            let childIndex: number;
            if (currentIndex !== -1) { currentData.splice(currentIndex, 1); }
            if (flatIndex !== -1) { flatData.splice(flatIndex, 1); }
            if (dataIndex !== -1) { tempData.splice(dataIndex, 1); }
            if (!isNullOrUndefined(deleteRecord)) {
                deleteRecordIDs.push(deleteRecord.ganttProperties.taskId.toString());
                if (flatIndex !== -1) {
                    this.parent.ids.splice(flatIndex, 1);
                    if (this.parent.viewType === 'ResourceView') {
                        this.parent.getTaskIds().splice(flatIndex, 1);
                    }
                }
                if (deleteRecord.level === 0 && treeGridParentIndex !== -1) {
                    this.parent.treeGrid.parentData.splice(treeGridParentIndex, 1);
                }
                if (deleteRecord.parentItem) {
                    const parentItem: IGanttData = this.parent.getParentTask(deleteRecord.parentItem);
                    if (parentItem) {
                        const childRecords: IGanttData[] = parentItem.childRecords;
                        childIndex = childRecords.indexOf(deleteRecord);
                        if (childIndex !== -1) { childRecords.splice(childIndex, 1); }
                        if (!childRecords.length) {
                            this.parent.setRecordValue('hasChildRecords', false, parentItem);
                        }
                    }
                }
                this.updateTreeGridUniqueID(deleteRecord, 'delete');
            }
        }
        if (deleteRecordIDs.length > 0) {
            this.removeFromDataSource(deleteRecordIDs);
        }
        const eventArgs: IActionBeginEventArgs = {};
        this.parent.updatedConnectorLineCollection = [];
        this.parent.connectorLineIds = [];
        this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
        this.parent.treeGrid.parentData = [];
        this.parent.treeGrid.refresh();
        if (this.parent.enableImmutableMode) {
            this.refreshRecordInImmutableMode();
        }
        // Trigger actioncomplete event for delete action
        eventArgs.requestType = 'delete';
        eventArgs.data = args.deletedRecordCollection;
        eventArgs.modifiedRecords = args.updatedRecordCollection;
        eventArgs.modifiedTaskData = getTaskData(args.updatedRecordCollection, null, null, this.parent);
        setValue('action', args.action, eventArgs);
        this.parent.trigger('actionComplete', eventArgs);
        this.deletedTaskDetails = [];
        this.parent.initiateEditAction(false);
        this.parent.hideSpinner();
    }

    /**
     *
     * @returns {number | string} .
     * @private
     */
    public getNewTaskId(): number | string {
        const maxId: number = DataUtil.aggregates.max(this.parent.flatData, this.parent.taskFields.id);
        if (!isNullOrUndefined(maxId)) {
            return parseInt(maxId.toString(), 10) + 1;
        } else {
            return 1;
        }
    }

    /**
     * @param {object} obj .
     * @param {RowPosition} rowPosition .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private prepareNewlyAddedData(obj: Object, rowPosition: RowPosition): void {
        const taskModel: TaskFieldsModel = this.parent.taskFields;
        let id: string | number;
        const ids: string[] = this.parent.ids;
        /*Validate Task Id of data*/
        if (obj[taskModel.id]) {
            if (ids.indexOf(obj[taskModel.id].toString()) !== -1) {
                obj[taskModel.id] = null;
            } else {
                obj[taskModel.id] = isNullOrUndefined(obj[taskModel.id]) ? null : parseInt(obj[taskModel.id], 10);
            }
        }
        if (!obj[taskModel.id]) {
            id = this.getNewTaskId();
            obj[taskModel.id] = id;
        }
        if (!this.parent.allowUnscheduledTasks && !obj[taskModel.startDate]) {
            obj[taskModel.startDate] = this.parent.projectStartDate;
        }
        if (!this.parent.allowUnscheduledTasks && taskModel.duration && isNullOrUndefined(obj[taskModel.duration])) {
            if (!obj[taskModel.endDate]) {
                obj[taskModel.duration] = '5';
            }
        }
        if (taskModel.progress) {
            obj[taskModel.progress] = obj[taskModel.progress] ? (obj[taskModel.progress] > 100 ? 100 : obj[taskModel.progress]) : 0;
        }
        if (!this.parent.allowUnscheduledTasks && !obj[taskModel.endDate] && taskModel.endDate) {
            if (!obj[taskModel.duration]) {
                const startDate: Date = this.parent.dataOperation.getDateFromFormat(this.parent.projectStartDate);
                startDate.setDate(startDate.getDate() + 4);
                obj[taskModel.endDate] = this.parent.getFormatedDate(startDate, this.parent.getDateFormat());
            }
        }
    }

    /**
     * @param {object} obj .
     * @param {number} level .
     * @param {RowPosition} rowPosition .
     * @param {IGanttData} parentItem .
     * @returns {IGanttData} .
     * @private
     */
    private updateNewlyAddedDataBeforeAjax(
        obj: Object, level: number, rowPosition: RowPosition, parentItem?: IGanttData): IGanttData {
        const cAddedRecord: IGanttData = this.parent.dataOperation.createRecord(obj, level);
        cAddedRecord.index = parseInt(cAddedRecord.ganttProperties.rowUniqueID.toString(), 10) - 1;
        if (!isNullOrUndefined(parentItem)) {
            this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentItem), cAddedRecord);
            const pIndex: number = cAddedRecord.parentItem ? cAddedRecord.parentItem.index : null;
            this.parent.setRecordValue('parentIndex', pIndex, cAddedRecord);
            const parentUniqId: string = cAddedRecord.parentItem ? cAddedRecord.parentItem.uniqueID : null;
            this.parent.setRecordValue('parentUniqueID', parentUniqId, cAddedRecord);
            if (!isNullOrUndefined(this.parent.taskFields.id) &&
                !isNullOrUndefined(this.parent.taskFields.parentID) && cAddedRecord.parentItem) {
                if (this.parent.viewType === 'ProjectView') {
                    this.parent.setRecordValue(
                        this.parent.taskFields.parentID, cAddedRecord.parentItem.taskId, cAddedRecord.taskData, true);
                }
                this.parent.setRecordValue('parentId', cAddedRecord.parentItem.taskId, cAddedRecord.ganttProperties, true);
                this.parent.setRecordValue(this.parent.taskFields.parentID, cAddedRecord.parentItem.taskId, cAddedRecord, true);
            }
        }
        this.parent.isOnEdit = true;
        this.backUpAndPushNewlyAddedRecord(cAddedRecord, rowPosition, parentItem);
        // need to push in dataSource also.
        if (this.parent.taskFields.dependency && cAddedRecord.ganttProperties.predecessorsName) {
            this.parent.predecessorModule.ensurePredecessorCollectionHelper(cAddedRecord, cAddedRecord.ganttProperties);
            this.parent.predecessorModule.updatePredecessorHelper(cAddedRecord);
            this.parent.predecessorModule.validatePredecessorDates(cAddedRecord);
        }
        if (cAddedRecord.parentItem && this.parent.getParentTask(cAddedRecord.parentItem).ganttProperties.isAutoSchedule) {
            this.parent.dataOperation.updateParentItems(cAddedRecord.parentItem);
        }
        this.parent.isOnEdit = false;
        return cAddedRecord;
    }

    /**
     * @param {IGanttData} record .
     * @param {number} count .
     * @returns {number} .
     * @private
     */
    public getChildCount(record: IGanttData, count: number): number {
        let currentRecord: IGanttData;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    }

    /**
     * @param {IGanttData} data .
     * @param {number} count .
     * @param {IGanttData[]} collection .
     * @returns {number} .
     * @private
     */
    private getVisibleChildRecordCount(data: IGanttData, count: number, collection: IGanttData[]): number {
        let childRecords: IGanttData[];
        let length: number;
        if (data.hasChildRecords) {
            childRecords = data.childRecords;
            length = childRecords.length;
            for (let i: number = 0; i < length; i++) {
                if (collection.indexOf(childRecords[i]) !== -1) {
                    count++;
                }
                if (childRecords[i].hasChildRecords) {
                    count = this.getVisibleChildRecordCount(childRecords[i], count, collection);
                }
            }
        } else {
            if (collection.indexOf(data) !== -1) {
                count++;
            }
        }
        return count;
    }

    /**
     * @param {IGanttData} parentRecord .
     * @returns {void} .
     * @private
     */
    public updatePredecessorOnIndentOutdent(parentRecord: IGanttData): void {
        const len: number = parentRecord.ganttProperties.predecessor.length;
        const parentRecordTaskData: ITaskData = parentRecord.ganttProperties;
        const predecessorCollection: IPredecessor[] = parentRecordTaskData.predecessor;
        let childRecord: IGanttData;
        let predecessorIndex: number;
        const updatedPredecessor: IPredecessor[] = [];
        for (let count: number = 0; count < len; count++) {
            if (predecessorCollection[count].to === parentRecordTaskData.rowUniqueID.toString()) {
                childRecord = this.parent.getRecordByID(predecessorCollection[count].from);
                predecessorIndex = getIndex(predecessorCollection[count], 'from', childRecord.ganttProperties.predecessor, 'to');
                // eslint-disable-next-line
                let predecessorCollections: IPredecessor[] = (extend([], childRecord.ganttProperties.predecessor, [], true)) as IPredecessor[];
                predecessorCollections.splice(predecessorIndex, 1);
                this.parent.setRecordValue('predecessor', predecessorCollections, childRecord.ganttProperties, true);
            } else if (predecessorCollection[count].from === parentRecordTaskData.rowUniqueID.toString()) {
                childRecord = this.parent.getRecordByID(predecessorCollection[count].to);
                const prdcList: string[] = (childRecord.ganttProperties.predecessorsName.toString()).split(',');
                const str: string = predecessorCollection[count].from + predecessorCollection[count].type;
                const ind: number = prdcList.indexOf(str);
                prdcList.splice(ind, 1);
                this.parent.setRecordValue('predecessorsName', prdcList.join(','), childRecord.ganttProperties, true);
                this.parent.setRecordValue(this.parent.taskFields.dependency, prdcList.join(','), childRecord);
                predecessorIndex = getIndex(predecessorCollection[count], 'from', childRecord.ganttProperties.predecessor, 'to');
                // eslint-disable-next-line
                const temppredecessorCollection: IPredecessor[] = (extend([], childRecord.ganttProperties.predecessor, [], true)) as IPredecessor[];
                temppredecessorCollection.splice(predecessorIndex, 1);
                this.parent.setRecordValue('predecessor', temppredecessorCollection, childRecord.ganttProperties, true);
                this.parent.predecessorModule.validatePredecessorDates(childRecord);
            }
        }
        this.parent.setRecordValue('predecessor', updatedPredecessor, parentRecord.ganttProperties, true);
        this.parent.setRecordValue('predecessorsName', '', parentRecord.ganttProperties, true);
    }

    /**
     * @param {IPredecessor[]} predecessorCollection .
     * @param {IGanttData} record .
     * @returns {string} .
     * @private
     */
    private predecessorToString(predecessorCollection: IPredecessor[], record: IGanttData): string {
        const predecessorString: string[] = [];
        let count: number = 0;
        const length: number = predecessorCollection.length;
        for (count; count < length; count++) {
            if (record.ganttProperties.rowUniqueID.toString() !== predecessorCollection[count].from) {
                let tem: string = predecessorCollection[count].from + predecessorCollection[count].type;
                predecessorCollection[count].offset =
                    isNaN(predecessorCollection[count].offset) ? 0 : predecessorCollection[count].offset;
                if (predecessorCollection[count].offset !== 0) {
                    if (predecessorCollection[count].offset < 0) {
                        tem += predecessorCollection[count].offset.toString() + 'd';
                    } else if (predecessorCollection[count].offset > 0) {
                        tem += '+' + predecessorCollection[count].offset.toString() + 'd';
                    }
                }
                predecessorString.push(tem);
            }
        }
        return predecessorString.join(',');
    }

    /**
     * @param {IGanttData} record .
     * @param {RowPosition} rowPosition .
     * @param {IGanttData} parentItem .
     * @returns {void} .
     * @private
     */
    private backUpAndPushNewlyAddedRecord(
        record: IGanttData, rowPosition: RowPosition, parentItem?: IGanttData): void {
        const flatRecords: IGanttData[] = this.parent.flatData;
        const currentViewData: IGanttData[] = this.parent.currentViewData;
        const ids: string[] = this.parent.ids;
        let currentItemIndex: number;
        let recordIndex: number;
        let updatedCollectionIndex: number;
        let childIndex: number;
        switch (rowPosition) {
        case 'Top':
            flatRecords.splice(0, 0, record);
            currentViewData.splice(0, 0, record);
            ids.splice(0, 0, record.ganttProperties.rowUniqueID.toString()); // need to check NAN
            break;
        case 'Bottom':
            flatRecords.push(record);
            currentViewData.push(record);
            ids.push(record.ganttProperties.rowUniqueID.toString()); // need to check NAN
            if (this.parent.viewType === 'ResourceView') {
                const taskId: string = record.level === 0 ? 'R' + record.ganttProperties.taskId : 'T' + record.ganttProperties.taskId;
                this.parent.getTaskIds().push(taskId);
            }
            break;
        case 'Above':
            /*Record Updates*/
            recordIndex = flatRecords.indexOf(this.addRowSelectedItem);
            updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem);
            this.recordCollectionUpdate(childIndex, recordIndex, updatedCollectionIndex, record, parentItem, rowPosition);
            break;
        case 'Below':
            currentItemIndex = flatRecords.indexOf(this.addRowSelectedItem);
            if (this.addRowSelectedItem.hasChildRecords) {
                const dataChildCount: number = this.getChildCount(this.addRowSelectedItem, 0);
                recordIndex = currentItemIndex + dataChildCount + 1;
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) +
                        this.getVisibleChildRecordCount(this.addRowSelectedItem, 0, currentViewData) + 1;
            } else {
                recordIndex = currentItemIndex + 1;
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) + 1;
            }
            this.recordCollectionUpdate(childIndex + 1, recordIndex, updatedCollectionIndex, record, parentItem, rowPosition);
            break;
        case 'Child':
            currentItemIndex = flatRecords.indexOf(this.addRowSelectedItem);
            if (this.addRowSelectedItem.hasChildRecords) {
                const dataChildCount: number = this.getChildCount(this.addRowSelectedItem, 0);
                recordIndex = currentItemIndex + dataChildCount + 1;
                //Expand Add record's parent item for project view
                if (!this.addRowSelectedItem.expanded && !this.parent.enableMultiTaskbar) {
                    this.parent.expandByID(Number(this.addRowSelectedItem.ganttProperties.rowUniqueID));
                }
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) +
                        this.getVisibleChildRecordCount(this.addRowSelectedItem, 0, currentViewData) + 1;
            } else {
                this.parent.setRecordValue('hasChildRecords', true, this.addRowSelectedItem);
                this.parent.setRecordValue('isMilestone', false, this.addRowSelectedItem.ganttProperties, true);
                this.parent.setRecordValue('expanded', true, this.addRowSelectedItem);
                this.parent.setRecordValue('childRecords', [], this.addRowSelectedItem);
                recordIndex = currentItemIndex + 1;
                updatedCollectionIndex = currentViewData.indexOf(this.addRowSelectedItem) + 1;
                if (this.addRowSelectedItem.ganttProperties.predecessor) {
                    this.updatePredecessorOnIndentOutdent(this.addRowSelectedItem);
                }
                if (!isNullOrUndefined(this.addRowSelectedItem.ganttProperties.segments)) {
                    this.addRowSelectedItem.ganttProperties.segments = null;
                }
            }
            this.recordCollectionUpdate(childIndex + 1, recordIndex, updatedCollectionIndex, record, parentItem, rowPosition);
            break;
        }
        this.newlyAddedRecordBackup = record;
    }

    /**
     * @param {number} childIndex .
     * @param {number} recordIndex .
     * @param {number} updatedCollectionIndex .
     * @param {IGanttData} record .
     * @param {IGanttData} parentItem .
     * @returns {void} .
     * @private
     */
    private recordCollectionUpdate(
        childIndex: number, recordIndex: number, updatedCollectionIndex: number, record: IGanttData, parentItem: IGanttData, rowPosition: RowPosition): void {
        const flatRecords: IGanttData[] = this.parent.flatData;
        const currentViewData: IGanttData[] = this.parent.currentViewData;
        const ids: string[] = this.parent.ids;
        /* Record collection update */
        flatRecords.splice(recordIndex, 0, record);
        currentViewData.splice(updatedCollectionIndex, 0, record);
        ids.splice(recordIndex, 0, record.ganttProperties.rowUniqueID.toString());
        if (this.parent.viewType === 'ResourceView') {
            const taskId: string = record.level === 0 ? 'R' + record.ganttProperties.taskId : 'T' + record.ganttProperties.taskId;
            this.parent.getTaskIds().splice(recordIndex, 0, taskId);
        }
        /* data Source update */
        if (!isNullOrUndefined(parentItem)) {
            if (rowPosition == 'Above') {
                childIndex = parentItem.childRecords.indexOf(this.addRowSelectedItem);
            } else if(rowPosition == 'Below') {
                childIndex = parentItem.childRecords.indexOf(this.addRowSelectedItem) + 1;
            } else {
                childIndex = parentItem.childRecords.length;
            }
            /*Child collection update*/
            parentItem.childRecords.splice(childIndex, 0, record);
            if ((this.parent.dataSource instanceof DataManager &&
                isNullOrUndefined(parentItem.taskData[this.parent.taskFields.parentID])) ||
                 !isNullOrUndefined(this.parent.dataSource)) {
                const child: string = this.parent.taskFields.child;
                if (parentItem.taskData[child] && parentItem.taskData[child].length > 0) {
                    if (rowPosition === 'Above' || rowPosition === 'Below') {
                        parentItem.taskData[child].splice(childIndex, 0, record.taskData);
                    }
                    else {
                        parentItem.taskData[child].push(record.taskData);
                    }
                } else {
                    parentItem.taskData[child] = [];
                    parentItem.taskData[child].push(record.taskData);
                }
            }
        }
    }

    /**
     * @param {IGanttData} cAddedRecord .
     * @param {IGanttData} modifiedRecords .
     * @param {string} event .
     * @returns {ITaskAddedEventArgs} .
     * @private
     */
    private constructTaskAddedEventArgs(
        cAddedRecord: IGanttData[], modifiedRecords: IGanttData[], event: string): ITaskAddedEventArgs {
        const eventArgs: ITaskAddedEventArgs = {};
        eventArgs.action = eventArgs.requestType = event;
        if (cAddedRecord.length > 1) {
            eventArgs.data = [];
            eventArgs.newTaskData = [];
            eventArgs.recordIndex = [];
            for (let i: number = 0; i < cAddedRecord.length; i++) {
                (eventArgs.data[i] as IGanttData[]) = (cAddedRecord[i] as IGanttData[]);
                (eventArgs.newTaskData[i]) = (getTaskData([cAddedRecord[i]], eventArgs.data[i] as boolean, eventArgs, this.parent));
                eventArgs.recordIndex[i] = cAddedRecord[i].index;
            }
        }
        else if (cAddedRecord.length === 1) {
            for (let i: number = 0; i < cAddedRecord.length; i++) {
                (eventArgs.data) = (cAddedRecord[i]);
                (eventArgs.newTaskData) = (getTaskData([cAddedRecord[i]], eventArgs.data as boolean, eventArgs, this.parent));
                eventArgs.recordIndex = cAddedRecord[i].index;
            }
        }

        eventArgs.modifiedRecords = modifiedRecords;
        eventArgs.modifiedTaskData = getTaskData(modifiedRecords, null, null, this.parent);
        return eventArgs;
    }

    /**
     * @param {ITaskAddedEventArgs} args .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    private addSuccess(args: ITaskAddedEventArgs): void {
        // let addedRecords: IGanttData = args.addedRecord;
        // let eventArgs: IActionBeginEventArgs = {};
        // this.parent.updatedConnectorLineCollection = [];
        // this.parent.connectorLineIds = [];
        // this.parent.predecessorModule.createConnectorLinesCollection(this.parent.flatData);
        this.parent.treeGrid.parentData = [];
        this.parent.addDeleteRecord = true;
        this.parent.selectedRowIndex = 0;
        this.parent.treeGrid.refresh();
        if (this.parent.enableImmutableMode) {
            this.parent.modifiedRecords = args.modifiedRecords;
            this.parent.modifiedRecords.push(args.data as IGanttData);
            this.refreshRecordInImmutableMode();
        }
    }

    private refreshRecordInImmutableMode(): void {
        for (let i: number = 0; i < this.parent.modifiedRecords.length; i++) {
            const originalData: IGanttData = this.parent.modifiedRecords[i];
            let treeIndex: number = this.parent.allowRowDragAndDrop ? 1 : 0;
            let uniqueTaskID: string = this.parent.taskFields.id;
            var originalIndex: number = this.parent.currentViewData.findIndex((data: IGanttData) => {
                return (data[uniqueTaskID] == originalData[uniqueTaskID]);
            });
            if (this.parent.treeGrid.getRows()[originalIndex]) {
                this.parent.treeGrid.renderModule.cellRender({
                    data: originalData, cell: this.parent.treeGrid.getRows()[originalIndex].cells[this.parent.treeColumnIndex + treeIndex],
                    column: this.parent.treeGrid.grid.getColumns()[this.parent.treeColumnIndex],
                    requestType: 'rowDragAndDrop'
                });
                this.parent.treeGrid.renderModule.RowModifier({
                    data: originalData, row: this.parent.treeGrid.getRows()[originalIndex], rowHeight: this.parent.rowHeight
                });
            }
        }
    }
    /**
     * @param {IGanttData} addedRecord .
     * @param {RowPosition} rowPosition .
     * @returns {void} .
     * @private
     */
    public updateRealDataSource(addedRecord: IGanttData | IGanttData[], rowPosition: RowPosition): void {
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        let dataSource: Object[] = isCountRequired(this.parent) ? getValue('result', this.parent.dataSource) :
            this.parent.dataSource as Object[];
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = this.parent.dataSource.dataSource.json;
        }
        for (let i: number = 0; i < (addedRecord as IGanttData[]).length; i++) {
            if (isNullOrUndefined(rowPosition) || isNullOrUndefined(this.addRowSelectedItem)) {
                rowPosition = rowPosition === 'Bottom' ? 'Bottom' : 'Top';
            }
            if (rowPosition === 'Top') {
                dataSource.splice(0, 0, addedRecord[i].taskData);
            } else if (rowPosition === 'Bottom') {
                dataSource.push(addedRecord[i].taskData);
            } else {
                if (!isNullOrUndefined(taskFields.id) && !isNullOrUndefined(taskFields.parentID)) {
                    dataSource.push(addedRecord[i].taskData);
                } else {
                    this.addDataInRealDataSource(dataSource, addedRecord[i].taskData, rowPosition);
                }
            }
            this.isBreakLoop = false;
        }
    }

    /**
     * @param {object[]} dataCollection .
     * @param {IGanttData} record .
     * @param {RowPosition} rowPosition .
     * @returns {void} .
     * @private
     */
    private addDataInRealDataSource(
        dataCollection: Object[], record: IGanttData, rowPosition?: RowPosition): boolean | void {
        for (let i: number = 0; i < dataCollection.length; i++) {
            const child: string = this.parent.taskFields.child;
            if (this.isBreakLoop) {
                break;
            }
            if (getValue(
                this.parent.taskFields.id, dataCollection[i]).toString() ===
                this.addRowSelectedItem.ganttProperties.rowUniqueID.toString()) {
                if (rowPosition === 'Above') {
                    dataCollection.splice(i, 0, record);
                } else if (rowPosition === 'Below') {
                    dataCollection.splice(i + 1, 0, record);
                } else if (rowPosition === 'Child') {
                    if (dataCollection[i][child] && dataCollection[i][child].length > 0) {
                        dataCollection[i][child].push(record);
                    } else {
                        dataCollection[i][child] = [];
                        dataCollection[i][child].push(record);
                    }
                }
                this.isBreakLoop = true;
                break;
            } else if (dataCollection[i][child]) {
                const childRecords: ITaskData[] = dataCollection[i][child];
                this.addDataInRealDataSource(childRecords, record, rowPosition);
            }
        }
    }

    /**
     * Method to add new record.
     *
     * @param {Object[] | Object} data - Defines the new data to add.
     * @param {RowPosition} rowPosition - Defines the position of row.
     * @param {number} rowIndex - Defines the row index.
     * @returns {void} .
     * @private
     */
    public addRecord(data?: Object[] | Object, rowPosition?: RowPosition, rowIndex?: number): void {
        if (this.parent.editModule && this.parent.editSettings.allowAdding) {
            this.parent.isDynamicData = true;
            const cAddedRecord: IGanttData[] = [];
            if (isNullOrUndefined(data)) {
                this.validateTaskPosition(data, rowPosition, rowIndex, cAddedRecord);
            }
            else if (data instanceof Array) {
                for (let i: number = 0; i < data.length; i++) {
                    this.validateTaskPosition(data[i], rowPosition, rowIndex, cAddedRecord);
                }
            }
            else if (typeof (data) == 'object') {
                this.validateTaskPosition(data, rowPosition, rowIndex, cAddedRecord);
            }
            else {
                return;
            }
            let args: ITaskAddedEventArgs = {};
            args = this.constructTaskAddedEventArgs(cAddedRecord, this.parent.editedRecords, 'beforeAdd');
            this.parent.showSpinner();
            this.parent.trigger('actionBegin', args, (args: ITaskAddedEventArgs) => {
                if (!args.cancel) {
                    if (isRemoteData(this.parent.dataSource)) {
                        const data: DataManager = this.parent.dataSource as DataManager;
                        const updatedData: object = {
                            addedRecords: [args.newTaskData], // to check
                            changedRecords: args.modifiedTaskData
                        };
                        const prevID: string = (args.data as IGanttData).ganttProperties.taskId.toString();
                        /* tslint:disable-next-line */
                        const query: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
                        const adaptor: AdaptorOptions = data.adaptor;
                        if (!(adaptor instanceof WebApiAdaptor && adaptor instanceof ODataAdaptor) || data.dataSource.batchUrl) {
                            /* tslint:disable-next-line */
                            const crud: Promise<Object> =
                                data.saveChanges(updatedData, this.parent.taskFields.id, null, query) as Promise<Object>;
                            crud.then((e: { addedRecords: Object[], changedRecords: Object[] }) => {
                                if (this.parent.taskFields.id && !isNullOrUndefined(e.addedRecords[0][this.parent.taskFields.id]) &&
                                    e.addedRecords[0][this.parent.taskFields.id].toString() !== prevID) {
                                    this.parent.setRecordValue(
                                        'taskId', e.addedRecords[0][this.parent.taskFields.id], (args.data as IGanttData).ganttProperties, true);
                                    this.parent.setRecordValue(
                                        'taskData.' + this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data as IGanttData);
                                    this.parent.setRecordValue(
                                        this.parent.taskFields.id, e.addedRecords[0][this.parent.taskFields.id], args.data as IGanttData);
                                    this.parent.setRecordValue(
                                        'rowUniqueID', e.addedRecords[0][this.parent.taskFields.id].toString(),
                                        (args.data as IGanttData).ganttProperties, true);
                                    const idsIndex: number = this.parent.ids.indexOf(prevID);
                                    if (idsIndex !== -1) {
                                        this.parent.ids[idsIndex] = e.addedRecords[0][this.parent.taskFields.id].toString();
                                    }
                                }
                                this.updateNewRecord(cAddedRecord, args);
                            }).catch((e: { result: Object[] }) => {
                                this.removeAddedRecord();
                                this.dmFailure(e as { result: Object[] }, args as ITaskbarEditedEventArgs);
                                this._resetProperties();
                            });
                        } else {
                            const addedRecords: string = 'addedRecords';
                            const insertCrud: Promise<Object> = data.insert(updatedData[addedRecords], null, query) as Promise<Object>;
                            insertCrud.then((e: ReturnType) => {
                                const changedRecords: string = 'changedRecords';
                                const addedRecords: Object = e[0];
                                /* tslint:disable-next-line */
                                const updateCrud: Promise<Object> =
                                    data.update(this.parent.taskFields.id, updatedData[changedRecords], null, query) as Promise<Object>;
                                updateCrud.then(() => {
                                    if (this.parent.taskFields.id && !isNullOrUndefined(addedRecords[this.parent.taskFields.id]) &&
                                        addedRecords[this.parent.taskFields.id].toString() !== prevID) {
                                        this.parent.setRecordValue(
                                            'taskId', addedRecords[this.parent.taskFields.id], (args.data as IGanttData).ganttProperties, true);
                                        this.parent.setRecordValue(
                                            'taskData.' + this.parent.taskFields.id, addedRecords[this.parent.taskFields.id],
                                            (args.data as IGanttData));
                                        this.parent.setRecordValue(
                                            this.parent.taskFields.id, addedRecords[this.parent.taskFields.id], (args.data as IGanttData));
                                        this.parent.setRecordValue(
                                            'rowUniqueID', addedRecords[this.parent.taskFields.id].toString(),
                                            (args.data as IGanttData).ganttProperties, true);
                                        const idIndex: number = this.parent.ids.indexOf(prevID);
                                        if (idIndex !== -1) {
                                            this.parent.ids[idIndex] = addedRecords[this.parent.taskFields.id].toString();
                                        }
                                    }
                                    this.updateNewRecord(cAddedRecord, args);
                                }).catch((e: { result: Object[] }) => {
                                    this.removeAddedRecord();
                                    this.dmFailure(e as { result: Object[] }, args as ITaskbarEditedEventArgs);
                                    this._resetProperties();
                                });
                            }).catch((e: { result: Object[] }) => {
                                this.removeAddedRecord();
                                this.dmFailure(e as { result: Object[] }, args as ITaskbarEditedEventArgs);
                                this._resetProperties();
                            });
                        }
                    } else {
                        if (this.parent.viewType === 'ProjectView') {
                            if ((rowPosition === 'Top' || rowPosition === 'Bottom') ||
                                ((rowPosition === 'Above' || rowPosition === 'Below' || rowPosition === 'Child') && !(args.data as IGanttData).parentItem)) {
                                    if (args.data instanceof Array) {
                                        this.updateRealDataSource(args.data as IGanttData, rowPosition);
                                    } else {
                                        let data: Object[] = [];
                                        data.push(args.data);
                                        this.updateRealDataSource(data as IGanttData, rowPosition);
                                    }
                                }
                        } else {
                            const dataSource: Object[] = isCountRequired(this.parent) ? getValue('result', this.parent.dataSource) :
                            this.parent.dataSource as Object[]; // eslint-disable-line
                            dataSource.push((args.data as IGanttData).taskData);
                        }
                        if ((cAddedRecord as IGanttData).level === 0) {
                            this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
                        }
                        this.updateTreeGridUniqueID(cAddedRecord as IGanttData, 'add');
                        this.refreshNewlyAddedRecord(args, cAddedRecord);
                        this._resetProperties();
                    }
                } else {
                    args = args;
                    this.removeAddedRecord();
                    this.reUpdatePreviousRecords();
                    this._resetProperties();
                }
            });
        }
    }

    /**
     * Method to validateTaskPosition.
     *
     * @param {Object | object[] } data - Defines the new data to add.
     * @param {RowPosition} rowPosition - Defines the position of row.
     * @param {number} rowIndex - Defines the row index.
     * @param {IGanttData} cAddedRecord - Defines the single data to validate.
     * @returns {void} .
     * @private
     */
      public createNewRecord(): IGanttData {
        const tempRecord: IGanttData = {};
        const ganttColumns: GanttColumnModel[] = this.parent.ganttColumns;
        const taskSettingsFields: TaskFieldsModel = this.parent.taskFields;
        const taskId: number | string = this.parent.editModule.getNewTaskId();
        for (let i: number = 0; i < ganttColumns.length; i++) {
            const fieldName: string = ganttColumns[i].field;
            if (fieldName === taskSettingsFields.id) {
                tempRecord[fieldName] = taskId;
            } else if (ganttColumns[i].field === taskSettingsFields.startDate) {
                if (isNullOrUndefined(tempRecord[taskSettingsFields.endDate])) {
                    tempRecord[fieldName] = this.parent.editModule.dialogModule.getMinimumStartDate();
                } else {
                    tempRecord[fieldName] = new Date(tempRecord[taskSettingsFields.endDate]);
                }
                if (this.parent.timezone) {
                    tempRecord[fieldName] = this.parent.dateValidationModule.remove(tempRecord[fieldName], this.parent.timezone);
                }
            } else if (ganttColumns[i].field === taskSettingsFields.endDate) {
                if (isNullOrUndefined(tempRecord[taskSettingsFields.startDate])) {
                    tempRecord[fieldName] = this.parent.editModule.dialogModule.getMinimumStartDate();
                } else {
                    tempRecord[fieldName] = new Date(tempRecord[taskSettingsFields.startDate]);
                }
                if (this.parent.timezone) {
                    tempRecord[fieldName] = this.parent.dateValidationModule.remove(tempRecord[fieldName], this.parent.timezone);
                }
            } else if (ganttColumns[i].field === taskSettingsFields.duration) {
                tempRecord[fieldName] = 1;
            } else if (ganttColumns[i].field === taskSettingsFields.name) {
                tempRecord[fieldName] = this.parent.editModule.dialogModule['localeObj'].getConstant('addDialogTitle')+' '+ taskId;
            } else if (ganttColumns[i].field === taskSettingsFields.progress) {
                tempRecord[fieldName] = 0;
            } else if (ganttColumns[i].field === taskSettingsFields.work) {
                tempRecord[fieldName] = 0;
            } else if (ganttColumns[i].field === 'taskType') {
                tempRecord[fieldName] = this.parent.taskType;
            } else {
                tempRecord[this.parent.ganttColumns[i].field] = '';
            }
        }
        return tempRecord;
    }
    public validateTaskPosition(data?: Object | object[], rowPosition?: RowPosition, rowIndex?: number, cAddedRecord?: IGanttData[]): void {
        const selectedRowIndex: number = isNullOrUndefined(rowIndex) || isNaN(parseInt(rowIndex.toString(), 10)) ?
            this.parent.selectionModule ?
                (this.parent.selectionSettings.mode === 'Row' || this.parent.selectionSettings.mode === 'Both') &&
                    this.parent.selectionModule.selectedRowIndexes.length === 1 ?
                    this.parent.selectionModule.selectedRowIndexes[0] :
                    this.parent.selectionSettings.mode === 'Cell' &&
                        this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ?
                        this.parent.selectionModule.getSelectedRowCellIndexes()[0].rowIndex : null : null : rowIndex;
        this.addRowSelectedItem = isNullOrUndefined(selectedRowIndex) ? null : this.parent.updatedRecords[selectedRowIndex];
        rowPosition = isNullOrUndefined(rowPosition) ? this.parent.editSettings.newRowPosition : rowPosition;
        data = isNullOrUndefined(data) ? this.createNewRecord() : data;
        if (((isNullOrUndefined(selectedRowIndex) || selectedRowIndex < 0 ||
            isNullOrUndefined(this.addRowSelectedItem)) && (rowPosition === 'Above'
                || rowPosition === 'Below'
                || rowPosition === 'Child')) || !rowPosition || (rowPosition !== 'Above'
                    && rowPosition !== 'Below'
                    && rowPosition !== 'Child' && rowPosition !== 'Top' &&
                    rowPosition !== 'Bottom')) {
            rowPosition = 'Top';
        }
        let level: number = 0;
        let parentItem: IGanttData;
        switch (rowPosition) {
        case 'Top':
        case 'Bottom':
            if (this.parent.viewType === "ResourceView") {
                level = 1;
            } else {
                level = 0;
            }
            break;
        case 'Above':
        case 'Below':
            level = this.addRowSelectedItem.level;
            parentItem = this.parent.getParentTask(this.addRowSelectedItem.parentItem);
            break;
        case 'Child':
            level = this.addRowSelectedItem.level + 1;
            parentItem = this.addRowSelectedItem;
            break;
        }
        this.prepareNewlyAddedData(data, rowPosition);
        const AddRecord: IGanttData = (this.updateNewlyAddedDataBeforeAjax(data, level, rowPosition, parentItem));
        cAddedRecord.push(AddRecord);
    }

    private updateNewRecord(cAddedRecord: IGanttData[], args: ITaskAddedEventArgs): void {
        if ((cAddedRecord as IGanttData).level === 0) {
            this.parent.treeGrid.parentData.splice(0, 0, cAddedRecord);
            const tempData: ITaskData[] = getValue('dataOperation.dataArray', this.parent);
            tempData.splice(0, 0, (cAddedRecord as IGanttData).taskData);
        }
        this.updateTreeGridUniqueID(cAddedRecord as IGanttData, 'add');
        this.refreshNewlyAddedRecord(args, cAddedRecord);
        this._resetProperties();
    }
    /**
     * Method to reset the flag after adding new record
     *
     * @returns {void} .
     */
    private _resetProperties(): void {
        this.parent.isOnEdit = false;
        this.parent.hideSpinner();
        this.addRowSelectedItem = null;
        this.newlyAddedRecordBackup = null;
        this.isBreakLoop = false;
        this.parent.element.tabIndex = 0;
        this.parent.initiateEditAction(false);
    }

    /**
     * Method to update unique id collection in TreeGrid
     *
     * @param {IGanttData} data .
     * @param {string} action .
     * @returns {void} .
     */
    private updateTreeGridUniqueID(data: IGanttData, action: string): void {
        if (action === 'add') {
            setValue('uniqueIDCollection.' + data.uniqueID, data, this.parent.treeGrid);
        } else if (action === 'delete') {
            deleteObject(getValue('uniqueIDCollection', this.parent.treeGrid), data.uniqueID);
        }
    }


    private refreshNewlyAddedRecord(args: ITaskAddedEventArgs, cAddedRecord: IGanttData[]): void {
        if (this.parent.selectionModule && this.parent.allowSelection &&
            (this.parent.selectionSettings.mode === 'Row' || this.parent.selectionSettings.mode === 'Both')) {
            this.parent.staticSelectedRowIndex = this.parent.currentViewData.indexOf(args.data as IGanttData);
        }
        if (this.parent.timelineSettings.updateTimescaleView) {
            let tempArray: IGanttData[] = [];
            if (args.modifiedRecords.length > 0) {
                tempArray = (args.data as IGanttData[]).length > 0 ? args.data as IGanttData[] : [args.data as IGanttData];
                // eslint-disable-next-line
                tempArray.push.apply(tempArray, args.modifiedRecords);
            } else {
                tempArray = (args.data as IGanttData[]).length > 0 ? args.data as IGanttData[] : [args.data as IGanttData];
            }
            this.parent.timelineModule.updateTimeLineOnEditing([tempArray], args.action);
        }
        this.addSuccess(args);
        args = this.constructTaskAddedEventArgs(cAddedRecord, args.modifiedRecords, 'add');
        if (this.dialogModule.isAddNewResource && !this.parent.isEdit && this.parent.taskFields.work){
            this.parent.dataOperation.updateWorkWithDuration(cAddedRecord[0]);
        }
        this.parent.trigger('actionComplete', args);
        if (this.dialogModule.dialog && !this.dialogModule.dialogObj.isDestroyed) {
            this.dialogModule.dialogObj.hide();
        }
        this.dialogModule.dialogClose();
        if (this.parent.viewType === 'ResourceView') {
            if (cAddedRecord.length > 1) {
                for (let i: number = 0; i < cAddedRecord.length; i++) {
                    (args.data[i] as IGanttData).ganttProperties.sharedTaskUniqueIds.push((args.data[i] as IGanttData)
                        .ganttProperties.rowUniqueID);
                    if ((args.data[i] as IGanttData).ganttProperties.resourceInfo) {
                        // if ((args.data[i] as IGanttData).ganttProperties.resourceInfo.length > 1) {
                        const resources: Object[] =
                            extend([], [], (args.data[i] as IGanttData).ganttProperties.resourceInfo, true) as Object[];
                        resources.splice(0, 1);
                        this.updateResoures([], resources, args.data[i] as IGanttData);
                        // }
                    }
                    else {
                        this.removeChildRecord(args.data[i] as IGanttData);
                        this.parent.editModule.checkWithUnassignedTask(args.data[i] as IGanttData);
                    }
                    for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                        this.parent.dataOperation.updateParentItems(this.updateParentRecords[k]);
                    }
                    this.updateParentRecords = [];
                }
            }
            else {
                (args.data as IGanttData).ganttProperties.sharedTaskUniqueIds.push((args.data as IGanttData).ganttProperties.rowUniqueID);
                // eslint-disable-next-line
                if ((args.data as IGanttData).ganttProperties.resourceInfo && (args.data as IGanttData).ganttProperties.resourceInfo.length) {
                    if ((args.data as IGanttData).ganttProperties.resourceInfo.length > 1) {
                        // eslint-disable-next-line
                        const resources: Object[] = extend([], [], (args.data as IGanttData).ganttProperties.resourceInfo, true) as Object[];
                        resources.splice(0, 1);
                        this.updateResoures([], resources, args.data as IGanttData);
                    }
                }
                else {
                    this.removeChildRecord(args.data as IGanttData);
                    this.parent.editModule.checkWithUnassignedTask(args.data as IGanttData);
                }
                for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                    this.parent.dataOperation.updateParentItems(this.updateParentRecords[k]);
                }
                this.updateParentRecords = [];
            }
        }
    }

    /**
     *
     * @returns {void} .
     * @private
     */
    private removeAddedRecord(): void {
        const flatRecords: IGanttData[] = this.parent.flatData;
        const currentViewData: IGanttData[] = this.parent.currentViewData;
        const ids: string[] = this.parent.ids;
        const flatRecordsIndex: number = flatRecords.indexOf(this.newlyAddedRecordBackup);
        const currentViewDataIndex: number = currentViewData.indexOf(this.newlyAddedRecordBackup);
        const idsIndex: number = ids.indexOf(this.newlyAddedRecordBackup.ganttProperties.rowUniqueID.toString());
        deleteObject(this.parent.previousRecords, flatRecords[flatRecordsIndex].uniqueID);
        if (this.newlyAddedRecordBackup.parentItem) {
            const parentItem: IGanttData = this.parent.getParentTask(this.newlyAddedRecordBackup.parentItem);
            const parentIndex: number = parentItem.childRecords.indexOf(this.newlyAddedRecordBackup);
            parentItem.childRecords.splice(parentIndex, 1);
        }
        flatRecords.splice(flatRecordsIndex, 1);
        currentViewData.splice(currentViewDataIndex, 1);
        ids.splice(idsIndex, 1);
    }
    private getPrevRecordIndex(): number {
        const prevRecord: IGanttData = this.parent.updatedRecords[this.parent.selectionModule.getSelectedRowIndexes()[0] - 1];
        const selectedRecord: IGanttData = this.parent.selectionModule.getSelectedRecords()[0];
        const parent: IGanttData = this.parent.getRootParent(prevRecord, selectedRecord.level);
        const prevIndex: number = this.parent.updatedRecords.indexOf(parent);
        return prevIndex;
    }
    /**
     * indent a selected record
     *
     * @returns {void} .
     */
    public indent(): void {
        const index: number = this.parent.selectedRowIndex;
        const isSelected: boolean = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
            this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
        let dropIndex: number;
        const prevRecord: IGanttData = this.parent.updatedRecords[this.parent.selectionModule.getSelectedRowIndexes()[0] - 1];
        const selectedRecord: IGanttData = this.parent.selectionModule.getSelectedRecords()[0];
        if (!this.parent.editSettings.allowEditing || index === 0 || index === -1 || !isSelected ||
            this.parent.viewType === 'ResourceView' || this.parent.updatedRecords[index].level - prevRecord.level === 1) {
            return;
        } else {
            if (prevRecord.level - selectedRecord.level === 0) {
                dropIndex = this.parent.selectionModule.getSelectedRowIndexes()[0] - 1;
            } else {
                dropIndex = this.getPrevRecordIndex();
            }
            this.indentOutdentRow([this.parent.selectionModule.getSelectedRowIndexes()[0]], dropIndex, 'child');
        }
    }

    /**
     * To perform outdent operation for selected row
     *
     * @returns {void} .
     */
    public outdent(): void {
        const index: number = this.parent.selectionModule.getSelectedRowIndexes()[0];
        let dropIndex: number;
        const isSelected: boolean = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
            this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
        if (!this.parent.editSettings.allowEditing || index === -1 || index === 0 || !isSelected ||
            this.parent.viewType === 'ResourceView' || this.parent.updatedRecords[index].level === 0) {
            return;
        } else {
            const thisParent: IGanttData = this.parent.getTaskByUniqueID((this.parent.selectionModule.getSelectedRecords()[0] as
                IGanttData).parentItem.uniqueID);
            dropIndex = this.parent.updatedRecords.indexOf(thisParent);
            this.indentOutdentRow([index], dropIndex, 'below');
        }
    }
    private indentOutdentRow(fromIndexes: number[], toIndex: number, pos: string): void {
        // eslint-disable-next-line
        if (fromIndexes[0] !== toIndex && pos === 'above' || 'below' || 'child') {
            if (pos === 'above') {
                this.dropPosition = 'topSegment';
            }
            if (pos === 'below') {
                this.dropPosition = 'bottomSegment';
            }
            if (pos === 'child') {
                this.dropPosition = 'middleSegment';
            }
            let action: string;
            const record: IGanttData[] = [];
            for (let i: number = 0; i < fromIndexes.length; i++) {
                record[i] = this.parent.updatedRecords[fromIndexes[i]];
            }
            const isByMethod: boolean = true;
            const args: RowDropEventArgs = {
                data: record,
                dropIndex: toIndex,
                dropPosition: this.dropPosition
            };
            if (this.dropPosition === 'middleSegment') {
                action =  'indenting';
            } else if (this.dropPosition === 'bottomSegment') {
                action =  'outdenting';
            }
            const actionArgs: IActionBeginEventArgs = {
                action : action,
                data: record[0],
                cancel: false
            };
            this.parent.trigger('actionBegin', actionArgs, (actionArg: IActionBeginEventArgs) => {
                if (!actionArg.cancel) {
                    this.reArrangeRows(args, isByMethod);
                } else {
                    return;
                }
            });
        } else {
            return;
        }
    }
    private reArrangeRows(args: RowDropEventArgs, isByMethod?: boolean): void {
        this.dropPosition = args.dropPosition;
        if (args.dropPosition !== 'Invalid' && this.parent.editModule) {
            const obj: Gantt = this.parent; let draggedRec: IGanttData;
            this.droppedRecord = obj.updatedRecords[args.dropIndex];
            let dragRecords: IGanttData[] = [];
            const droppedRec: IGanttData = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data as IGanttData);
            } else {
                dragRecords = args.data;
            }
            let c: number = 0;
            const dLength: number = dragRecords.length;
            for (let i: number = 0; i < dLength; i++) {
                this.parent.isOnEdit = true;
                draggedRec = dragRecords[i];
                this.draggedRecord = draggedRec;
                if (this.dropPosition !== 'Invalid') {
                    if (isByMethod) {
                        this.deleteDragRow();
                    }
                    const recordIndex1: number = this.treeGridData.indexOf(droppedRec);
                    if (this.dropPosition === 'bottomSegment') {
                        if (!droppedRec.hasChildRecords) {
                            if (this.parent.taskFields.parentID && (this.ganttData as IGanttData[]).length > 0) {
                                (this.ganttData as IGanttData[]).splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                            this.parent.ids.splice(recordIndex1 + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                        } else {
                            c = this.parent.editModule.getChildCount(droppedRec, 0);
                            if (this.parent.taskFields.parentID && (this.ganttData as IGanttData[]).length > 0) {
                                (this.ganttData as IGanttData[]).splice(recordIndex1 + c + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + c + 1, 0, this.draggedRecord);
                            this.parent.ids.splice(recordIndex1 + c + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                            const idIndex: number = this.parent.ids.indexOf(this.draggedRecord[this.parent.taskFields.id].toString());
                            if (idIndex !== recordIndex1 + c + 1) {
                                this.parent.ids.splice(idIndex, 1);
                                this.parent.ids.splice(recordIndex1 + c + 1, 0, this.draggedRecord[this.parent.taskFields.id].toString());
                            }
                        }
                        this.parent.setRecordValue('parentItem', this.treeGridData[recordIndex1].parentItem, draggedRec);
                        this.parent.setRecordValue('parentUniqueID', this.treeGridData[recordIndex1].parentUniqueID, draggedRec);
                        this.parent.setRecordValue('level', this.treeGridData[recordIndex1].level, draggedRec);
                        if (draggedRec.hasChildRecords) {
                            const level: number = 1;
                            this.updateChildRecordLevel(draggedRec, level);
                            this.updateChildRecord(draggedRec, recordIndex1 + c + 1);
                        }
                        if (droppedRec.parentItem) {
                            const record: IGanttData[] = this.parent.getParentTask(droppedRec.parentItem).childRecords;
                            const childRecords: IGanttData[] = record;
                            const droppedRecordIndex: number = childRecords.indexOf(droppedRec) + 1;
                            childRecords.splice(droppedRecordIndex, 0, draggedRec);
                        }
                    }
                    if (this.dropPosition === 'middleSegment') {
                        this.dropMiddle(recordIndex1);
                    }
                    if (!isNullOrUndefined(draggedRec.parentItem && this.updateParentRecords.indexOf(draggedRec.parentItem) !== -1)) {
                        this.updateParentRecords.push(draggedRec.parentItem);
                    }
                }
                if (isNullOrUndefined(draggedRec.parentItem)) {
                    const parentRecords: ITreeData[] = this.parent.treeGrid.parentData;
                    const newParentIndex: number = parentRecords.indexOf(this.droppedRecord);
                    if (this.dropPosition === 'bottomSegment') {
                        parentRecords.splice(newParentIndex + 1, 0, draggedRec);
                    }
                }
                this.refreshDataSource();
            }
            if (this.dropPosition === 'middleSegment') {
                if (droppedRec.ganttProperties.predecessor) {
                    this.parent.editModule.removePredecessorOnDelete(droppedRec);
                    droppedRec.ganttProperties.predecessor = null;
                    droppedRec.ganttProperties.predecessorsName = null;
                    droppedRec[this.parent.taskFields.dependency] = null;
                    droppedRec.taskData[this.parent.taskFields.dependency] = null;
                }
                if (droppedRec.ganttProperties.isMilestone) {
                    this.parent.setRecordValue('isMilestone', false, droppedRec.ganttProperties, true);
                    if (!isNullOrUndefined(droppedRec.taskData[this.parent.taskFields.milestone])) {
                        if (droppedRec.taskData[this.parent.taskFields.milestone] === true) {
                            droppedRec.taskData[this.parent.taskFields.milestone] = false;
                        }
                    }
                }
            }
            for (let k: number = 0; k < this.updateParentRecords.length; k++) {
                this.parent.dataOperation.updateParentItems(this.updateParentRecords[k]);
            }
            this.updateParentRecords = [];
            this.parent.isOnEdit = false;
        }
        this.refreshRecord(args);
    }
    /**
     * @returns {void} .
     * @private
     */
    public refreshRecord(args: RowDropEventArgs, isDrag?: boolean): void {
        if (isRemoteData(this.parent.dataSource)) {
            const data: DataManager = this.parent.dataSource as DataManager;
            const updatedData: object = {
                changedRecords: getTaskData(this.parent.editedRecords, null, null, this.parent)
            };
            const queryValue: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
            let crud: Promise<Object> = null;
            const adaptor: AdaptorOptions = data.adaptor;
            if (!(adaptor instanceof WebApiAdaptor && adaptor instanceof ODataAdaptor) || data.dataSource.batchUrl) {
                crud = data.saveChanges(updatedData, this.parent.taskFields.id, null, queryValue) as Promise<Object>;
            } else {
                const changedRecords: string = 'changedRecords';
                crud = data.update(this.parent.taskFields.id, updatedData[changedRecords], null, queryValue) as Promise<Object>;
            }
            crud.then((e: ReturnType) => this.indentSuccess(e, args, isDrag))
                .catch((e: { result: Object[] }) => this.indentFailure(e as { result: Object[] }));
        } else {
            this.indentOutdentSuccess(args, isDrag);
        }
    }
    private indentSuccess(e: ReturnType, args: RowDropEventArgs, isDrag: boolean): void {
        this.indentOutdentSuccess(args, isDrag);
    }
    private indentFailure(e: { result: Object[] }): void {
        this.parent.trigger('actionFailure', { error: e });
    }
    private indentOutdentSuccess(args: RowDropEventArgs, isDrag: boolean): void {
        this.parent.treeGrid.parentData = [];
        this.parent.treeGrid.refresh();
        if (this.parent.enableImmutableMode) {
            this.refreshRecordInImmutableMode();
        }
        if (isDrag) {
            args.requestType = 'rowDropped';
        } else {
            if (this.dropPosition === 'middleSegment') {
                args.requestType = 'indented';
            } else if (this.dropPosition === 'bottomSegment') {
                args.requestType = 'outdented';
            }
        }
        args.modifiedRecords = this.parent.editedRecords;
        if (this.parent.timezone) {
            for (let i: number = 0; i < args.modifiedRecords.length; i++) {
                updateDates(args.modifiedRecords[i], this.parent);
            }
        }
        this.parent.trigger('actionComplete', args);
        this.parent.editedRecords = [];
    }
    private refreshDataSource(): void {
        const draggedRec: IGanttData = this.draggedRecord;
        const droppedRec: IGanttData = this.droppedRecord;
        const proxy: Gantt = this.parent;
        let tempData: Object;
        let indx: number;
        if (this.parent.dataSource instanceof DataManager) {
            tempData = getValue('dataOperation.dataArray', this.parent);
        } else {
            tempData = proxy.dataSource;
        }
        if ((tempData as IGanttData[]).length > 0 && (!isNullOrUndefined(droppedRec) && !droppedRec.parentItem)) {
            for (let i: number = 0; i < Object.keys(tempData).length; i++) {
                if (tempData[i][this.parent.taskFields.child] === droppedRec.taskData[this.parent.taskFields.child]) {
                    indx = i;
                }
            }
            if (this.dropPosition === 'topSegment') {
                if (!this.parent.taskFields.parentID) {
                    (tempData as IGanttData[]).splice(indx, 0, draggedRec.taskData);
                }
            } else if (this.dropPosition === 'bottomSegment') {
                if (!this.parent.taskFields.parentID) {
                    (tempData as IGanttData[]).splice(indx + 1, 0, draggedRec.taskData);
                }
            }
        } else if (!this.parent.taskFields.parentID && (!isNullOrUndefined(droppedRec) && droppedRec.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                const rowPos: RowPosition = this.dropPosition === 'topSegment' ? 'Above' : 'Below';
                this.parent.editModule.addRowSelectedItem = droppedRec;
                this.parent.editModule.updateRealDataSource(draggedRec, rowPos);
                delete this.parent.editModule.addRowSelectedItem;
            }
        }
        if (this.parent.taskFields.parentID) {
            if (draggedRec.parentItem) {
                if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                    draggedRec[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.parentID];
                    draggedRec.taskData[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.parentID];
                    draggedRec.ganttProperties['parentId'] = droppedRec[this.parent.taskFields.parentID];
                } else {
                    draggedRec[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.id];
                    draggedRec.taskData[this.parent.taskFields.parentID] = droppedRec[this.parent.taskFields.id];
                    draggedRec.ganttProperties['parentId'] = droppedRec[this.parent.taskFields.id];
                }
            } else {
                draggedRec[this.parent.taskFields.parentID] = null;
                draggedRec.taskData[this.parent.taskFields.parentID] = null;
                draggedRec.ganttProperties['parentId'] = null;
            }
        }
    }
    private deleteDragRow(): void {
        if (this.parent.dataSource instanceof DataManager) {
            this.ganttData = getValue('dataOperation.dataArray', this.parent);
        } else {
            this.ganttData = isCountRequired(this.parent) ? getValue('result', this.parent.dataSource) :
                this.parent.dataSource;
        }
        this.treeGridData = isCountRequired(this.parent) ?
            getValue('result', this.parent.treeGrid.dataSource) : this.parent.treeGrid.dataSource;
        const delRow: IGanttData = this.parent.getTaskByUniqueID(this.draggedRecord.uniqueID);
        this.removeRecords(delRow);
    }
    private updateIndentedChildRecords(indentedRecord: IGanttData) {
        let createParentItem: IParent = {
            uniqueID: indentedRecord.uniqueID,
            expanded: indentedRecord.expanded,
            level: indentedRecord.level,
            index: indentedRecord.index,
            taskId: indentedRecord.ganttProperties.rowUniqueID
        };
        for (let i: number = 0; i < indentedRecord.childRecords.length; i++) {
            this.parent.setRecordValue('parentItem', createParentItem, indentedRecord.childRecords[i]);
            this.parent.setRecordValue('parentUniqueID', indentedRecord.uniqueID, indentedRecord.childRecords[i]);
        }
        if (indentedRecord.hasChildRecords) {
            (indentedRecord as IGanttData[]) = indentedRecord.childRecords;
            for (let j = 0; j < indentedRecord['length']; j++) {
                this.updateIndentedChildRecords(indentedRecord[j]);
            }
        }
    }
    private dropMiddle(recordIndex1: number): void {
        const obj: Gantt = this.parent;
        const childRec: number = this.parent.editModule.getChildCount(this.droppedRecord, 0);
        const childRecordsLength: number = (isNullOrUndefined(childRec) ||
            childRec === 0) ? recordIndex1 + 1 :
            childRec + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment') {
            if (obj.taskFields.parentID && (this.ganttData as IGanttData[]).length > 0) {
                (this.ganttData as IGanttData[]).splice(childRecordsLength, 0, this.draggedRecord.taskData);
            }
            this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            this.parent.ids.splice(childRecordsLength, 0, this.draggedRecord[this.parent.taskFields.id].toString());
            this.recordLevel();
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
                if (this.parent.enableImmutableMode) {
                    let indentedRecord = this.draggedRecord;
                    this.updateIndentedChildRecords(indentedRecord);
                }
            }
            if (isNullOrUndefined(this.draggedRecord.parentItem &&
                this.updateParentRecords.indexOf(this.draggedRecord.parentItem) !== -1)) {
                this.updateParentRecords.push(this.draggedRecord.parentItem);
            }
        }
    }
    private updateChildRecordLevel(record: IGanttData, levl: number): number {
        let length: number = 0;
        let currentRec: IGanttData;
        levl++;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let j: number = 0; j < length; j++) {
            currentRec = record.childRecords[j];
            let parentData: IGanttData;
            if (record.parentItem) {
                const id: string = 'uniqueIDCollection';
                parentData = this.parent.treeGrid[id][record.parentItem.uniqueID];
            }
            currentRec.level = record.parentItem ? parentData.level + levl : record.level + 1;
            if (currentRec.hasChildRecords) {
                levl--;
                levl = this.updateChildRecordLevel(currentRec, levl);
            }
        }
        return levl;
    }
    /* eslint-disable-next-line */
    private updateChildRecord(record: IGanttData, count: number, expanded?: boolean): number {
        let currentRec: IGanttData;
        const obj: Gantt = this.parent;
        let length: number = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            currentRec = record.childRecords[i];
            count++;
            obj.flatData.splice(count, 0, currentRec);
            this.parent.ids.splice(count, 0, currentRec.ganttProperties.rowUniqueID.toString());
            if (obj.taskFields.parentID && (this.ganttData as IGanttData[]).length > 0) {
                (this.ganttData as IGanttData[]).splice(count, 0, currentRec.taskData);
            }
            if (currentRec.hasChildRecords) {
                count = this.updateChildRecord(currentRec, count);
            }
        }
        return count;
    }
    private removeRecords(record: IGanttData): void {
        const obj: Gantt = this.parent;
        let dataSource: Object;
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = getValue('dataOperation.dataArray', this.parent);
        } else {
            dataSource = this.parent.dataSource;
        }
        const delRow: IGanttData = record;
        const flatParent: IGanttData = this.parent.getParentTask(delRow.parentItem);
        if (delRow) {
            if (delRow.parentItem) {
                const childRecords: IGanttData[] = flatParent ? flatParent.childRecords : [];
                let childIndex: number = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(delRow);
                    flatParent.childRecords.splice(childIndex, 1);
                    if (!this.parent.taskFields.parentID) {
                        flatParent.taskData[this.parent.taskFields.child].splice(childIndex, 1);
                    }
                    // collection for updating parent record
                    this.updateParentRecords.push(flatParent);
                }
            }
            if (obj.taskFields.parentID) {
                if (delRow.hasChildRecords && delRow.childRecords.length > 0) {
                    this.removeChildItem(delRow);
                }
                let indx: number;
                const ganttData: IGanttData[] = (dataSource as IGanttData[]).length > 0 ?
                    dataSource as IGanttData[] : this.parent.currentViewData;
                for (let i: number = 0; i < ganttData.length; i++) {
                    if (ganttData[i][this.parent.taskFields.id] === delRow.taskData[this.parent.taskFields.id]) {
                        indx = i;
                    }
                }
                if (indx !== -1) {
                    if ((dataSource as IGanttData[]).length > 0) {
                        (dataSource as IGanttData[]).splice(indx, 1);
                    }
                    let gridIndx: number;
                    for (let i: number = 0; i < this.treeGridData.length; i++) {
                        if (this.treeGridData[i][this.parent.taskFields.id] === delRow.taskData[this.parent.taskFields.id]) {
                            gridIndx = i;
                        }
                    }
                    this.treeGridData.splice(gridIndx, 1);
                    this.parent.ids.splice(gridIndx, 1);
                    if (this.parent.treeGrid.parentData.indexOf(delRow) !== -1) {
                        this.parent.treeGrid.parentData.splice(this.parent.treeGrid.parentData.indexOf(delRow), 1);
                    }
                }
            }
            const recordIdx: number = this.treeGridData.indexOf(delRow);
            if (!obj.taskFields.parentID) {
                const deletedRecordCount: number = this.getChildCount(delRow, 0);
                this.treeGridData.splice(recordIdx, deletedRecordCount + 1);
                this.parent.ids.splice(recordIdx, deletedRecordCount + 1);
                const parentIndex: number = (this.ganttData as IGanttData[]).indexOf(delRow.taskData);
                if (parentIndex !== -1) {
                    (this.ganttData as IGanttData[]).splice(parentIndex, 1);
                    this.parent.treeGrid.parentData.splice(parentIndex, 1);
                }
            }
            if (delRow.parentItem && flatParent && flatParent.childRecords && !flatParent.childRecords.length) {
                this.parent.setRecordValue('expanded', false, flatParent);
                this.parent.setRecordValue('hasChildRecords', false, flatParent);
            }
        }
    }
    private removeChildItem(record: IGanttData): void {
        let currentRec: IGanttData;
        let indx: number;
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRec = record.childRecords[i];
            let data: Object;
            if (this.parent.dataSource instanceof DataManager) {
                data = getValue('dataOperation.dataArray', this.parent);
            } else {
                data = this.parent.dataSource;
            }
            for (let j: number = 0; j < (<IGanttData[]>data).length; j++) {
                if (data[j][this.parent.taskFields.id] === currentRec.taskData[this.parent.taskFields.id]) {
                    indx = j;
                }
            }
            if (indx !== -1) {
                if ((data as IGanttData[]).length > 0) {
                    (data as IGanttData[]).splice(indx, 1);
                }
                let gridIndx: number;
                for (let i: number = 0; i < this.treeGridData.length; i++) {
                    if (this.treeGridData[i][this.parent.taskFields.id] === currentRec.taskData[this.parent.taskFields.id]) {
                        gridIndx = i;
                    }
                }
                this.treeGridData.splice(gridIndx, 1);
                this.parent.ids.splice(gridIndx, 1);
            }
            if (currentRec.hasChildRecords) {
                this.removeChildItem(currentRec);
            }
        }
    }
    private recordLevel(): void {
        const obj: Gantt = this.parent;
        const draggedRec: IGanttData = this.draggedRecord;
        const droppedRec: IGanttData = this.droppedRecord;
        const childItem: string = obj.taskFields.child;
        if (!droppedRec.hasChildRecords) {
            droppedRec.hasChildRecords = true;
            if (!droppedRec.childRecords.length) {
                droppedRec.childRecords = [];
                if (!obj.taskFields.parentID && isNullOrUndefined(droppedRec.taskData[childItem])) {
                    droppedRec.taskData[childItem] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            const parentItem: IGanttData = extend({}, droppedRec);
            delete parentItem.childRecords;
            const createParentItem: IParent = {
                uniqueID: parentItem.uniqueID,
                expanded: parentItem.expanded,
                level: parentItem.level,
                index: parentItem.index,
                taskId: parentItem.ganttProperties.rowUniqueID
            };
            this.parent.setRecordValue('parentItem', createParentItem, draggedRec);
            this.parent.setRecordValue('parentUniqueID', droppedRec.uniqueID, draggedRec);
            droppedRec.childRecords.splice(droppedRec.childRecords.length, 0, draggedRec);
            if (!isNullOrUndefined(draggedRec) && !obj.taskFields.parentID && !isNullOrUndefined(droppedRec.taskData[childItem])) {
                droppedRec.taskData[obj.taskFields.child].splice(droppedRec.childRecords.length, 0, draggedRec.taskData);
            }
            if (!isNullOrUndefined(droppedRec.ganttProperties.segments) && droppedRec.ganttProperties.segments.length > 0) {
                droppedRec.ganttProperties.segments = null;
                droppedRec.taskData[obj.taskFields.segments] = null;
            }
            if (!draggedRec.hasChildRecords) {
                draggedRec.level = droppedRec.level + 1;
            } else {
                const level: number = 1;
                draggedRec.level = droppedRec.level + 1;
                this.updateChildRecordLevel(draggedRec, level);
            }
            droppedRec.expanded = true;
        }
    }
}
