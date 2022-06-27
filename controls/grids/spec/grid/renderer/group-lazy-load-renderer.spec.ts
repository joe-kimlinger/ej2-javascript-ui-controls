/**
 * Lazy load group spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { Group } from '../../../src/grid/actions/group';
import { LazyLoadGroup } from '../../../src/grid/actions/lazy-load-group';
import { Page } from '../../../src/grid/actions/page';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { createGrid, destroy } from '../base/specutil.spec';
import { ColumnChooser } from '../../../src/grid/actions/column-chooser';
import { filterData } from '../base/datasource.spec';

Grid.Inject(Page, Group, LazyLoadGroup, Reorder, ColumnChooser, Aggregate);

let lazyLoadData: Object[] = [];
function createLazyLoadData(): void {
    let customerid: string[] = ['VINET', 'TOMSP', 'HANAR', 'VICTE', 'SUPRD', 'HANAR', 'CHOPS', 'RICSU', 'WELLI', 'HILAA', 'ERNSH', 'CENTC',
        'OTTIK', 'QUEDE', 'RATTC', 'ERNSH', 'FOLKO', 'BLONP', 'WARTH', 'FRANK', 'GROSR', 'WHITC', 'WARTH', 'SPLIR', 'RATTC', 'QUICK', 'VINET',
        'MAGAA', 'TORTU', 'MORGK', 'BERGS', 'LEHMS', 'BERGS', 'ROMEY', 'ROMEY', 'LILAS', 'LEHMS', 'QUICK', 'QUICK', 'RICAR', 'REGGC', 'BSBEV',
        'COMMI', 'QUEDE', 'TRADH', 'TORTU', 'RATTC', 'VINET', 'LILAS', 'BLONP', 'HUNGO', 'RICAR', 'MAGAA', 'WANDK', 'SUPRD', 'GODOS', 'TORTU',
        'OLDWO', 'ROMEY', 'LONEP', 'ANATR', 'HUNGO', 'THEBI', 'DUMON', 'WANDK', 'QUICK', 'RATTC', 'ISLAT', 'RATTC', 'LONEP', 'ISLAT', 'TORTU',
        'WARTH', 'ISLAT', 'PERIC', 'KOENE', 'SAVEA', 'KOENE', 'BOLID', 'FOLKO', 'FURIB', 'SPLIR', 'LILAS', 'BONAP', 'MEREP', 'WARTH', 'VICTE',
        'HUNGO', 'PRINI', 'FRANK', 'OLDWO', 'MEREP', 'BONAP', 'SIMOB', 'FRANK', 'LEHMS', 'WHITC', 'QUICK', 'RATTC', 'FAMIA'];

    let product: string[] = ['Chai', 'Chang', 'Aniseed Syrup', 'Chef Anton\'s Cajun Seasoning', 'Chef Anton\'s Gumbo Mix', 'Grandma\'s Boysenberry Spread',
        'Uncle Bob\'s Organic Dried Pears', 'Northwoods Cranberry Sauce', 'Mishi Kobe Niku', 'Ikura', 'Queso Cabrales', 'Queso Manchego La Pastora', 'Konbu',
        'Tofu', 'Genen Shouyu', 'Pavlova', 'Alice Mutton', 'Carnarvon Tigers', 'Teatime Chocolate Biscuits', 'Sir Rodney\'s Marmalade', 'Sir Rodney\'s Scones',
        'Gustaf\'s Knäckebröd', 'Tunnbröd', 'Guaraná Fantástica', 'NuNuCa Nuß-Nougat-Creme', 'Gumbär Gummibärchen', 'Schoggi Schokolade', 'Rössle Sauerkraut',
        'Thüringer Rostbratwurst', 'Nord-Ost Matjeshering', 'Gorgonzola Telino', 'Mascarpone Fabioli', 'Geitost', 'Sasquatch Ale', 'Steeleye Stout', 'Inlagd Sill',
        'Gravad lax', 'Côte de Blaye', 'Chartreuse verte', 'Boston Crab Meat', 'Jack\'s New England Clam Chowder', 'Singaporean Hokkien Fried Mee', 'Ipoh Coffee',
        'Gula Malacca', 'Rogede sild', 'Spegesild', 'Zaanse koeken', 'Chocolade', 'Maxilaku', 'Valkoinen suklaa', 'Manjimup Dried Apples', 'Filo Mix', 'Perth Pasties',
        'Tourtière', 'Pâté chinois', 'Gnocchi di nonna Alice', 'Ravioli Angelo', 'Escargots de Bourgogne', 'Raclette Courdavault', 'Camembert Pierrot', 'Sirop d\'érable',
        'Tarte au sucre', 'Vegie-spread', 'Wimmers gute Semmelknödel', 'Louisiana Fiery Hot Pepper Sauce', 'Louisiana Hot Spiced Okra', 'Laughing Lumberjack Lager', 'Scottish Longbreads',
        'Gudbrandsdalsost', 'Outback Lager', 'Flotemysost', 'Mozzarella di Giovanni', 'Röd Kaviar', 'Longlife Tofu', 'Rhönbräu Klosterbier', 'Lakkalikööri', 'Original Frankfurter grüne Soße'];

    let customername: string[] = ['Maria', 'Ana Trujillo', 'Antonio Moreno', 'Thomas Hardy', 'Christina Berglund', 'Hanna Moos', 'Frédérique Citeaux', 'Martín Sommer', 'Laurence Lebihan', 'Elizabeth Lincoln',
        'Victoria Ashworth', 'Patricio Simpson', 'Francisco Chang', 'Yang Wang', 'Pedro Afonso', 'Elizabeth Brown', 'Sven Ottlieb', 'Janine Labrune', 'Ann Devon', 'Roland Mendel', 'Aria Cruz', 'Diego Roel',
        'Martine Rancé', 'Maria Larsson', 'Peter Franken', 'Carine Schmitt', 'Paolo Accorti', 'Lino Rodriguez', 'Eduardo Saavedra', 'José Pedro Freyre', 'André Fonseca', 'Howard Snyder', 'Manuel Pereira',
        'Mario Pontes', 'Carlos Hernández', 'Yoshi Latimer', 'Patricia McKenna', 'Helen Bennett', 'Philip Cramer', 'Daniel Tonini', 'Annette Roulet', 'Yoshi Tannamuri', 'John Steel', 'Renate Messner', 'Jaime Yorres',
        'Carlos González', 'Felipe Izquierdo', 'Fran Wilson', 'Giovanni Rovelli', 'Catherine Dewey', 'Jean Fresnière', 'Alexander Feuer', 'Simon Crowther', 'Yvonne Moncada', 'Rene Phillips', 'Henriette Pfalzheim',
        'Marie Bertrand', 'Guillermo Fernández', 'Georg Pipps', 'Isabel de Castro', 'Bernardo Batista', 'Lúcia Carvalho', 'Horst Kloss', 'Sergio Gutiérrez', 'Paula Wilson', 'Maurizio Moroni', 'Janete Limeira', 'Michael Holz',
        'Alejandra Camino', 'Jonas Bergulfsen', 'Jose Pavarotti', 'Hari Kumar', 'Jytte Petersen', 'Dominique Perrier', 'Art Braunschweiger', 'Pascale Cartrain', 'Liz Nixon', 'Liu Wong', 'Karin Josephs', 'Miguel Angel Paolino',
        'Anabela Domingues', 'Helvetius Nagy', 'Palle Ibsen', 'Mary Saveley', 'Paul Henriot', 'Rita Müller', 'Pirkko Koskitalo', 'Paula Parente', 'Karl Jablonski', 'Matti Karttunen', 'Zbyszek Piestrzeniewicz'];

    let customeraddress: string[] = ['507 - 20th Ave. E.\r\nApt. 2A', '908 W. Capital Way', '722 Moss Bay Blvd.', '4110 Old Redmond Rd.', '14 Garrett Hill', 'Coventry House\r\nMiner Rd.', 'Edgeham Hollow\r\nWinchester Way',
        '4726 - 11th Ave. N.E.', '7 Houndstooth Rd.', '59 rue de l\'Abbaye', 'Luisenstr. 48', '908 W. Capital Way', '722 Moss Bay Blvd.', '4110 Old Redmond Rd.', '14 Garrett Hill', 'Coventry House\r\nMiner Rd.', 'Edgeham Hollow\r\nWinchester Way',
        '7 Houndstooth Rd.', '2817 Milton Dr.', 'Kirchgasse 6', 'Sierras de Granada 9993', 'Mehrheimerstr. 369', 'Rua da Panificadora, 12', '2817 Milton Dr.', 'Mehrheimerstr. 369'];

    let quantityperunit: string[] = ['10 boxes x 20 bags', '24 - 12 oz bottles', '12 - 550 ml bottles', '48 - 6 oz jars', '36 boxes', '12 - 8 oz jars', '12 - 1 lb pkgs.', '12 - 12 oz jars', '18 - 500 g pkgs.', '12 - 200 ml jars',
        '1 kg pkg.', '10 - 500 g pkgs.', '2 kg box', '40 - 100 g pkgs.', '24 - 250 ml bottles', '32 - 500 g boxes', '20 - 1 kg tins', '16 kg pkg.', '10 boxes x 12 pieces', '30 gift boxes', '24 pkgs. x 4 pieces', '24 - 500 g pkgs.', '12 - 250 g pkgs.',
        '12 - 355 ml cans', '20 - 450 g glasses', '100 - 250 g bags'];

    let OrderID: number = 10248;
    for (let i: number = 0; i < 5000; i++) {
        lazyLoadData.push({
            'OrderID': OrderID + i,
            'CustomerID': customerid[Math.floor(Math.random() * customerid.length)],
            'CustomerName': customername[Math.floor(Math.random() * customername.length)],
            'CustomerAddress': customeraddress[Math.floor(Math.random() * customeraddress.length)],
            'ProductName': product[Math.floor(Math.random() * product.length)],
            'ProductID': i,
            'Quantity': quantityperunit[Math.floor(Math.random() * quantityperunit.length)]
        })
    }
}

createLazyLoadData();

describe('LazyLoadGroup module', () => {
    describe('Grouping test', () => {
        let gridObj: any;
        let isExpand: boolean = false;
        let uid: string;
        let expandShortcut: boolean = false;
        let collapseShortcut: boolean = false;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: lazyLoadData,
                    allowGrouping: true,
                    allowPaging: true,
                    allowReordering: true,
                    showColumnChooser: true,
                    groupSettings: { enableLazyLoading: true },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', width: 120 },
                        { field: 'ProductName', headerText: 'Product Name', width: 120 },
                        { field: 'ProductID', headerText: 'Product ID', textAlign: 'Right', width: 120 },
                        { field: 'Quantity', headerText: 'Quantity', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 120 },
                        { field: 'CustomerAddress', headerText: 'Address', width: 120 }
                    ]
                }, done);
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                expect(gridObj.contentModule.cacheMode).toBe(false);
                expect(gridObj.contentModule.groupCache[gridObj.pageSettings.currentPage].length).toBe(gridObj.pageSettings.pageSize);
                let scrollEle: Element = gridObj.getContent().firstElementChild;
                let blockSize: number = Math.floor((scrollEle as HTMLElement).offsetHeight / gridObj.getRowHeight()) - 1;
                let pageSize = blockSize * 3;
                expect(gridObj.contentModule.pageSize).toBe(pageSize);
                expect(gridObj.contentModule.blockSize).toBe(Math.ceil(pageSize / 2));
                expect(gridObj.contentModule.initialGroupCaptions[gridObj.pageSettings.currentPage].length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.contentModule.initialPageRecords.length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.getContent().querySelector('.e-row')).toBeNull();
                expect(gridObj.getContent().querySelectorAll('tr').length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.contentModule.getInitialCaptionIndexes().length).toBe(gridObj.pageSettings.pageSize);
                expect(Object.keys(gridObj.contentModule.rowsByUid[gridObj.pageSettings.currentPage]).length).toBe(gridObj.pageSettings.pageSize);
                expect(Object.keys(gridObj.contentModule.objIdxByUid[gridObj.pageSettings.currentPage]).length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.contentModule.startIndexes[gridObj.pageSettings.currentPage]).toBeUndefined();
                expect(gridObj.getRows().length).toBe(0);
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductName');
        });
        it('caption expand', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            let lazyLoadGroupExpand = function(args: any) {
                isExpand = true;
                expect(args.enableCaching).toBe(true);
                expect(args.captionRowElement).toBe(expandElem[0].parentElement);
                expect(args.groupInfo.indent).toBe(0);
                gridObj.lazyLoadGroupExpand = null;
                setTimeout(done, 100);
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        it('caption collapse', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            expect(gridObj.getContent().querySelectorAll('tr').length).not.toBe(gridObj.pageSettings.pageSize);
            expect(gridObj.getContent().querySelector('.e-row')).not.toBeNull();
            expect(gridObj.contentModule.groupCache[gridObj.pageSettings.currentPage].length).toBeGreaterThan(gridObj.pageSettings.pageSize);
            expect(gridObj.contentModule.startIndexes[gridObj.pageSettings.currentPage].length).toBe(gridObj.pageSettings.pageSize);
            expect(Object.keys(gridObj.contentModule.rowsByUid[gridObj.pageSettings.currentPage]).length).not.toBe(gridObj.pageSettings.pageSize);
            expect(Object.keys(gridObj.contentModule.objIdxByUid[gridObj.pageSettings.currentPage]).length).not.toBe(gridObj.pageSettings.pageSize);
            expect(gridObj.getRows().length).not.toBe(0);
            expect(gridObj.getRowByIndex(0)).not.toBeUndefined();
            let lazyLoadGroupCollapse = function(args: any) {
                isExpand = false;
                expect(args.enableCaching).toBeUndefined();
                expect(args.captionRowElement).toBe(expandElem[0].parentElement);
                expect(args.groupInfo.indent).toBe(0);
                gridObj.lazyLoadGroupCollapse = null;
                setTimeout(done, 100);
            };
            expect(isExpand).toBe(true);
            gridObj.lazyLoadGroupCollapse = lazyLoadGroupCollapse;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        it('Ensure rows', () => {
            expect(isExpand).toBe(false);
            expect(gridObj.getContent().querySelectorAll('tr').length).toBe(gridObj.pageSettings.pageSize);
            expect(gridObj.getContent().querySelector('.e-row')).toBeNull();
        });
        it('clear groping', (done: Function) => {
            let actionComplete = function (args: any) {
                expect(gridObj.contentModule.startIndexes[gridObj.pageSettings.currentPage]).toBeUndefined();
                expect(gridObj.contentModule.rowsByUid[gridObj.pageSettings.currentPage]).toBeUndefined();
                expect(gridObj.contentModule.objIdxByUid[gridObj.pageSettings.currentPage]).toBeUndefined();
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductName');
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductName');
        });
        it('Group ProductID column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductID');
        });
        it('caption expand', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            let lazyLoadGroupExpand = function(args: any) {
                expect(gridObj.getContent().querySelector('.e-row')).toBeNull();
                gridObj.lazyLoadGroupExpand = null;
                done();
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
        });
        it('Go to second page', (done: Function) => {
            uid = gridObj.getContent().querySelectorAll('tr')[2].getAttribute('data-uid');
            let actionComplete = function () {
                expect(gridObj.getContent().querySelectorAll('tr').length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.contentModule.groupCache[gridObj.pageSettings.currentPage].length).toBe(gridObj.pageSettings.pageSize);
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 2;
            gridObj.dataBind();
        });
        it('Go to first page', (done: Function) => {
            let actionComplete = function () {
                gridObj.actionComplete = null;
                setTimeout(done, 100);
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 1;
            gridObj.dataBind();
        });
        it('clear groping', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductName');
        });
        it('clear groping', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductID');
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductName');
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductID');
        });
        it('expand shortcut ProductName', (done: Function) => {
            gridObj.keyA = true;
            let keyDownArgs = { 
                altKey: true, keyCode: 74, target: gridObj.getContent().querySelectorAll('tr')[0].cells[0]
            }
            let lazyLoadGroupExpand = function(args: any) {
                expandShortcut = true;
                gridObj.lazyLoadGroupExpand = null;
                done();
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.keyDownHandler(keyDownArgs);
        });
        it('expand shortcut ProductID', (done: Function) => {
            gridObj.keyA = true;
            let keyDownArgs = { 
                altKey: true, keyCode: 74, target: gridObj.getContent().querySelectorAll('tr')[1].cells[0]
            }
            let lazyLoadGroupExpand = function(args: any) {
                gridObj.lazyLoadGroupExpand = null;
                setTimeout(done, 100);
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.keyDownHandler(keyDownArgs);
        });
        it('clear groping ProductName', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductName');
        });
        it('clear groping ProductID', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductID');
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductName');
        });
        it('first caption expand', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            let lazyLoadGroupExpand = function(args: any) {
                gridObj.lazyLoadGroupExpand = null;
                done();
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        it('Reorder Column method testing', (done: Function) => {
            let actionComplete = (args: Object): void => {
                let headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[3].querySelector('.e-headercelldiv').textContent).toBe('Customer Name');
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.reorderColumns('CustomerName', 'Quantity');
        });
        it('check the visible cells true/false', () => {
            gridObj.hideColumns('Address');
            expect(gridObj.getRowsObject()[1].cells[7].visible).toBeFalsy();
        });
        it('clear groping ProductName', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductName');
        });
        it('check the visible cells true/false', () => {
            gridObj.showColumns('Address');
            expect(gridObj.getRowsObject()[1].cells[6].visible).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('LazyLoadGroup with aggregate', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: lazyLoadData,
                    allowGrouping: true,
                    allowPaging: true,
                    allowReordering: true,
                    showColumnChooser: true,
                    groupSettings: { enableLazyLoading: true, columns: ['ProductName'] },
                    columns: [
                        { field: 'ProductName', headerText: 'Product Name', width: 120 },
                        { field: 'Quantity', headerText: 'Quantity', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 120 },
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', width: 120 },
                        { field: 'ProductID', headerText: 'Product ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerAddress', headerText: 'Address', width: 120 }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'OrderID',
                            groupFooterTemplate: 'Total units: ${Sum}'
                        },
                        {
                            type: 'Max',
                            field: 'ProductID',
                            groupCaptionTemplate: 'Maximum: ${Max}'
                        }]
                    }],
                }, done);
        });
        it('caption expand', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            let lazyLoadGroupExpand = function(args: any) {
                gridObj.lazyLoadGroupExpand = null;
                done();
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        it('Ensure caption', () => {
            let captionRow = gridObj.getContent().querySelector('tr');
            expect(captionRow.querySelector('.e-templatecell')).not.toBeNull();
        });
        it('check the visible cells true/false', () => {
            gridObj.hideColumns('Address');
            expect(gridObj.getRowsObject()[1].cells[7].visible).toBeFalsy();
        });
        it('caption collapse', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            let lazyLoadGroupCollapse = function(args: any) {
                let captionRow = gridObj.getContent().querySelector('tr');
                expect(captionRow.querySelector('.e-templatecell')).not.toBeNull();
                gridObj.lazyLoadGroupCollapse = null;
                done();
            };
            gridObj.lazyLoadGroupCollapse = lazyLoadGroupCollapse;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Group caption 1st column template with lazyloading =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowGrouping: true,
                    groupSettings: { showDropArea: true, enableLazyLoading: true, columns: ['OrderID'] },
                    columns: [
                        { field: 'Freight', headerText: 'Freight', width: 150, format: 'C2' },
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                    ],
                    height: 290,
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            format: 'C2',
                            groupFooterTemplate: 'Sum: ${Sum}'
                        }]
                    },
                    {
                        columns: [{
                            type: 'Max',
                            field: 'Freight',
                            format: 'C2',
                            groupCaptionTemplate: 'Max: ${Max}'
                        }]
                    }]
                }, done);
        });
    
        it('check 1st column template', () => {
            expect(gridObj.getContent().querySelectorAll('.e-groupcaption')[0].innerHTML).toBe('Order ID: 10248   Max: $32.38');
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});
