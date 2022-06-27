import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, SortEventArgs, SortDescriptor, getCell, DialogBeforeOpenEventArgs, SheetModel } from '../../../src/index';

Spreadsheet.Inject(BasicModule);

/**
 *  Sorting test cases
 */
describe('Spreadsheet sorting module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('UI interaction checking ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
                    }
                ],
                created: (): void => {
                    helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                }
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('sort ascending testing', (done: Function) => {
            helper.invoke('cellFormat', [{ border: '1px solid #000' }, 'D3']);
            helper.invoke('selectRange', ['D2:E5']);
            helper.setModel('activeCell', 'D2');
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D2').value.toString()).toEqual('10');
                    expect(values.get('E2').value.toString()).toEqual('20');
                    expect(values.get('D3').value.toString()).toEqual('15');
                    expect(values.get('E3').value.toString()).toEqual('20');
                    expect(values.get('D4').value.toString()).toEqual('20');
                    expect(values.get('E4').value.toString()).toEqual('30');
                    expect(values.size).toEqual(8);
                    // Checking for border should not be sorted
                    expect(JSON.stringify(values.get('D3').style)).toBe('{"borderBottom":"1px solid #000","borderTop":"1px solid #000","borderRight":"1px solid #000","borderLeft":"1px solid #000"}');
                    expect(JSON.stringify(values.get('D4').style)).toBe('{}');
                    let td: HTMLElement = helper.invoke('getCell', [2, 3]);
                    expect(td.style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                    expect(td.style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                    expect(helper.invoke('getCell', [2, 2]).style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                    expect(helper.invoke('getCell', [1, 3]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                    td = helper.invoke('getCell', [3, 3]);
                    expect(td.style.borderRight).toBe('');
                    expect(td.style.borderBottom).toBe('');
                    expect(helper.invoke('getCell', [3, 2]).style.borderRight).toBe('');
                    done();
                });
            });
        });

        // it('sort undo testing', (done: Function) => {
        //     helper.invoke('undo', null);
        //     expect(getCell(1, 3, instance.getActiveSheet()).value.toString()).toEqual('10');
        //     expect(getCell(1, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(2, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(2, 4, instance.getActiveSheet()).value.toString()).toEqual('30');
        //     expect(getCell(3, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
        //     expect(getCell(3, 4, instance.getActiveSheet()).value.toString()).toEqual('15');
        //     done();
        // });

        it('sort redo testing', (done: Function) => {
            const instance: Spreadsheet = helper.getInstance();
            helper.invoke('redo', null);
            setTimeout(() => {
                expect(getCell(1, 3, instance.getActiveSheet()).value.toString()).toEqual('10');
                expect(getCell(1, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
                expect(getCell(2, 3, instance.getActiveSheet()).value.toString()).toEqual('15');
                expect(getCell(2, 4, instance.getActiveSheet()).value.toString()).toEqual('20');
                expect(getCell(3, 3, instance.getActiveSheet()).value.toString()).toEqual('20');
                expect(getCell(3, 4, instance.getActiveSheet()).value.toString()).toEqual('30');
                done();
            }, 10);
        });

        it('sort descending testing', (done: Function) => {
            helper.invoke('selectRange', ['D2:E5']);
            helper.setModel('activeCell', 'D2');
            helper.invoke('sort', [{ sortDescriptors: { order: 'Descending' } }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D2').value.toString()).toEqual('20');
                    expect(values.get('E2').value.toString()).toEqual('30');
                    expect(values.get('D3').value.toString()).toEqual('20');
                    expect(values.get('E3').value.toString()).toEqual('15');
                    expect(values.get('D4').value.toString()).toEqual('15');
                    expect(values.get('E4').value.toString()).toEqual('20');
                    expect(values.size).toEqual(8);
                    done();
                });
            });
        });

        it('sort auto containsHeader testing', (done: Function) => {
            helper.invoke('selectRange', ['D1:E5']);
            helper.setModel('activeCell', 'D1');
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('D1')).toBeUndefined(); //Quantity - skipped
                    expect(values.get('E1')).toBeUndefined(); // Price - skipped
                    expect(values.get('D2').value.toString()).toEqual('10');
                    expect(values.get('E2').value.toString()).toEqual('20');
                    expect(values.get('D3').value.toString()).toEqual('15');
                    expect(values.get('E3').value.toString()).toEqual('20');
                    expect(values.get('D4').value.toString()).toEqual('20');
                    expect(values.get('E4').value.toString()).toEqual('30');
                    expect(values.size).toEqual(8);
                    done();
                });
            });
        });

        it('automatic sort range testing', (done: Function) => {
            helper.invoke('selectRange', ['A1:A1']); //no selection
            helper.invoke('sort', null).then((args: SortEventArgs) => {
                expect(args.range).toEqual('Sheet1!A2:H11'); //excluding header
                done();
            });
        });

        it('catch invalid sort range error testing', (done: Function) => {
            helper.invoke('selectRange', ['K2:M5']);
            helper.invoke('sort', null).catch((error: string) => {
                expect(error).toEqual('Select a cell or range inside the used range and try again.');
                done();
            });
        });

        it('custom sort testing', (done: Function) => {
            helper.invoke('selectRange', ['D1:E11']);
            //Price - ascending, Quantity - descending
            let sortDescriptors: SortDescriptor[] = [
                {
                    field: 'E',
                    order: 'Ascending'
                },
                {
                    field: 'D',
                    order: 'Descending'
                }
            ];
            helper.invoke('sort', [{ sortDescriptors: sortDescriptors }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    expect(values.get('E2').value.toString()).toEqual('10');
                    expect(values.get('E3').value.toString()).toEqual('10');
                    expect(values.get('E4').value.toString()).toEqual('10');
                    expect(values.get('E5').value.toString()).toEqual('10');
                    expect(values.get('D2').value.toString()).toEqual('50');
                    expect(values.get('D3').value.toString()).toEqual('31');
                    expect(values.get('D4').value.toString()).toEqual('30');
                    expect(values.get('D5').value.toString()).toEqual('20');
                    expect(values.size).toEqual(20);
                    done();
                });
            });
        });

        it('case sensitive sort testing', (done: Function) => {
            let td: HTMLTableCellElement = helper.invoke('getCell', [4, 0]);
            let cellValue: string = td.textContent;
            helper.invoke('updateCell', [{ value: cellValue.toLowerCase() }, 'A7']);
            helper.invoke('selectRange', ['A2:B7']);
            helper.setModel('activeCell', 'A2');
            helper.invoke('sort', [{ caseSensitive: true }]).then((args: SortEventArgs) => {
                helper.invoke('getData', [args.range]).then((values: Map<string, CellModel>) => {
                    // expect(values.get('A5').value.toString()).toEqual(cellValue.toLowerCase());//lowercase first Check this now
                    // expect(values.get('A6').value.toString()).toEqual(cellValue);//uppercase next
                    // expect(values.size).toEqual(12);
                    done();
                });
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I311230, I311230, I309407, I300737, I315895 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{
                        rows: [{ cells: [{ index: 1, value: 'Amount' }] }, { cells: [{ index: 1, value: 2 }] },
                        { cells: [{ index: 1, value: 3 }] }, { cells: [{ index: 1, value: 5 }] }, { cells: [{ index: 1, value: 11 }] },
                        { cells: [{ index: 1, value: 7 }] }, { cells: [{ index: 1, value: 6 }] }, { cells: [{ index: 1, value: 4 }] }]
                    }],
                    created: (): void => {
                        helper.getInstance().hideColumn(0, 10, false);
                    }
                } as any;
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Try to filter an unsorted number list', (done: Function) => {
                helper.invoke('numberFormat', ['_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-', 'B1:B8']);
                const inst: Spreadsheet = helper.getInstance();
                expect(inst.sheets[0].rows[1].cells[1].format).toEqual('_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-');
                expect(helper.invoke('getCell', [1, 1]).textContent).toEqual('2.00');
                helper.invoke('selectRange', ['B1:B8']);
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + '_sorting').click();
                    helper.getElement('#' + helper.id + '_applyfilter').click();
                    expect(!!helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                    helper.invoke('selectRange', ['B1']);
                    let filterCell: HTMLElement = helper.invoke('getCell', [0, 1]).querySelector('.e-filter-icon');
                    helper.triggerMouseAction(
                        'mousedown', { x: filterCell.getBoundingClientRect().left + 1, y: filterCell.getBoundingClientRect().top + 1 },
                        null, filterCell);
                    filterCell = helper.invoke('getCell', [0, 1]);
                    helper.triggerMouseAction(
                        'mouseup', { x: filterCell.getBoundingClientRect().left + 1, y: filterCell.getBoundingClientRect().top + 1 },
                        document, filterCell);
                    setTimeout((): void => {
                        const sortAsc: HTMLElement = helper.getElement('.e-excelfilter .e-filter-sortasc');
                        helper.triggerMouseAction(
                            'mousedown', { x: sortAsc.getBoundingClientRect().left + 1, y: sortAsc.getBoundingClientRect().top + 1 },
                            null, sortAsc);
                        setTimeout((): void => {
                            expect(inst.sheets[0].rows[3].cells[1].value.toString()).toEqual('4');
                            expect(helper.invoke('getCell', [3, 1]).textContent).toEqual('4.00');
                            expect(inst.sheets[0].rows[4].cells[1].value.toString()).toEqual('5');
                            expect(helper.invoke('getCell', [4, 1]).textContent).toEqual('5.00');
                            expect(inst.sheets[0].rows[5].cells[1].value.toString()).toEqual('6');
                            expect(helper.invoke('getCell', [5, 1]).textContent).toEqual('6.00');
                            expect(inst.sheets[0].rows[6].cells[1].value.toString()).toEqual('7');
                            expect(helper.invoke('getCell', [6, 1]).textContent).toEqual('7.00');
                            expect(inst.sheets[0].rows[7].cells[1].value.toString()).toEqual('11');
                            expect(helper.invoke('getCell', [7, 1]).textContent).toEqual('11.00');
                            done();
                        }, 10);
                    }, 10);
                });
            });
            it('cut and paste the filtered list', (done: Function) => {
                helper.invoke('selectRange', ['B1:B8']);
                setTimeout(() => {
                    helper.invoke('cut').then((): void => {
                        helper.invoke('paste', ['D1']);
                        setTimeout((): void => {
                            // need to remove this once the filter with cut/paste action is properly handled as like excel
                            //expect(!!helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).toBeFalsy();
                            //expect(!!helper.invoke('getCell', [0, 3]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                            const inst: Spreadsheet = helper.getInstance();
                            expect(inst.sheets[0].rows[1].cells[1]).toBeNull();
                            expect(helper.invoke('getCell', [1, 1]).textContent).toEqual('');
                            expect(inst.sheets[0].rows[7].cells[1]).toBeNull();
                            expect(helper.invoke('getCell', [7, 1]).textContent).toEqual('');
                            expect(inst.sheets[0].rows[1].cells[3].value.toString()).toEqual('2');
                            expect(helper.invoke('getCell', [1, 3]).textContent).toEqual('2.00');
                            expect(inst.sheets[0].rows[7].cells[3].value.toString()).toEqual('11');
                            expect(helper.invoke('getCell', [7, 3]).textContent).toEqual('11.00');
                            done();
                        });
                    }, 10);
                });
            });

            it('copy the list and paste the list starting from row 2', (done: Function) => {
                helper.invoke('copy').then(() => {
                    helper.invoke('selectRange', ['D2']);
                    setTimeout((): void => {
                        helper.invoke('paste', ['D2']);
                        setTimeout((): void => {
                            const inst: Spreadsheet = helper.getInstance();
                            expect(inst.sheets[0].rows[1].cells[3].value.toString()).toEqual('Amount');
                            expect(helper.invoke('getCell', [1, 3]).textContent).toEqual('Amount');
                            expect(inst.sheets[0].rows[8].cells[3].value.toString()).toEqual('11');
                            expect(helper.invoke('getCell', [8, 3]).textContent).toEqual('11.00');
                            done();
                        }, 10);
                    });
                });
            });
        });

        describe('I309407, I301769 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('sort ascending on a column, the data gets vanished', (done: Function) => {
                const td: HTMLElement = (helper.getElement('.e-colhdr-table') as HTMLTableElement).tHead.rows[0].cells[3];
                helper.triggerMouseAction(
                    'mousedown', { x: td.getBoundingClientRect().left + 20, y: td.getBoundingClientRect().top + 10 },
                    null, td);
                helper.triggerMouseAction(
                    'mouseup', { x: td.getBoundingClientRect().left + 20, y: td.getBoundingClientRect().top + 10 },
                    document, td);
                setTimeout((): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toEqual('20');
                    expect(spreadsheet.sheets[0].rows[6].cells[3].value.toString()).toEqual('40');
                    expect(spreadsheet.sheets[0].rows[7].cells[3].value.toString()).toEqual('20');
                    expect(spreadsheet.sheets[0].rows[8].cells[3].value.toString()).toEqual('31');
                    helper.getElement('#' + helper.id + '_sorting').click();
                    helper.getElement('#' + helper.id + '_sorting-popup').querySelector('.e-item').click();
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[0].cells[3].value.toString()).toEqual('Quantity');
                        expect(spreadsheet.sheets[0].rows[2].cells[3].value.toString()).toEqual('15');
                        expect(spreadsheet.sheets[0].rows[6].cells[3].value.toString()).toEqual('30');
                        expect(spreadsheet.sheets[0].rows[7].cells[3].value.toString()).toEqual('31');
                        expect(spreadsheet.sheets[0].rows[8].cells[3].value.toString()).toEqual('40');
                        done();
                    }, 10);
                }, 10);
            });
        });

        describe('SF-360222 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    beforeDataBound: () => {
                        helper.invoke('cellFormat', [{ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1']);
                    }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });

            it('sorting whole column, header cell too get sorted and undo after sorting changes selection range', (done: Function) => {
                helper.invoke('selectRange', ['A1:A200']);
                helper.click('#spreadsheet_sorting');
                helper.click('#spreadsheet_sorting-popup .e-item:nth-child(2)');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('T-Shirts');
                        helper.click('#spreadsheet_undo');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A200');
                        expect(helper.invoke('getCell', [0, 0]).textContent).toBe('Item Name');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                        helper.click('#spreadsheet_sorting');
                        helper.click('#spreadsheet_sorting-popup .e-item');
                        setTimeout(() => {
                            setTimeout(() => {
                                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('Casual Shoes');
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('EJ2-56060 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Multirange custom sort alert dialog not showing issue resolved.', (done: Function) => {
                helper.invoke('selectRange', ['A1:A100 B1:B100']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                let dialogName: string;
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    dialogName = args.dialogName;
                };
                helper.getElementFromSpreadsheet('#' + helper.id + '_sorting').click();
                setTimeout(() => {
                    helper.click('.e-sort-filter-ddb li:nth-child(3)');  
                });
                setTimeout(() => {
                    expect(dialogName).toBe('MultiRangeSortDialog');
                    done();
                });
            });
            it('customsort alert not showing while apply customsort on empty sheet', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertSheet();
                helper.invoke('selectRange', ['A1']);
                let dialogName: string;
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    dialogName = args.dialogName;
                };
                helper.getElementFromSpreadsheet('#' + helper.id + '_sorting').click();
                setTimeout(() => {
                    helper.click('.e-sort-filter-ddb li:nth-child(3)');  
                });
                setTimeout(() => {
                    expect(dialogName).toBe('SortRangeDialog');
                    done();
                });
            });
            it('Custom sort while A1 only has value', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertSheet();
                helper.invoke('selectRange', ['A1']);
                let dialogName: string;
                spreadsheet.updateCell({value: '10'},"A1");
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    dialogName = args.dialogName;
                };
                helper.getElementFromSpreadsheet('#' + helper.id + '_sorting').click();
                setTimeout(() => {
                    helper.click('.e-sort-filter-ddb li:nth-child(3)');  
                });
                setTimeout(() => {
                    expect(dialogName).toBe('CustomSortDialog');
                    done();
                });
            });
        });
    });
});