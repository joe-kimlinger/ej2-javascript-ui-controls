/**
 * Stacked header render spec
 */
import { EmitType, Draggable  } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Freeze } from '../../../src/grid/actions/freeze';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Group } from '../../../src/grid/actions/group';
import { HeaderRender } from '../../../src/grid/renderer/header-renderer';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Reorder, Freeze, Group);

describe('Stacked header render module', () => {
    describe('Stacked header render', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    allowGrouping: true,
                    columns: [
                        {
                            headerText: 'Order Details', toolTip: 'Order Details', textAlign: 'Center',
                            columns: [{ field: 'OrderID', textAlign: 'Right', headerText: 'Order ID' },
                            { field: 'OrderDate', textAlign: 'Right', headerText: 'Order Date', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }]
                        },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                        { field: 'EmployeeID', textAlign: 'Right', headerText: 'Employee ID' },
                        {
                            headerText: 'Ship Details',
                            headerTemplate: '<span>${headerText}</span>',
                            columns: [
                                { field: 'ShipCity', headerText: 'Ship City' },
                                { field: 'ShipCountry', headerText: 'Ship Country' },
                                {
                                    headerText: 'Ship Name Verified', columns: [
                                        { field: 'ShipName', headerText: 'Ship Name' },
                                        { field: 'ShipRegion', headerText: 'Ship Region', visible: false },
                                        { field: 'Verified', headerText: 'Verified' }]
                                },
                            ],
                        },
                        {
                            headerText: 'Hidden', toolTip: 'Hidden', textAlign: 'Center',
                            columns: [{ field: 'HiddenCol', textAlign: 'Right', headerText: 'Hidden Column', visible: false }]
                        },
                    ],
                    allowReordering: true
                }, done);
        });

        it('header colunt testing', () => {
            let trs = gridObj.getHeaderContent().querySelectorAll('tr');
            expect(trs[0].querySelectorAll('.e-headercell').length).toBe(4);
            expect(trs[0].querySelectorAll('.e-stackedheadercell').length).toBe(2);
            expect(trs[1].querySelectorAll('.e-headercell').length).toBe(6);
            expect(trs[1].querySelectorAll('.e-stackedheadercell').length).toBe(1);
            expect(trs[2].querySelectorAll('.e-headercell').length).toBe(3);
            expect(trs[2].querySelectorAll('.e-stackedheadercell').length).toBe(0);

            //for coverage
            gridObj.reorderColumns('ShipCountry', 'Ship Details');
            gridObj.reorderColumns('ShipCountry', 'ShipCity');
        });

        it('EJ2-7378- script error on stacked header dragging', () => {
            let trs: NodeListOf<HTMLTableRowElement> = gridObj.getHeaderContent().querySelectorAll('tr');
            let header: HeaderRender = new HeaderRender(gridObj, gridObj.serviceLocator);
            header.draggable = new Draggable(gridObj.getHeaderContent() as HTMLElement,{});
            header.draggable.currentStateTarget = trs[0].querySelectorAll('.e-stackedheadercell')[0];
            expect((<any>header).helper({sender: {target: trs[0].querySelectorAll('.e-stackedheadercell')[0]}})).not.toBeFalsy();
        });

        it('EJ2-7378- script error on stacked header dragging', () => {
            gridObj.allowReordering = false;
            gridObj.dataBind();
            let trs: NodeListOf<HTMLTableRowElement> = gridObj.getHeaderContent().querySelectorAll('tr');
            let header: HeaderRender = new HeaderRender(gridObj, gridObj.serviceLocator);
            header.draggable = new Draggable(gridObj.getHeaderContent() as HTMLElement,{});
            header.draggable.currentStateTarget = trs[0].querySelectorAll('.e-stackedheadercell')[0];
            expect((<any>header).helper({sender: {target: trs[0].querySelectorAll('.e-stackedheadercell')[0]}})).toBeFalsy();
        });


        afterAll(() => {
            destroy(gridObj);
        });

    });

    describe('Stacked header render with Freeze', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenColumns: 1,
                    frozenRows: 2,
                    columns: [
                        {
                            headerText: 'Order Details', toolTip: 'Order Details', textAlign: 'Center',
                            columns: [{ field: 'OrderID', width: 120, textAlign: 'Right', headerText: 'Order ID' },
                            {
                                field: 'OrderDate', width: 120, textAlign: 'Right', headerText: 'Order Date',
                                format: { skeleton: 'yMd', type: 'date' }, type: 'date'
                            }]
                        },
                        { field: 'CustomerID', width: 120, headerText: 'Customer ID' },
                        { field: 'EmployeeID', width: 120, textAlign: 'Right', headerText: 'Employee ID' },
                        {
                            headerText: 'Ship Details',
                            columns: [
                                { field: 'ShipCity', width: 120, headerText: 'Ship City' },
                                { field: 'ShipCountry', width: 120, headerText: 'Ship Country' },
                                {
                                    headerText: 'Ship Name Verified', columns: [
                                        { field: 'ShipName', width: 120, headerText: 'Ship Name' },
                                        { field: 'ShipRegion', width: 120, headerText: 'Ship Region', visible: false },
                                        { field: 'Verified', width: 120, headerText: 'Verified' }]
                                },
                            ],
                        }
                    ],
                    allowReordering: true
                }, done);
        });

        it('header count testing', () => {
            let trs: any = gridObj.getHeaderContent().querySelectorAll('tr');
            expect(trs[0].querySelectorAll('.e-headercell').length).toBe(1);
            expect(trs[0].querySelectorAll('.e-stackedheadercell').length).toBe(1);
            expect(trs[1].querySelectorAll('.e-headercell').length).toBe(1);
            expect(trs[1].querySelectorAll('.e-stackedheadercell').length).toBe(0);
            expect(trs[2].querySelectorAll('.e-headercell').length).toBe(0);
            expect(trs[2].querySelectorAll('.e-stackedheadercell').length).toBe(0);
            expect(trs[5].querySelectorAll('.e-headercell').length).toBe(4);
            expect(trs[5].querySelectorAll('.e-stackedheadercell').length).toBe(2);
            expect(trs[6].querySelectorAll('.e-headercell').length).toBe(4);
            expect(trs[6].querySelectorAll('.e-stackedheadercell').length).toBe(1);
            expect(trs[7].querySelectorAll('.e-headercell').length).toBe(3);
            expect(trs[7].querySelectorAll('.e-stackedheadercell').length).toBe(0);
            let pTxt: string = trs[6].querySelector('.e-headercell').innerText;
            gridObj.reorderColumns('OrderID', 'OrderDate');
            trs = gridObj.getHeaderContent().querySelectorAll('tr');
            expect(trs[1].querySelector('.e-headercell').innerText.trim()).toBe(pTxt.trim());
        });
        it('memory leak', () => {     
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });   

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-52799 - Script error throws while adding the stacked columns dynamically', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    allowResizing: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, minWidth: 10 },
                        {
                            headerText: 'Order Details', columns: [
                                { field: 'OrderDate', headerText: 'Order Date', textAlign: 'Right', width: 135, format: 'yMd', minWidth: 10 },
                                { field: 'Freight', headerText: 'Freight($)', textAlign: 'Right', width: 120, format: 'C2', minWidth: 10 },
                            ]
                        },
                        {
                            headerText: 'Ship Details', columns: [
                                { field: 'ShipCity', width: 120, headerText: 'Ship City' },
                                { field: 'ShipCountry', headerText: 'Ship Country', width: 140, minWidth: 10 },
                            ]
                        }
                    ]
                }, done);
        });
        it('add the stacked columns dynamically', () => {
            (gridObj.columns[1] as any).columns.push({field: 'CustomerID', headerText: 'Test column', width: 150});
            gridObj.refreshColumns();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-55362 - Borderline is not applied properly on the stacked column', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    allowResizing: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, minWidth: 10,},
                        { headerText: 'Orders',
                            columns: [
                                { headerText: 'Order Details',
                                    columns: [
                                      { field: 'CustomerID', headerText: 'Customer Id', width: 130, textAlign: 'Right',minWidth: 10 },
                                      { field: 'OrderDate', headerText: 'Order Date', format: 'yMd', width: 130, textAlign: 'Right', minWidth: 10 },
                                      { field: 'Freight', headerText: 'Freight ($)', width: 120, format: 'C1', textAlign: 'Right', minWidth: 10,},
                                      { field: 'ShippedDate', headerText: 'Shipped Date', format: 'yMd', textAlign: 'Right', width: 150, minWidth: 10 },
                                      { field: 'ShipCity', headerText: 'Ship City', width: 120, minWidth: 10 },
                                    ]
                                  },
                                  { headerText: 'Ship Details',
                                    columns: [
                                      { field: 'ShipCountry', headerText: 'Ship Country', width: 150, minWidth: 10 }
                                    ]
                                  }
                            ]
                        }
                    ]
                }, done);
        });
        it('Check stacked first cell border classname ', () => {
            let trs: any = gridObj.getHeaderContent().querySelectorAll('tr');
            expect(trs[1].children[0].classList.contains('e-firstcell')).toBeTruthy();
            expect(trs[2].children[5].classList.contains('e-laststackcell')).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });


});