import { Spreadsheet, SpreadsheetModel, CellSaveEventArgs, RowModel, SheetModel, getCell } from '../../../src/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { createElement } from '@syncfusion/ej2-base';

/**
 *  Clipboard test cases
 */
describe('Clipboard ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('UI Interaction ->', () => {
        describe('', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Copy pasting cells with increased font size does not increase row height', (done: Function) => {
                helper.invoke('cellFormat', [{ fontSize: '20pt' }, 'A2:B4']);
                helper.invoke('copy', ['A2:B4']).then(() => {
                    helper.invoke('paste', ['D5']);
                    expect(helper.invoke('getRow', [4]).style.height).toBe('35px');
                    expect(helper.invoke('getRow', [5]).style.height).toBe('35px');
                    expect(helper.invoke('getRow', [6]).style.height).toBe('35px');
                    const sheet: SheetModel = helper.invoke('getActiveSheet');
                    expect(sheet.rows[4].height).toBe(35);
                    expect(sheet.rows[5].height).toBe(35);
                    expect(sheet.rows[6].height).toBe(35);
                    expect(getCell(4, 3, sheet).style.fontSize).toBe('20pt');
                    expect(getCell(5, 4, sheet).style.fontSize).toBe('20pt');
                    expect(getCell(6, 3, sheet).style.fontSize).toBe('20pt');
                    done();
                });
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('F163240, FB23869, EJ2-59226 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                    }
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Paste behaviour erroneous after cut', (done: Function) => {
                helper.invoke('selectRange', ['A1:D5']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toEqual('Item Name');
                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toEqual('15');
                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toEqual('Formal Shoes');
                expect(spreadsheet.sheets[0].rows[2].cells[2].value).toEqual('0.2475925925925926');
                setTimeout((): void => {
                    helper.invoke('cut').then((): void => {
                        helper.invoke('selectRange', ['A2']);
                        setTimeout((): void => {
                            helper.invoke('paste', ['Sheet1!A2:A2']);
                            setTimeout((): void => {
                                expect(spreadsheet.sheets[0].rows[0].cells[0]).toBeNull();
                                expect(helper.invoke('getCell', [0, 0]).textContent).toEqual('');
                                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toEqual('20');
                                expect(helper.invoke('getCell', [4, 3]).textContent).toEqual('20');
                                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toEqual('Sports Shoes');
                                expect(helper.invoke('getCell', [3, 0]).textContent).toEqual('Sports Shoes');
                                expect(spreadsheet.sheets[0].rows[2].cells[2].value.toString()).toEqual('0.4823148148148148');
                                done();
                            });
                        });
                    });
                });
            });

            it('Paste values only for formula is not working', (done: Function) => {
                helper.edit('I1', '=SUM(F2:F8)');
                helper.invoke('copy', ['I1']).then(() => {
                    helper.invoke('paste', ['I2', 'Values']);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 8]).textContent).toBe('2700');
                        expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toBeUndefined();
                        done();
                    });
                });
            });

            it('When we copy the values with empty cell, it pasted to additional range with new values', (done: Function) => {
                helper.edit('H3', '=SUM(F3:G3)');
                helper.invoke('copy', ['H3:I3']).then(() => {
                    helper.invoke('paste', ['I3']);
                    expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toEqual('');
                    expect(helper.invoke('getCell', [2, 9]).textContent).toBe('');
                });
                helper.invoke('copy', ['G3:G3']).then(() => {
                    helper.invoke('paste', ['H3']);
                    expect(helper.getInstance().sheets[0].rows[2].cells[7].value).not.toEqual('');
                    expect(helper.invoke('getCell', [2, 7]).textContent).not.toBe('');
                    done();
                });
            });
        });
        describe('F162960 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        rows: [{ cells: [{ value: '100' }, { value: '25' }, { value: '1001' }] }, {
                            cells: [{ value: '100' },
                            { value: '25' }, { value: '1001' }]
                        }], selectedRange: 'A1:B2'
                    }],
                    created: (): void => helper.getInstance().setRowHeight(45)
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Row height not persistent after cut/paste', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].height).toEqual(45);
                expect(spreadsheet.sheets[0].rows[3]).toBeUndefined();
                helper.invoke('cut').then((): void => {
                    helper.invoke('selectRange', ['A4']);
                    setTimeout((): void => {
                        helper.invoke('paste', ['Sheet1!A4:A4']);
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[0].height).toEqual(45);
                            expect(helper.invoke('getRow', [0, 0]).style.height).toEqual('45px');
                            expect(spreadsheet.sheets[0].rows[3].cells[0].value.toString()).toEqual('100');
                            done();
                        });
                    });
                });
            });
        });
        describe('I299870, I298549, I296802 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: 'Value' }] }], selectedRange: 'A1' }],
                    cellSave: (): void => {
                        (helper.getInstance() as Spreadsheet).insertRow([{ index: 1, cells: [{ value: 'Added' }] }]);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Trigger the cellSave event for paste action and while insertRow inn actionComplete script error throws', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['A4']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[4].cells[0].value).toEqual('Value');
                            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toEqual('Added');
                            done();
                        });
                    });
                });
            });
        });
        describe('I301708 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ selectedRange: 'C2' }],
                    created: (): void => {
                        (helper.getInstance() as Spreadsheet).setBorder({ border: '1px solid #000' }, 'C2');
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Border copy paste issue (copy the border and paste it in adjacent cells, border removed)', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let dataSourceChangedFunction: () => void = jasmine.createSpy('dataSourceChanged');
                spreadsheet.dataSourceChanged = dataSourceChangedFunction;
                spreadsheet.dataBind();
                expect(helper.invoke('getCell', [1, 1]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [0, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 2]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['B2']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            //expect(dataSourceChangedFunction).toHaveBeenCalled();
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.border).toBeUndefined();
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderLeft).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderTop).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderRight).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderBottom).toEqual('1px solid #000');
                            expect(helper.invoke('getCell', [1, 0]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [0, 1]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 1]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 1]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 2]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            done();
                        });
                    });
                });
            });
        });

        describe('I329167, I328868 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        rows: [{ cells: [{ index: 5, value: '10' }, { value: '11' }, { value: '8' }] }, {
                            cells: [{
                                index: 5,
                                formula: '=IF(F1>10,"Pass","Fail")'
                            }, { index: 7, value: '10' }]
                        }, { cells: [{ index: 7, formula: '=SUM(H1:H2)' }] }],
                        selectedRange: 'F2'
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Copy Paste functions with Formula applied cells issue', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['G2']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[1].cells[5].formula).toEqual('=IF(F1>10,"Pass","Fail")');
                            expect(spreadsheet.sheets[0].rows[1].cells[6].value).toEqual('Pass');
                            expect(spreadsheet.sheets[0].rows[1].cells[6].formula).toEqual('=IF(G1>10,"Pass","Fail")');
                            helper.invoke('selectRange', ['H3']);
                            done();
                        });
                    });
                });
            });
            it('Copy a formula from one cell to another (onto multiple cells), it shows the correct result only for the final row', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['I3:I5']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[2].cells[8].formula).toEqual('=SUM(I1:I2)');
                            expect(spreadsheet.sheets[0].rows[3].cells[8].formula).toEqual('=SUM(I2:I3)');
                            expect(spreadsheet.sheets[0].rows[4].cells[8].formula).toEqual('=SUM(I3:I4)');
                            done();
                        });
                    });
                });
            });
        });
        describe('SF-358133 ->', () => {
            let count: number = 0;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ selectedRange: 'C2', ranges: [{ startCell: 'C1', dataSource: [{ 'start': '2/14/2014', 'end': '6/11/2014' }] }] }],
                    cellSave: (args: CellSaveEventArgs): void => {
                        count++;
                        if (count === 1) { // Pasted cell details
                            expect(args.address).toEqual('Sheet1!D2');
                            expect(args.value as any).toEqual(41684);
                            expect(args.oldValue).toEqual('6/11/2014');
                            expect(args.displayText).toEqual('2/14/2014');
                        }
                        if (count === 2) { // Cut cell details
                            expect(args.address).toEqual('Sheet1!C2');
                            expect(args.value).toEqual('');
                            expect(args.oldValue).toEqual('2/14/2014');
                            expect(args.displayText).toEqual('');
                        }
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cut / paste cell save event arguments are not proper', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[2].value).toEqual('41684');
                expect(helper.invoke('getDisplayText', [spreadsheet.sheets[0].rows[1].cells[2]])).toEqual('2/14/2014');
                expect(spreadsheet.sheets[0].rows[1].cells[3].value).toEqual('41801');
                expect(helper.invoke('getDisplayText', [spreadsheet.sheets[0].rows[1].cells[3]])).toEqual('6/11/2014');
                helper.invoke('cut').then((): void => {
                    helper.invoke('selectRange', ['D2']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[1].cells[2]).toBeNull();
                            expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toEqual(41684);
                            expect(helper.invoke('getDisplayText', [spreadsheet.sheets[0].rows[1].cells[3]])).toEqual('2/14/2014');
                            done();
                        });
                    });
                });
            });
        });

        // describe('SF-355018 ->', () => {
        //     beforeAll((done: Function) => {
        //         dataSource();
        //         model = {
        //             sheets: [{ ranges: [{ dataSource: virtualData.slice(0, 10000) }] }]
        //         };
        //         helper.initializeSpreadsheet(model, done);
        //     });
        //     afterAll(() => {
        //         helper.invoke('destroy');
        //     });
        //     it('Performance issue on pasting 10k cells', (done: Function) => {
        //         helper.invoke('selectRange', ['A1:A10001']);
        //         helper.invoke('copy').then(() => {
        //             helper.invoke('selectRange', ['B1']);
        //             let time: number = Date.now();
        //             helper.invoke('paste');
        //             setTimeout(() => {
        //                 expect(helper.invoke('getCell', [0, 1]).textContent).toBe('Name');
        //                 expect(Date.now() - time).toBeLessThan(4000);
        //                 time = Date.now();
        //                 helper.invoke('getCell', [1000000, 0]);
        //                 expect(Date.now() - time).toBeLessThan(10);
        //                 done();
        //             });
        //         });
        //     });
        // });

        describe('EJ2-56500 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Copy indicator size and position does not change after row height and column width changes', (done: Function) => {
                helper.invoke('copy', ['C4:E7']).then(() => {
                    setTimeout((): void => {
                        helper.invoke('setRowHeight', [50, 0]);
                        const elem: HTMLElement = helper.getElementFromSpreadsheet('.e-copy-indicator');
                        expect(elem.style.top).toBe('89px');
                        helper.invoke('setRowHeight', [50, 4]);
                        expect(elem.style.height).toBe('111px');
                        helper.invoke('setColWidth', [100, 0]);
                        expect(elem.style.left).toBe('163px');
                        helper.invoke('setColWidth', [100, 3]);
                        expect(elem.style.width).toBe('229px');
                        done();
                    });
                });
            });
            it('Copy paste the wrap cell changes height of the copy indicator', (done: Function) => {
                helper.invoke('wrap', ['A6']);
                helper.invoke('copy', ['A6']).then(() => {
                    helper.invoke('selectRange', ['A11']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        const elem: HTMLElement = helper.getElementFromSpreadsheet('.e-copy-indicator');
                        expect(elem.style.top).toBe('159px');
                        expect(elem.style.height).toBe('39px');
                        expect(helper.invoke('getCell', [10, 0]).textContent).toBe('Flip- Flops & Slippers');
                        done();
                    });
                });
            });
        });
        describe('EJ2-56522 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('While copy paste the merge cell with all borders, the left border is missing in pasted cell', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.setBorder({ borderLeft: '1px solid #e0e0e0' }, 'A1:B2');
                spreadsheet.setBorder({ borderRight: '1px solid #e0e0e0' }, 'A1:B2');
                spreadsheet.setBorder({ borderTop: '1px solid #e0e0e0' }, 'A1:B2');
                spreadsheet.setBorder({ borderBottom: '1px solid #e0e0e0' }, 'A1:B2');
                helper.invoke('selectRange', ['A1:B2']);
                helper.invoke('copy').then((): void => {
                    setTimeout((): void => {
                        helper.invoke('paste', ['A4:A4', "Formats"]);
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[3].cells[0].style.borderLeft).toBe('1px solid #e0e0e0');
                            expect(spreadsheet.sheets[0].rows[4].cells[0].style.borderLeft).toBe('1px solid #e0e0e0');
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-56649 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        conditionalFormats: [
                            { type: "ContainsText", cFColor: "RedFT", value: 'shoes', range: 'A2:A11' },
                            { type: "DateOccur", cFColor: "YellowFT", value: '7/22/2014', range: 'B2:B11' },
                            { type: "GreaterThan", cFColor: "GreenFT", value: '11:26:32 AM', range: 'C2:C11' },
                            { type: "LessThan", cFColor: "RedF", value: '20', range: 'D2:D11' },
                        ],
                        ranges: [{ dataSource: defaultData }]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Copy and paste didnt work properly with conditional formatting after save and load the spreadsheet as JSON', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let td: HTMLElement = helper.invoke('getCell', [1, 0]);
                expect(td.style.backgroundColor).toBe('rgb(255, 199, 206)');
                expect(td.style.color).toBe('rgb(156, 0, 85)');
                td = helper.invoke('getCell', [4, 0]);
                expect(td.style.backgroundColor).toBe('');
                expect(td.style.color).toBe('');
                helper.invoke('copy', ['A2:A11']).then(() => {
                    helper.invoke('selectRange', ['H2']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        let td: HTMLElement = helper.invoke('getCell', [1, 7]);
                        expect(td.style.backgroundColor).toBe('rgb(255, 199, 206)');
                        expect(td.style.color).toBe('rgb(156, 0, 85)');
                        done();
                    });
                });
            });
        });
        describe('SF-367525, SF-367519 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('External copy and paste cell model with style creation - copied from PowerPoint', (done: Function) => {
                const tableStr: string = '<style>col{mso-width-source:auto;}td{color:windowtext;vertical-align:bottom;border:none;}' +
                    '.oa1{border:1.0pt solid black;vertical-align:top;}</style>' +
                    '<table><tbody>' +
                    '<tr height="42" style="height:20.93pt">' +
                    '<td class="oa1"><p style="text-align:left;"><s style="text-line-through:single">' +
                    '<span style="font-size:18.0pt;font-family:Calibri;color:#2E75B6;font-weight:bold;font-style:italic;">115</span>' +
                    '</s></p></td>' +
                    '<td class="oa1"><p style="text-align:left;"><s style="text-line-through:single">' +
                    '<span style="font-size:18.0pt;font-family:Calibri;color:#2E75B6;font-weight:bold;font-style:italic;">313</span>' +
                    '</s></p></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="oa1"><p style="text-align:left;"><s style="text-line-through:single"><u style="text-underline:single">' +
                    '<span style="font-size:18.0pt;font-family:Calibri;color:#2E75B6;font-style:italic;"">225</span></u></s></p>' +
                    '</td>' +
                    '<td class="oa1"><p style="text-align:left;"><s style="text-line-through:single"><u style="text-underline:single">' +
                    '<span style="font-size:18.0pt;font-family:Calibri;color:#2E75B6;font-style:italic;">406</span></u></s></p>' +
                    '</td>' +
                    '</tr>' +
                    '</tbody></table>';
                const tableCont: Element = createElement('span', { innerHTML: tableStr });
                const spreadsheet: any = helper.getInstance();
                let rows: RowModel[] = [];
                spreadsheet.clipboardModule.generateCells(tableCont, rows);
                expect(rows.length).toBe(2);
                expect(rows[0].cells.length).toBe(2);
                expect(rows[0].cells[0].value as any).toBe(115);
                let style: string = '{"verticalAlign":"top","textAlign":"left","fontSize":"18pt","fontFamily":"Calibri","color":"#2E75B6",'
                    + '"fontWeight":"bold","fontStyle":"italic","textDecoration":"line-through","borderBottom":"1.33px solid black",' +
                    '"borderTop":"1.33px solid black","borderLeft":"1.33px solid black","borderRight":"1.33px solid black"}';
                expect(JSON.stringify(rows[0].cells[0].style)).toBe(style);
                expect(rows[0].cells[1].value as any).toBe(313);
                expect(JSON.stringify(rows[0].cells[1].style)).toBe(style);
                expect(rows[1].cells.length).toBe(2);
                expect(rows[1].cells[0].value as any).toBe(225);
                style = '{"verticalAlign":"top","textAlign":"left","textDecoration":"underline line-through","fontSize":"18pt",' +
                    '"fontFamily":"Calibri","color":"#2E75B6","fontStyle":"italic","borderBottom":"1.33px solid black",' +
                    '"borderTop":"1.33px solid black","borderLeft":"1.33px solid black","borderRight":"1.33px solid black"}';
                expect(JSON.stringify(rows[1].cells[0].style)).toBe(style);
                expect(rows[1].cells[1].value as any).toBe(406);
                expect(JSON.stringify(rows[1].cells[1].style)).toBe(style);
                done();
            });
        });
        describe('EJ2-58124 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{
                        ranges: [{
                            dataSource: defaultData
                        }]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('copy the unique formula and paste same sheet', (done: Function) => {
                helper.getInstance().selectRange('I1:I1')
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = '=UNIQUE(D2:D6)';
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toBe('=UNIQUE(D2:D6)');
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('10');
                    done();
                });
            });
            it('copying unique formula to another range', (done: Function) => {
                helper.invoke('copy', ['I1:I4']).then(() => {
                    helper.invoke('selectRange', ['J2']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe('30');
                        done();
                    });
                });
            });
            it('copying unique formula to another value containing range', (done: Function) => {
                helper.invoke('selectRange', ['I2:I4']);
                helper.invoke('copy', ['I1:I4']).then(() => {
                    helper.invoke('selectRange', ['F2']);
                    helper.invoke('paste');
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[1].cells[5].value).toBe('#SPILL!');
                        done();
                    });
                });
            });
            it('copy the unique formula and paste without spill', (done: Function) => {
                helper.getInstance().selectRange('I7:I7');
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = '=UNIQUE(D4:D7)';
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[6].cells[8].formula).toBe('=UNIQUE(D4:D7)');
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('10');
                    helper.invoke('selectRange', ['I7:I10']);
                    helper.invoke('copy', ['I7:I10']).then(() => {
                        helper.invoke('selectRange', ['E7']);
                        helper.invoke('paste');
                        setTimeout(() => {
                            expect(helper.getInstance().sheets[0].rows[6].cells[5].value).toBe('Formal Shoes');
                            done();
                        });
                    });
                    done();
                });
            });
        });
    });
});