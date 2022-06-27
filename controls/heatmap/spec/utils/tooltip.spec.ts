import { createElement, L10n, remove, EmitType } from '@syncfusion/ej2-base';
import { HeatMap } from '../../src/heatmap/heatmap';
import { Title } from '../../src/heatmap/model/base';
import { ILoadedEventArgs, ITooltipEventArgs } from '../../src/heatmap/model/interface'
import { Adaptor } from '../../src/heatmap/index';
import { Legend } from '../../src/heatmap/index';
import { Tooltip } from '../../src/heatmap/index';
import { MouseEvents } from '../base/event.spec';
import { profile , inMB, getMemoryProfile } from '../../spec/common.spec';
HeatMap.Inject(Adaptor, Legend, Tooltip);

describe('Heatmap Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Heatmap tooltip properties and its behavior', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let created: EmitType<Object>;
        let trigger: MouseEvents = new MouseEvents();
        // let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                width: "100%",
                height: "300px",
                xAxis: {
                    title: { text: "Weekdays" },
                },
                yAxis: {
                    title: { text: "YAxis" },
                },
                dataSource: [[10, "", 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, null, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 0, 50, 60, 70, 80, 90, 100]],
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
                    { 'value': 50, 'color': "rgb(153, 255, 187)" },
                    { 'value': 20, 'color': "rgb(153, 153, 255)" },
                    { 'value': 0, 'color': "rgb(255, 159, 128)" },
                    ],
                    type: "Fixed"
                },
                legendSettings: {
                    visible: false
                },
                showTooltip: true,
            });
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Checking heatmap instance creation', (done: Function) => {
            created = (args: Object): void => {
                expect(heatmap != null).toBe(true);
                done();
            }
            heatmap.created = created;
            heatmap.appendTo('#container');
        });
        it('Check tooltip visibility for a null cell', () => {
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 220, false);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).toBe(null);
        });
        it('Check tooltip visibility for a value exist cell', () => {
            heatmap.cellSettings.enableCellHighlighting = true;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).not.toBe(null);
        });
        it('Check tooltip visibility for a value exist cell and move to another cell', () => {
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 60, false);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).not.toBe(null);
        });
        it('Check tooltip visibility for a value exist cell and move to outer and come back', () => {
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 0, false);
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 60, false);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).not.toBe(null);
        });
        it('Check tooltip template visibility', () => {
            heatmap.tooltipRender = function (args: ITooltipEventArgs) {
                args.content = [args.xLabel + "-" + args.yLabel + "=" + parseInt(args.value.toString()) * 10];
            };
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_1');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).not.toBe(null);
        });
        it('Check tooltip template visibility in empty text cell', () => {
            tempElement = document.getElementById('container_HeatMapRect_24');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 220, false);
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("hidden");
        });
        it('Check tooltip visibility beyond heatmap container', () => {
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 0, 0));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("hidden");
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            tempElement = document.getElementById('container_HeatMapRect_1');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            tempElement = document.getElementById('container_HeatMapRect_2');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            tempElement = document.getElementById('container_HeatMapRect_3');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 170, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            heatmap.paletteSettings.type = 'Gradient';
            heatmap.legendSettings.showGradientPointer = true;
            heatmap.legendSettings.visible = true;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_2');
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            expect(tempElement.style.visibility).toBe('');
            setTimeout(done, 1600);
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            heatmap.renderingMode = 'Canvas';
            heatmap.refresh();
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseMove(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 170, 80));
            tempElement = document.getElementById('containerCelltooltipcontainer');
            expect(tempElement.style.visibility).toBe("visible");
            setTimeout(done, 1600);
        });
        it('Check tooltip visibility on touch', (done: Function) => {
            tempElement = document.getElementById('container');
            heatmap.heatMapMouseLeave(<PointerEvent>trigger.onTouchStart(tempElement, null, null, null, null, 70, 80));
            expect(tempElement.style.visibility).toBe('');
            setTimeout(done, 1600);
        });
        it('Check tooltip template visibility while cancel it', () => {
            heatmap.tooltipRender = function (args: ITooltipEventArgs) {
                args.cancel = true;
            };
            heatmap.renderingMode = 'SVG';
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_1');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tempElement = document.getElementById('containerCelltooltipcontainer_svg');
            expect(tempElement).toBe(null);
        });
        it('Check tooltip Color', () => {
            heatmap.tooltipRender = function (args) {
                args.cancel = false;
            };
            heatmap.tooltipSettings.fill = "RED";
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(document.getElementById('containerCelltooltipcontainer_path').getAttribute("fill")).toBe("RED");
        });
        it('Changing tooltip color dynamically', () => {
            heatmap.tooltipSettings.fill = "Pink";
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(document.getElementById('containerCelltooltipcontainer_path').getAttribute("fill")).toBe("Pink");
        });
        it('Check tooltip Color', function () {
            heatmap.tooltipRender = function (args) {
                args.cancel = false;
            };
            heatmap.tooltipSettings.fill = "RED";
            heatmap.cellSettings.border.width = 10;
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 150, 31, false);
            expect(document.getElementById('containerCelltooltipcontainer_path').getAttribute("fill")).toBe("RED");
            heatmap.cellSettings.border.width = 1;
            heatmap.refresh();
        });
        it('Check tooltip font family', function () {
            heatmap.theme = "TailwindDark",
            heatmap.dataBind();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(document.getElementById('containerCelltooltipcontainer_text').getAttribute("font-family")).toBe("Inter");
            expect(document.getElementById('containerCelltooltipcontainer_path').getAttribute("fill")).toBe("#F9FAFB");
            expect(document.getElementById('containerCelltooltipcontainer_path').getAttribute("opacity")).toBe("1");
        });
        it('Check tooltip template support', function () {
            heatmap.tooltipSettings.template = "<div>${xValue}</div><div>${yValue}</div>${value}";
            heatmap.refresh();
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            tempElement = document.getElementById('containerCelltooltipcontainerparent_template');
            expect(tempElement.textContent).toBe("09100");
        });
    });
    describe('Heatmap tooltip with Tailwind theme', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                width: "100%",
                height: "300px",
                xAxis: {
                    title: { text: "Weekdays" },
                },
                yAxis: {
                    title: { text: "YAxis" },
                },
                dataSource: [[10, "", 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, null, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 0, 50, 60, 70, 80, 90, 100]],
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
                    { 'value': 50, 'color': "rgb(153, 255, 187)" },
                    { 'value': 20, 'color': "rgb(153, 153, 255)" },
                    { 'value': 0, 'color': "rgb(255, 159, 128)" },
                    ],
                    type: "Fixed"
                },
                theme: "Tailwind",
                legendSettings: {
                    visible: false
                },
                showTooltip: true,
            });
            heatmap.appendTo('#container');
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Check tooltip visibility of Tailwind Theme', () => {
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(document.getElementById('containerCelltooltipcontainer_text').getAttribute("font-family")).toBe("Inter");
            expect(document.getElementById('containerCelltooltipcontainer_path').getAttribute("opacity")).toBe("1");
        });
    });

    describe('Heatmap tooltip with Fluent theme', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                width: "100%",
                height: "300px",
                xAxis: {
                    title: { text: "Weekdays" },
                },
                yAxis: {
                    title: { text: "YAxis" },
                },
                dataSource: [[10, "", 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, null, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 0, 50, 60, 70, 80, 90, 100]],
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
                    { 'value': 50, 'color': "rgb(153, 255, 187)" },
                    { 'value': 20, 'color': "rgb(153, 153, 255)" },
                    { 'value': 0, 'color': "rgb(255, 159, 128)" },
                    ],
                    type: "Fixed"
                },
                theme: "Fluent",
                legendSettings: {
                    visible: false
                },
                showTooltip: true,
            });
            heatmap.appendTo('#container');
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Check tooltip visibility of Fluent Theme', () => {
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(document.getElementById('containerCelltooltipcontainer_text').getAttribute('font-family') == '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif').toBe(true);
        });
    });

    describe('Heatmap tooltip with Fluent Dark theme', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                width: "100%",
                height: "300px",
                xAxis: {
                    title: { text: "Weekdays" },
                },
                yAxis: {
                    title: { text: "YAxis" },
                },
                dataSource: [[10, "", 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, null, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 0, 50, 60, 70, 80, 90, 100]],
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
                    { 'value': 50, 'color': "rgb(153, 255, 187)" },
                    { 'value': 20, 'color': "rgb(153, 153, 255)" },
                    { 'value': 0, 'color': "rgb(255, 159, 128)" },
                    ],
                    type: "Fixed"
                },
                theme: "FluentDark",
                legendSettings: {
                    visible: false
                },
                showTooltip: true,
            });
            heatmap.appendTo('#container');
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Check tooltip visibility of Fluent Dark Theme', () => {
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(document.getElementById('containerCelltooltipcontainer_text').getAttribute('font-family') == '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif').toBe(true);
        });
    });


    describe('Heatmap tooltip with Bootstrap5 theme', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                width: "100%",
                height: "300px",
                xAxis: {
                    title: { text: "Weekdays" },
                },
                yAxis: {
                    title: { text: "YAxis" },
                },
                dataSource: [[10, "", 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, null, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 0, 50, 60, 70, 80, 90, 100]],
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
                    { 'value': 50, 'color': "rgb(153, 255, 187)" },
                    { 'value': 20, 'color': "rgb(153, 153, 255)" },
                    { 'value': 0, 'color': "rgb(255, 159, 128)" },
                    ],
                    type: "Fixed"
                },
                theme: "Bootstrap5",
                legendSettings: {
                    visible: false
                },
                showTooltip: true,
            });
            heatmap.appendTo('#container');
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Check tooltip visibility of Bootstrap5 Theme', () => {
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(document.getElementById('containerCelltooltipcontainer_text').getAttribute('font-family') == 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"').toBe(true);
        });
    });


    describe('Heatmap tooltip with Bootstrap5Dark theme', () => {
        let heatmap: HeatMap;
        let ele: HTMLElement;
        let tempElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            heatmap = new HeatMap({
                width: "100%",
                height: "300px",
                xAxis: {
                    title: { text: "Weekdays" },
                },
                yAxis: {
                    title: { text: "YAxis" },
                },
                dataSource: [[10, "", 30, 40, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, null, 50, 60, 70, 80, 90, 100],
                [10, 20, 30, 0, 50, 60, 70, 80, 90, 100]],
                paletteSettings: {
                    palette: [{ 'value': 100, 'color': "rgb(255, 255, 153)" },
                    { 'value': 50, 'color': "rgb(153, 255, 187)" },
                    { 'value': 20, 'color': "rgb(153, 153, 255)" },
                    { 'value': 0, 'color': "rgb(255, 159, 128)" },
                    ],
                    type: "Fixed"
                },
                theme: "Bootstrap5Dark",
                legendSettings: {
                    visible: false
                },
                showTooltip: true,
            });
            heatmap.appendTo('#container');
        });

        afterAll((): void => {
            heatmap.destroy();
        });
        it('Check tooltip visibility of Bootstrap5Dark Theme', () => {
            tempElement = document.getElementById('container_HeatMapRect_0');
            trigger.mousemoveEvent(tempElement, 0, 0, 60, 20, false);
            expect(document.getElementById('containerCelltooltipcontainer_text').getAttribute('font-family') == 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"').toBe(true);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});