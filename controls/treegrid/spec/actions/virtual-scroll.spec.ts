import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { QueryCellInfoEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/treegrid/actions/virtual-scroll';
import { virtualData, editVirtualData, dataSource } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { select } from '@syncfusion/ej2-base';
import { Filter } from '../../src/treegrid/actions/filter';

/**
 * TreeGrid Virtual Scroll spec 
 */

TreeGrid.Inject(VirtualScroll, Edit, Toolbar, Filter);

if(!editVirtualData.length){
    dataSource();
}

describe('TreeGrid Virtual Scroll', () => {
  describe('Rendering and basic actions', () => {
    let treegrid: TreeGrid;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
        {
          dataSource: virtualData.slice(0,1000),
          parentIdMapping: 'ParentID',
          idMapping: 'TaskID',
          height: 200,
          
    queryCellInfo: (args: QueryCellInfoEventArgs) => {
        if (parseInt(args.cell.innerHTML, 0) > 1000) {
         let x: HTMLElement = document.createElement('IMG');
         x.setAttribute('height', '15px');
         let span: HTMLElement = document.createElement('span');
         span.innerHTML = args.cell.innerHTML;
         span.setAttribute('style', 'padding-left:7px;');
         args.cell.innerHTML = '';
         args.cell.appendChild(x);
         args.cell.setAttribute('style', 'background-color:#7b2b1d;color:white;');
         args.cell.appendChild(span);
        } else if (parseInt(args.cell.innerHTML, 0) > 500) {
         let y: HTMLElement = document.createElement('IMG');
         y.setAttribute('height', '15px');
         let span: HTMLElement = document.createElement('span');
         span.innerHTML = args.cell.innerHTML;
         span.setAttribute('style', 'padding-left:7px;');
         args.cell.innerHTML = '';
         args.cell.appendChild(y);
         args.cell.setAttribute('style', 'background-color:#7b2b1d;color:white;');
         args.cell.appendChild(span);
        } else if (parseInt(args.cell.innerHTML, 0) > 250) {
         let z: HTMLElement = document.createElement('IMG');
         z.setAttribute('height', '15px');
         let span: HTMLElement = document.createElement('span');
         span.innerHTML = args.cell.innerHTML;
         span.setAttribute('style', 'padding-left:7px;');
         args.cell.innerHTML = '';
         args.cell.appendChild(z);
         args.cell.setAttribute('style', 'background-color:#336c12;color:white;');
         args.cell.appendChild(span);
        } else if (parseInt(args.cell.innerHTML, 0) > 100) {
         let a: HTMLElement = document.createElement('IMG');
         a.setAttribute('height', '15px');
         let span: HTMLElement = document.createElement('span');
         span.innerHTML = args.cell.innerHTML;
         span.setAttribute('style', 'padding-left:7px;');
         args.cell.innerHTML = '';
         args.cell.appendChild(a);
         args.cell.setAttribute('style', 'background-color:#336c12;color:white;');
         args.cell.appendChild(span);
        }
     },
            enableVirtualization: true,
            columns: [{ field: 'FIELD1', headerText: 'Player Name', width: 140 },
            { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
            { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
            { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
            { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
            { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
            { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
            { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' },
            { field: 'FIELD10', headerText: 'oRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD11', headerText: 'dRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD12', headerText: 'Rebounds', width: 120, textAlign: 'Right' },
            { field: 'FIELD13', headerText: 'Assists', width: 120, textAlign: 'Right' },
            { field: 'FIELD14', headerText: 'Steals', width: 120, textAlign: 'Right' },
            { field: 'FIELD15', headerText: 'Blocks', width: 120, textAlign: 'Right' },
            { field: 'FIELD16', headerText: 'Turnovers', width: 130, textAlign: 'Right' },
            { field: 'FIELD17', headerText: 'PF', width: 130, textAlign: 'Right' },
            { field: 'FIELD18', headerText: 'fgAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD19', headerText: 'fgMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD20', headerText: 'ftAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD21', headerText: 'ftMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD22', headerText: 'ThreeAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD23', headerText: 'ThreeMade', width: 130, textAlign: 'Right' },
            { field: 'FIELD24', headerText: 'PostGP', width: 120, textAlign: 'Right' },
            { field: 'FIELD25', headerText: 'PostGS', width: 120, textAlign: 'Right' },
            { field: 'FIELD26', headerText: 'PostMinutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD27', headerText: 'PostPoints', width: 130, textAlign: 'Right' },
            { field: 'FIELD28', headerText: 'PostoRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD29', headerText: 'PostdRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD30', headerText: 'PostRebounds', width: 130, textAlign: 'Right' }],
            treeColumnIndex: 1
        },
        done
      );
    });
    it('rendering test', (done: Function) => {
        expect(treegrid.getRows().length).toBe(20);
        expect(treegrid.getRows()[0].querySelectorAll('td')[2].getAttribute('style')).toBe('background-color:#336c12;color:white;');
        expect(!isNullOrUndefined(treegrid.getRows()[0].querySelectorAll('td')[1].querySelector('.e-icons.e-treegridexpand'))).toBe(true);
        done();
    });
    it('collapse test', (done: Function) => {
        let len: number = 0;
        collapsed = (args?: any) => {
            let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
        }
        treegrid.collapsed = collapsed;
        treegrid.collapseAll();
    });
    it('expand test', (done: Function) => {
        expanded = (args?: any) => {
            expect(isNullOrUndefined(treegrid.getRows()[1].querySelector('.e-treegridexpand'))).toBe(true);
            treegrid.expanded = null;
            done();
        }
        treegrid.expanded = expanded;
        treegrid.expandAll();
    });
    it('collapse test before scroll', (done: Function) => {
        let len: number = 0;
        collapsed = (args?: any) => {
            let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
        }
        treegrid.collapsed = collapsed;
        treegrid.collapseAll();
    });
    it('Scrolling continous', (done: Function) => {
        let content: HTMLElement = (<HTMLElement>treegrid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 1000;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 500);
        done();
    }) 
    it('collapse test after scroll', (done: Function) => {
        let len: number = 0;
        let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
    });
    it('expandAtLevel() test', (done: Function) => {
        expanded = (args?: any) => {
            expect(isNullOrUndefined(treegrid.getRows()[1].querySelector('.e-treegridexpand'))).toBe(true);
            treegrid.expanded = null;
            done();
        }
        treegrid.expanded = expanded;
        treegrid.expandAtLevel(0);
    });
    it('collapseAtLevel test', (done: Function) => {
        let len: number = 0;
        collapsed = (args?: any) => {
            let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
        }
        treegrid.collapsed = collapsed;
        treegrid.collapseAtLevel(0);
    });    
    it('Scrolling up continous', (done: Function) => {
        let content: HTMLElement = (<HTMLElement>treegrid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 0;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 500);
        done();
    }) 
    afterAll(() => {
      destroy(treegrid);
    });
  });
  describe('Scroll Down with CollapseAll', () => {
    let treegrid: TreeGrid;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
            {
              dataSource: virtualData.slice(0,1000),
              parentIdMapping: 'ParentID',
              idMapping: 'TaskID',
              height: 200,
              enableVirtualization: true,
            columns: [{ field: 'FIELD1', headerText: 'Player Name', width: 140 },
            { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
            { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
            { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
            { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
            { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
            { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
            { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' },
            { field: 'FIELD10', headerText: 'oRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD11', headerText: 'dRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD12', headerText: 'Rebounds', width: 120, textAlign: 'Right' },
            { field: 'FIELD13', headerText: 'Assists', width: 120, textAlign: 'Right' },
            { field: 'FIELD14', headerText: 'Steals', width: 120, textAlign: 'Right' },
            { field: 'FIELD15', headerText: 'Blocks', width: 120, textAlign: 'Right' },
            { field: 'FIELD16', headerText: 'Turnovers', width: 130, textAlign: 'Right' },
            { field: 'FIELD17', headerText: 'PF', width: 130, textAlign: 'Right' },
            { field: 'FIELD18', headerText: 'fgAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD19', headerText: 'fgMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD20', headerText: 'ftAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD21', headerText: 'ftMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD22', headerText: 'ThreeAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD23', headerText: 'ThreeMade', width: 130, textAlign: 'Right' },
            { field: 'FIELD24', headerText: 'PostGP', width: 120, textAlign: 'Right' },
            { field: 'FIELD25', headerText: 'PostGS', width: 120, textAlign: 'Right' },
            { field: 'FIELD26', headerText: 'PostMinutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD27', headerText: 'PostPoints', width: 130, textAlign: 'Right' },
            { field: 'FIELD28', headerText: 'PostoRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD29', headerText: 'PostdRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD30', headerText: 'PostRebounds', width: 130, textAlign: 'Right' }],
            treeColumnIndex: 1
        },
        done
      );
    });
    it('rendering test', (done: Function) => {
        expect(treegrid.getRows().length).toBe(20);
        done();
    });
    it('collapseAll after scroll', (done: Function) => {
        let rows: HTMLTableRowElement[] = treegrid.getRows();
        let content: HTMLElement = (<HTMLElement>treegrid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 20000;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 1000);
        let len: number = 0;
        collapsed = (args?: any) => {
            let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
        }
        treegrid.collapseAll();
        expect(treegrid.getCurrentViewRecords().length > 0).toBe(true);
        done();
    }) 
    afterAll(() => {
      destroy(treegrid);
    });
  });
  describe('Height 100%', () => {
    let treegrid: TreeGrid;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    let dataBound: () => void;
    document.body.style.height = '600px';
    beforeAll((done: Function) => {
        treegrid = createGrid(
            {
              dataSource: virtualData.slice(0,1000),
              parentIdMapping: 'ParentID',
              idMapping: 'TaskID',
              height: '100%',
              enableVirtualization: true,
            columns: [{ field: 'FIELD1', headerText: 'Player Name', width: 140 },
            { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
            { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
            { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
            { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
            { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
            { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
            { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' },
            { field: 'FIELD10', headerText: 'oRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD11', headerText: 'dRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD12', headerText: 'Rebounds', width: 120, textAlign: 'Right' },
            { field: 'FIELD13', headerText: 'Assists', width: 120, textAlign: 'Right' },
            { field: 'FIELD14', headerText: 'Steals', width: 120, textAlign: 'Right' },
            { field: 'FIELD15', headerText: 'Blocks', width: 120, textAlign: 'Right' },
            { field: 'FIELD16', headerText: 'Turnovers', width: 130, textAlign: 'Right' },
            { field: 'FIELD17', headerText: 'PF', width: 130, textAlign: 'Right' },
            { field: 'FIELD18', headerText: 'fgAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD19', headerText: 'fgMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD20', headerText: 'ftAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD21', headerText: 'ftMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD22', headerText: 'ThreeAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD23', headerText: 'ThreeMade', width: 130, textAlign: 'Right' },
            { field: 'FIELD24', headerText: 'PostGP', width: 120, textAlign: 'Right' },
            { field: 'FIELD25', headerText: 'PostGS', width: 120, textAlign: 'Right' },
            { field: 'FIELD26', headerText: 'PostMinutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD27', headerText: 'PostPoints', width: 130, textAlign: 'Right' },
            { field: 'FIELD28', headerText: 'PostoRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD29', headerText: 'PostdRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD30', headerText: 'PostRebounds', width: 130, textAlign: 'Right' }],
            treeColumnIndex: 1
        },
        done
      );
    });
    it('rendering test', () => {
        dataBound = (args?: any) => {
           expect(treegrid.getRows().length > 12).toBe(true);
        }
    });
    afterAll(() => {
      destroy(treegrid);
    });
  });


  describe('Row Editing with Virtual Scrolling', () => {
    let gridObj: TreeGrid;
    let rowIndex: number;
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Add','Edit','Update','Delete','Cancel'],               
                editSettings:{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row', newRowPosition: 'Below' },
                childMapping: 'Crew',
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Rendering Test', (done: Function) => {
        expect(gridObj.getRows().length > 12).toBe(true);
        done();
    })
    
    it('Edit Start in Current View Records', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'beginEdit') {                
                expect(gridObj.grid.element.querySelectorAll('.e-editedrow').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);
                let cells = gridObj.grid.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                expect(cells.length).toBe(gridObj.grid.columns.length);
                //primary key check
                expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                // allow Editing false
                expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                //focus check
                expect(document.activeElement.id).toBe(gridObj.grid.element.id + 'FIELD1');
                //toolbar status check
                expect(gridObj.grid.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.grid.isEdit).toBeTruthy();                
                done();
            }            
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'beginEdit') {
                expect(gridObj.grid.isEdit).toBeFalsy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        gridObj.grid.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    });

    it('Edit Complete in Current View Records', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(0);
                //updatated data cehck
                expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe('updated');
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.isEdit).toBeTruthy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        (select('#' + gridObj.grid.element.id + 'FIELD1', gridObj.grid.element) as any).value = 'updated';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });

    it('Scroll', (done: Function) => {
        (<HTMLElement>gridObj.grid.getContent().firstChild).scrollTop = 1480;
        setTimeout(done, 400);
    });    

    it('Edit Start After Scroll', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'beginEdit') {                
                expect(gridObj.grid.element.querySelectorAll('.e-editedrow').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);
                let cells = gridObj.grid.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                expect(cells.length).toBe(gridObj.grid.columns.length);
                //primary key check
                expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                // allow Editing false
                expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                //focus check
                expect(document.activeElement.id).toBe(gridObj.grid.element.id + 'FIELD1');
                //toolbar status check
                expect(gridObj.grid.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.grid.isEdit).toBeTruthy();                
                done();
            }            
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'beginEdit') {
                expect(gridObj.grid.isEdit).toBeFalsy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        rowIndex = parseInt(gridObj.getRows()[0].getAttribute('aria-rowindex'), 10);
        gridObj.grid.selectRow(rowIndex);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    });

    it('Edit Complete After Scroll', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(0);
                //updatated data cehck
                expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe('scroll updated');
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.isEdit).toBeTruthy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        (select('#' + gridObj.grid.element.id + 'FIELD1', gridObj.grid.element) as any).value = 'scroll updated';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });


    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Add New Row with Virtual Scrolling', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Add','Edit','Update','Delete','Cancel'],               
                editSettings:{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row'},
                childMapping: 'Crew',
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Rendering Test', (done: Function) => {
        expect(gridObj.getRows().length > 12).toBe(true);
        done();
    })
    
    it('Add New Row Begin', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'add') {                
                expect(gridObj.grid.element.querySelectorAll('.e-addedrow').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);                
                expect(document.activeElement.id).toBe(gridObj.grid.element.id + 'TaskID');
                //toolbar status check
                expect(gridObj.grid.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.grid.isEdit).toBeTruthy();                
                done();
            }            
        };        
        gridObj.grid.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });

    it('Save New Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(0);
                //updatated data cehck
                expect((gridObj.grid.currentViewData[0] as any).TaskID).toBe(98765);
                expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe('New Row');
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.isEdit).toBeTruthy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        (select('#' + gridObj.grid.element.id + 'TaskID', gridObj.grid.element) as any).value = '98765';
        (select('#' + gridObj.grid.element.id + 'FIELD1', gridObj.grid.element) as any).value = 'New Row';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });  


  describe('Delete Row with Virtual Scrolling', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Add','Edit','Update','Delete','Cancel'],               
                editSettings:{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row'},
                childMapping: 'Crew',
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Rendering Test', (done: Function) => {
        expect(gridObj.getRows().length > 12).toBe(true);
        done();
    })
    
    it('Delete First Parent Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'delete') {                
               expect((gridObj.grid.dataSource as any).length === 995).toBe(true);
               done();
            }            
        };        
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });

    it('Scroll', (done: Function) => {
        (<HTMLElement>gridObj.grid.getContent().firstChild).scrollTop = 4000;
        setTimeout(done, 400);
    });    

    it('Delete Row after Scroll', (done: Function) => {
        let isParent: boolean;
        let row: Element;
        actionComplete = (args?: any): void => {
            if (args.requestType === 'delete') {         
                if (isParent) {
                    expect((gridObj.grid.dataSource as any).length === 990).toBe(true);
                } else {
                    expect((gridObj.grid.dataSource as any).length === 994).toBe(true);
                }                
                done();
            }
        };        
        gridObj.grid.actionComplete = actionComplete;
        row = gridObj.getRows()[0];
        if(row.querySelector('.e-treegridexpand')){
            isParent = true;
        }
        gridObj.selectRow(parseInt(row.getAttribute('aria-rowindex'), 10));
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Edit Cancel Checking', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Add','Edit','Update','Delete','Cancel'],               
                editSettings:{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row'},
                childMapping: 'Crew',
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Rendering Test', (done: Function) => {
        expect(gridObj.getRows().length > 12).toBe(true);
        done();
    })
    
    it('Edit Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'beginEdit') {                
                expect(gridObj.grid.element.querySelectorAll('.e-editedrow').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);
                done();
            }            
        };        
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    });       

    it('Cancel Edit', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'cancel') {
                //form destroy check
                expect(gridObj.grid.editModule.formObj.isDestroyed).toBeTruthy();
                expect(gridObj.grid.isEdit).toBeFalsy();
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'cancel') {
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);
                expect(gridObj.grid.isEdit).toBeTruthy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
    });

    afterAll(() => {
      gridObj.grid.contentModule.removeEventListener();
      destroy(gridObj);
    });
  });


  describe('EJ2-58929 - Searching after scroll shows no records to display in case of Virtualization enabled', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: {
                  mode: 'Immediate',
                  type: 'FilterBar',
                  hierarchyMode: 'None',
                },
                toolbar: ['Search'],
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Scroll', (done: Function) => {
        let content: HTMLElement = (<HTMLElement>gridObj.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 20000;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 1000);
        done();
    });    

    it('Searching after Scroll', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.getRows().length == 1).toBe(true);
            done();
        }
        gridObj.search("496");
        gridObj.grid.actionComplete = actionComplete;
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });


});