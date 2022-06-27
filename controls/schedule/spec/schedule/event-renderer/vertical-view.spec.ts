/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Vertical view appointment rendering spec
 */
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { MultiSelect } from '@syncfusion/ej2-dropdowns';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, EventRenderedArgs, EJ2Instance, ScheduleModel,
    PopupOpenEventArgs, CellClickEventArgs
} from '../../../src/schedule/index';
import * as events from '../../../src/schedule/base/constant';
import { defaultData, resourceData, resourceGroupData, testBlockData, generateAllDayData } from '../base/datasource.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import { RecurrenceEditor } from '../../../src/recurrence-editor/index';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Vertical View Event Render Module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Vertical view appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment element', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(dayWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointment: Element = dayWrapper[0].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(720);
        });

        it('Refreshing rendered events', () => {
            schObj.refreshEvents(false);
            const elements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(elements.length).toBeGreaterThan(0);
        });

        it('Checking next week appointment element', (done: DoneFn) => {
            schObj.dataBound = () => {
                const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(dayWrapper[0].childElementCount).toBeGreaterThanOrEqual(0);
                done();
            };
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });

        it('View based events rendering checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                const elements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(elements.length).toBeGreaterThan(0);
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });
    });

    describe('Events with string date', () => {
        let schObj: Schedule;
        const eventsDatas: Record<string, any>[] = [
            // eslint-disable-next-line no-useless-escape
            { StartTime: '\/Date(1518321600000)\/', EndTime: '\/Date(1518327000000)\/' },
            { StartTime: '2018-02-11T11:00:00', EndTime: '2018-02-11T13:00:00' },
            { StartTime: '2018-02-12 11:00:00', EndTime: '2018-02-12 13:00:00' }
        ];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2018, 1, 11) };
            schObj = util.createSchedule(model, eventsDatas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
        });
    });

    describe('Keyboard interactions with appointments', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeEach((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2), currentView: 'Month' };
            schObj = util.createSchedule(model, defaultData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('shiftUp arrow key', (done: DoneFn) => {
            const eventCount: number = schObj.eventsData.length;
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(eventCount + 1);
                done();
            };
            const appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            const targetEvent: HTMLElement = appointment.slice(-1)[0];
            targetEvent.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetEvent;
            keyModule.keyActionHandler({
                action: 'shiftUpArrow', shiftKey: true,
                target: targetEvent, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            keyModule.keyActionHandler({
                action: 'enter', target: document.activeElement,
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList).toContain('e-popup-open');
            (schObj.element.querySelector('.e-quick-popup-wrapper .e-subject') as HTMLInputElement).value = 'shiftUpArrow Testing';
            keyModule.keyActionHandler({
                action: 'enter', target: schObj.element.querySelector('.e-quick-popup-wrapper .e-event-create'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
        });

        it('shiftDown arrow key', (done: DoneFn) => {
            const eventCount: number = schObj.eventsData.length;
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(eventCount + 1);
                done();
            };
            const appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            const targetEvent: HTMLElement = appointment.slice(-1)[0];
            targetEvent.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetEvent;
            keyModule.keyActionHandler({
                action: 'shiftDownArrow', shiftKey: true,
                target: targetEvent, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            keyModule.keyActionHandler({
                action: 'enter', target: document.activeElement,
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList).toContain('e-popup-open');
            (schObj.element.querySelector('.e-quick-popup-wrapper .e-subject') as HTMLInputElement).value = 'shiftDownArrow Testing';
            keyModule.keyActionHandler({
                action: 'enter', target: schObj.element.querySelector('.e-quick-popup-wrapper .e-event-create'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
        });
    });

    describe('time scale property', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'WorkWeek', height: '550px', width: '500px',
                timeScale: { enable: false }, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('TIme scale disable mode events rendering', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(14);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(5);
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(0);
        });
    });

    describe('EventRendered appointment disable mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'WorkWeek', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 6),
                eventRendered: (args: EventRenderedArgs) => args.cancel = true
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Elements in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
        });
    });

    describe('Vertical view appointment rendering in RTL Mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', enableRtl: true, selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(dayWrapper[0].childElementCount).toBeGreaterThan(0);
        });
    });

    describe('Quick Popup and Editor Window in RTL Mode', () => {
        let schObj: Schedule;
        beforeEach((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', enableRtl: true, selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterEach(() => {
            util.destroy(schObj);
        });
        it('event double click when RTL enabled', () => {
            let popupType: string;
            expect(schObj.eventsData.length).toEqual(43);
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                popupType = args.type;
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_9"]')[0] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            expect(popupType).toEqual('QuickInfo');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(popupType).toEqual('Editor');
        });
        it('cell double click when RTL enabled', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            schObj.cellDoubleClick = (args: CellClickEventArgs) => {
                cellStartTime = args.startTime.getTime();
                cellEndTime = args.endTime.getTime();
                eventName = args.name;
            };
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[130] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[130] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2017, 10, 2, 9, 0).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 10, 2, 9, 30).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });
    });

    describe('Schedule vertical view appointment template checking', () => {
        let schObj: Schedule;
        const eventTemplate: string = '<div>Subject: ${Subject}</div><div>StartTime: ${StartTime.toLocaleString()}</div>' +
            '<div>EndTime: ${EndTime.toLocaleString()</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 2),
                eventSettings: { template: eventTemplate }
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(dayWrapper[0].childElementCount).toBeGreaterThan(0);
        });
    });

    describe('Checking vertical view appointment click actions', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment click action', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            const appointment: Element[] = [].slice.call(dayWrapper[0].querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appointment[0] as HTMLElement, 'click');
            expect(appointment[0].classList.contains('e-appointment-border')).toEqual(true);
            util.triggerMouseEvent(document.body, 'mousedown');
            const appointment1: Element[] = [].slice.call(dayWrapper[0].querySelectorAll('.e-appointment'));
            expect(appointment1[0].classList.contains('e-appointment-border')).toEqual(false);
        });
    });

    describe('Checking vertical view appointment with start and end hour', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', startHour: '09:00', endHour: '18:00', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const dayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(dayWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointment: Element = dayWrapper[0].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(72);
        });
    });

    describe('Vertical view all-day row appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[2].childElementCount).toBeGreaterThan(0);
            const appointment: Element = allDayWrapper[2].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(62);
        });
    });

    describe('Vertical view more that 24 hours appointment rendering with and without spannedEventPlacement property', () => {
        let schObj: Schedule;
        const appointments: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event',
            StartTime: new Date(2017, 10, 1, 10, 0),
            EndTime: new Date(2017, 10, 1, 12, 0),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'Testing',
            StartTime: new Date(2017, 10, 1, 10, 0),
            EndTime: new Date(2017, 10, 2, 12, 30),
            IsAllDay: false
        }, {
            Id: 3,
            Subject: 'Holiday',
            StartTime: new Date(2017, 10, 2),
            EndTime: new Date(2017, 10, 3),
            IsAllDay: true
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2), eventSettings: { spannedEventPlacement: 'TimeSlot' } };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking more that 24 hours appointment element with spannedEventPlacement property', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[3].childElementCount).toEqual(0);
            const spannedEVent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_2"]');
            const eventDetails: Record<string, any> = schObj.getEventDetails(spannedEVent);
            expect(eventDetails.IsAllDay).toEqual(false);
            expect(spannedEVent.classList.contains('e-all-day-appointment')).toEqual(false);
            expect(spannedEVent.offsetTop).toEqual(720);
            expect(spannedEVent.offsetHeight).toEqual(1008);
        });
        it('Checking more that 24 hours appointment element without spannedEventPlacement property', () => {
            schObj.dataBound = null;
            schObj.eventSettings.spannedEventPlacement = 'AllDayRow';
            schObj.dataBind();
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[3].childElementCount).toBeGreaterThan(0);
            const spannedEVent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_2"]');
            const eventDetails: Record<string, any> = schObj.getEventDetails(spannedEVent);
            expect(eventDetails.IsAllDay).toEqual(false);
            expect(spannedEVent.classList.contains('e-all-day-appointment')).toEqual(true);
            expect(spannedEVent.offsetTop).toEqual(62);
            expect(spannedEVent.offsetHeight).toEqual(22);
        });
    });

    describe('Vertical view all-day row appointment rendering in RTL Mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', enableRtl: true, selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[2].childElementCount).toBeGreaterThan(0);
        });
    });

    describe('Checking vertical view all-day row appointment click actions', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment click action', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            const appointment: Element[] = [].slice.call(allDayWrapper[2].querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appointment[0] as HTMLElement, 'click');
            expect(appointment[0].classList.contains('e-appointment-border')).toEqual(true);
            util.triggerMouseEvent(document.body, 'mousedown');
            const appointment1: Element[] = [].slice.call(allDayWrapper[2].querySelectorAll('.e-appointment'));
            expect(appointment1[0].classList.contains('e-appointment-border')).toEqual(false);
        });
    });

    describe('Checking vertical view all-day row appointment with work days', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'WorkWeek',
                workDays: [1, 3, 4, 5], selectedDate: new Date(2017, 10, 7)
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[1].childElementCount).toBeGreaterThan(0);
            const appointment: Element = allDayWrapper[1].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(62);
        });
    });

    describe('Checking vertical view all-day row appointment with showWeekend', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', showWeekend: false, selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment-wrapper'));
            expect(allDayWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointment: Element = allDayWrapper[0].querySelector('.e-appointment');
            expect((<HTMLElement>appointment).offsetTop).toEqual(62);
        });
    });

    describe('Vertical view all-day row appointment expand/collapse rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointmentCount: Element = allDayCountWrapper[0].querySelector('.e-more-indicator');
            expect((<HTMLElement>appointmentCount).getAttribute('data-count')).toEqual('2');
        });
    });

    describe('Vertical view all-day row appointment expand/collapse rendering in RTL mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', enableRtl: true, selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointmentCount: Element = allDayCountWrapper[0].querySelector('.e-more-indicator');
            expect((<HTMLElement>appointmentCount).getAttribute('data-count')).toEqual('2');
        });
    });

    describe('Vertical view all-day row appointment expand/collapse icon click', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 6) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment row expand', () => {
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            expect(expandElement.classList.contains('e-appointment-expand')).toEqual(true);
            util.triggerMouseEvent(expandElement, 'click');
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            expect(allDayCountWrapper[0].classList.contains('e-disable')).toEqual(true);
            const dateHeader: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            expect(dateHeader.classList.contains('e-all-day-scroll')).toEqual(false);
            expect(dateHeader.classList.contains('e-all-day-auto')).toEqual(true);
        });
        it('Checking appointment collapse', () => {
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            expect(expandElement.classList.contains('e-appointment-collapse')).toEqual(true);
            util.triggerMouseEvent(expandElement, 'click');
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointmentCount: Element = allDayCountWrapper[0].querySelector('.e-more-indicator');
            expect(allDayCountWrapper[0].classList.contains('e-disable')).toEqual(false);
            expect((<HTMLElement>appointmentCount).getAttribute('data-count')).toEqual('2');
            const dateHeader: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            expect(dateHeader.classList.contains('e-all-day-scroll')).toEqual(false);
            expect(dateHeader.classList.contains('e-all-day-auto')).toEqual(true);
        });
    });

    describe('Vertical view enableAllDayScroll Property check', () => {
        let schObj: Schedule;
        const allDayData: Record<string, any>[] = generateAllDayData(11);
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Week', height: '550px', width: '500px', enableAllDayScroll: true
            };
            schObj = util.createSchedule(model, allDayData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment row expand', () => {
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            expect(expandElement.classList.contains('e-appointment-expand')).toEqual(true);
            util.triggerMouseEvent(expandElement, 'click');
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            expect(allDayCountWrapper[0].classList.contains('e-disable')).toEqual(true);
            const dateHeader: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            expect(dateHeader.classList.contains('e-all-day-scroll')).toEqual(true);
            expect(dateHeader.classList.contains('e-all-day-auto')).toEqual(false);
        });
        it('Checking appointment collapse', () => {
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            expect(expandElement.classList.contains('e-appointment-collapse')).toEqual(true);
            util.triggerMouseEvent(expandElement, 'click');
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            const appointmentCount: Element = allDayCountWrapper[0].querySelector('.e-more-indicator');
            expect(allDayCountWrapper[0].classList.contains('e-disable')).toEqual(false);
            const dateHeader: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            expect(dateHeader.classList.contains('e-all-day-scroll')).toEqual(false);
            expect(dateHeader.classList.contains('e-all-day-auto')).toEqual(false);
            expect((<HTMLElement>appointmentCount).getAttribute('data-count')).toEqual('9');
        });

        it('Change property through set model', () => {
            schObj.enableAllDayScroll = false;
            schObj.dataBind();
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            util.triggerMouseEvent(expandElement, 'click');
            const dateHeader: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            expect(dateHeader.classList.contains('e-all-day-scroll')).toEqual(false);
            expect(dateHeader.classList.contains('e-all-day-auto')).toEqual(true);
        });

    });

    describe('Vertical view all-day row appointment expand/collapse with scroll support with scheduler height auto', () => {
        let schObj: Schedule;
        const allDayData: Record<string, any>[] = generateAllDayData(11);
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Week', height: 'auto', width: '500px', enableAllDayScroll: true
            };
            schObj = util.createSchedule(model, allDayData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment row expand with height auto', () => {
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            expect(expandElement.classList.contains('e-appointment-expand')).toEqual(true);
            util.triggerMouseEvent(expandElement, 'click');
            const allDayCountWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-row-count-wrapper'));
            expect(allDayCountWrapper[0].childElementCount).toBeGreaterThan(0);
            expect(allDayCountWrapper[0].classList.contains('e-disable')).toEqual(true);
            const dateHeader: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            expect(dateHeader.classList.contains('e-all-day-scroll')).toEqual(false);
            expect(dateHeader.classList.contains('e-all-day-auto')).toEqual(true);
            expect(dateHeader.style.maxHeight).toEqual('');
        });
        it('Change property through set model', () => {
            schObj.enableAllDayScroll = false;
            schObj.dataBind();
            const expandElement: HTMLElement = schObj.element.querySelector('.e-all-day-appointment-section') as HTMLElement;
            util.triggerMouseEvent(expandElement, 'click');
            const dateHeader: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            expect(dateHeader.classList.contains('e-all-day-scroll')).toEqual(false);
            expect(dateHeader.classList.contains('e-all-day-auto')).toEqual(true);
            expect(dateHeader.style.maxHeight).toEqual('');
        });
    });

    describe('Vertical view resource grouping appointment rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment element', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toBeGreaterThan(0);
        });

        it('Public method isSlotAvailable checking with resource', () => {
            const startDate: Date = new Date(2018, 3, 1, 10, 30);
            const endDate: Date = new Date(2018, 3, 1, 12, 0);
            const resourceIndex: number = 1;
            expect(schObj.isSlotAvailable(startDate, endDate, resourceIndex)).toEqual(false);
        });

        it('CRUD add actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[427] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            expect(schObj.eventsData.length).toEqual(9);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const recObj: RecurrenceEditor = (dialogElement.querySelector('.e-recurrenceeditor') as EJ2Instance).
                ej2_instances[0] as RecurrenceEditor;
            recObj.value = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
            recObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('CRUD edit actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_10"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(10);
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('CRUD delete actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(9);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_10"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(10);
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DELETE_EVENT_CLASS);
            deleteButton.click();
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-delete'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
        });
    });

    describe('Vertical view resource grouping appointment rendering byDate', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment element', () => {
            const appElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appElement.length).toBeGreaterThan(0);
        });

        it('CRUD add actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[427] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            expect(schObj.eventsData.length).toEqual(9);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const recObj: RecurrenceEditor = (dialogElement.querySelector('.e-recurrenceeditor') as EJ2Instance).
                ej2_instances[0] as RecurrenceEditor;
            recObj.value = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
            recObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('CRUD edit actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_10"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(10);
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('CRUD delete actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(9);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_10"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(10);
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const deleteButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.DELETE_EVENT_CLASS);
            deleteButton.click();
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-delete'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
        });

        it('CRUD multiple event delete actions checking', (done: DoneFn) => {
            const data: Record<string, any>[] = [resourceData[0], resourceData[3]];
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(7);
                done();
            };
            expect(schObj.eventsData.length).toEqual(9);
            schObj.deleteEvent(data);
        });
    });

    describe('Vertical view resource grouping appointment rendering allowGroupEdit', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2018, 3, 1),
                group: {
                    allowGroupEdit: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: true,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, resourceGroupData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment element', () => {
            const appElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appElement.length).toBeGreaterThan(0);
        });

        it('CRUD add actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(19);
                expect(schObj.eventsData[18].Subject).toEqual('Add title');
                expect(schObj.eventsData[18].Location).toEqual(undefined);
                expect(schObj.element.querySelectorAll('[data-id ="Appointment_19"]').length).toEqual(3);
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[430] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            expect(schObj.eventsData.length).toEqual(18);
            const dialogElement: Element = schObj.eventWindow.dialogObject.element;
            const endTimeObj: DateTimePicker = (dialogElement.querySelector('.e-end') as EJ2Instance).ej2_instances[0] as DateTimePicker;
            endTimeObj.value = new Date(2018, 3, 4, 11, 30);
            endTimeObj.dataBind();
            const resourceElements: NodeListOf<Element> = dialogElement.querySelectorAll('.e-multiselect.e-control');
            const roomObj: MultiSelect = (resourceElements[0] as EJ2Instance).ej2_instances[0] as MultiSelect;
            roomObj.value = [1, 2];
            roomObj.dataBind();
            const ownerObj: MultiSelect = (resourceElements[1] as EJ2Instance).ej2_instances[0] as MultiSelect;
            ownerObj.value = [1, 2, 3];
            ownerObj.dataBind();
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });

        it('CRUD edit actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(19);
                expect(schObj.eventsData[18].Subject).toEqual('Testing');
                expect(schObj.eventsData[18].Location).toEqual('Paris');
                expect(schObj.element.querySelectorAll('[data-id ="Appointment_19"]').length).toEqual(3);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_19"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(19);
            const dialogElement: Element = schObj.eventWindow.dialogObject.element;
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Testing';
            (dialogElement.querySelector('.e-location') as HTMLInputElement).value = 'Paris';
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS)).click();
        });

        it('CRUD delete actions checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(18);
                expect(schObj.element.querySelectorAll('[data-id ="Appointment_19"]').length).toEqual(0);
                done();
            };
            const appElement: HTMLElement = schObj.element.querySelectorAll('[data-id ="Appointment_19"]')[1] as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            expect(schObj.eventsData.length).toEqual(19);
            (schObj.eventWindow.dialogObject.element.querySelector('.' + cls.DELETE_EVENT_CLASS) as HTMLInputElement).click();
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-delete'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
        });
    });

    describe('schedule`s (start/end)Hour and appointment`s (end/start)Time is same', () => {
        let schObj: Schedule;
        const eventsDatas: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Test event-1',
            StartTime: new Date(2017, 10, 2, 8),
            EndTime: new Date(2017, 10, 2, 9)
        }, {
            Id: 2,
            Subject: 'Test event-2',
            StartTime: new Date(2017, 10, 1, 8),
            EndTime: new Date(2017, 10, 1, 13)
        }, {
            Id: 3,
            Subject: 'Test event-3',
            StartTime: new Date(2017, 10, 2, 12),
            EndTime: new Date(2017, 10, 2, 13)
        }, {
            Id: 4,
            Subject: 'Test event-4',
            StartTime: new Date(2017, 10, 3, 8),
            EndTime: new Date(2017, 10, 3, 10)
        }, {
            Id: 5,
            Subject: 'Test event-5',
            StartTime: new Date(2017, 10, 3, 11),
            EndTime: new Date(2017, 10, 3, 13)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2017, 10, 2), startHour: '08:00', endHour: '13:00' };
            schObj = util.createSchedule(model, eventsDatas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking appointment presents after change start and endHour', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(3);
                const app1: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_2"]') as HTMLElement;
                expect(app1.querySelectorAll('.e-indicator').length).toEqual(2);
                expect(app1.querySelectorAll('.e-indicator')[0].classList.contains('e-up-icon')).toBe(true);
                expect(app1.querySelectorAll('.e-indicator')[1].classList.contains('e-down-icon')).toBe(true);
                const app2: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_4"]') as HTMLElement;
                expect(app2.querySelectorAll('.e-indicator').length).toEqual(1);
                expect(app2.querySelectorAll('.e-indicator')[0].classList.contains('e-up-icon')).toBe(true);
                expect(app2.querySelectorAll('.e-indicator')[0].classList.contains('e-down-icon')).toBe(false);
                const app3: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_5"]') as HTMLElement;
                expect(app3.querySelectorAll('.e-indicator').length).toEqual(1);
                expect(app3.querySelectorAll('.e-indicator')[0].classList.contains('e-up-icon')).toBe(false);
                expect(app3.querySelectorAll('.e-indicator')[0].classList.contains('e-down-icon')).toBe(true);
                done();
            };
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(5);
            schObj.startHour = '09:00';
            schObj.endHour = '12:00';
            schObj.dataBind();
        });
    });

    describe('checking appointment with start and endTime 12.00 AM in same date', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Test event',
            StartTime: new Date(2017, 10, 2, 0),
            EndTime: new Date(2017, 10, 2, 0)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('appointment element present in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(1);
        });
    });

    describe('EJ2-11284 Events start and end on same time', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Test event',
            StartTime: new Date(2017, 10, 2, 10),
            EndTime: new Date(2017, 10, 2, 10)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('appointment element present in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(1);
        });
    });

    describe('EJ2-12691 - Yearly recurrence appointments are not displaying properly', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Yearly Recurrence Event',
            StartTime: new Date(2022, 11, 4, 10),
            EndTime: new Date(2022, 11, 4, 11, 30),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=YEARLY;BYDAY=SU;BYSETPOS=1;BYMONTH=12;INTERVAL=1'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2022, 11, 5) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('current year(2022) appointment element checking in DOM', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
        });

        it('next year(2023) appointment element checking in DOM', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2023, 11, 5);
            schObj.dataBind();
        });

        it('other year(2025) appointment element checking in DOM', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2025, 11, 10);
            schObj.dataBind();
        });
    });

    describe('EJ2-47668 - Issue in rendering of scheduler event height based on the DST timezone', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2021, 2, 27, 11, 0),
            EndTime: new Date(2021, 2, 28, 7, 0)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', firstDayOfWeek: 1, selectedDate: new Date(2021, 2, 25) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking dst event height', () => {
            const eventNormalElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventNormalElementList.length).toEqual(2);
            expect((eventNormalElementList[0] as HTMLElement).style.height).toBe('936px');
            expect((eventNormalElementList[1] as HTMLElement).style.height).toBe('504px');
        });
    });

    describe('Resize handler dimension checking', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Meeting',
            StartTime: new Date(2021, 2, 27, 11, 0),
            EndTime: new Date(2021, 2, 27, 11, 15)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '550px', selectedDate: new Date(2021, 2, 25) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking appointment resize handler height', () => {
            const appElement: HTMLElement = schObj.element.querySelector('.e-appointment');
            expect((appElement.querySelector('.e-event-resize.e-top-handler') as HTMLElement).offsetHeight).toEqual(2);
            expect((appElement.querySelector('.e-event-resize.e-bottom-handler') as HTMLElement).offsetHeight).toEqual(2);
        });
    });

    describe('Schedule week view appointment template checking', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Week', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 2),
                eventSettings: { template: '<span>${Subject}</span>' }
            };
            schObj = util.createSchedule(model, testBlockData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('elements in DOM', () => {
            const eventBlockedElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-block-appointment'));
            expect(eventBlockedElementList.length).toEqual(1);
            const eventNormalElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventNormalElementList.length).toEqual(5);
        });
    });

    describe('minimumEventDuration property', () => {
        let schObj: Schedule;
        const appointments: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Paris',
            StartTime: new Date(2017, 10, 1, 10, 0),
            EndTime: new Date(2017, 10, 1, 10, 3),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'Meeting',
            StartTime: new Date(2017, 10, 1, 10, 0),
            EndTime: new Date(2017, 10, 1, 10, 45),
            IsAllDay: false
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 1),
                eventSettings: { minimumEventDuration: 30 }
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment height by setting minimumEventDuration property to 30 minutes', () => {
            const appointmentWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(appointmentWrapper[3].childElementCount).toEqual(2);
            const firstEvent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_1"]');
            expect(firstEvent.style.height).toEqual('36px');
            const secondEvent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_2"]');
            expect(secondEvent.style.height).toEqual('54px');
        });
        it('Checking appointment height by setting minimumEventDuration property to 1 minute (default)', () => {
            schObj.dataBound = null;
            schObj.eventSettings.minimumEventDuration = 1;
            schObj.dataBind();
            const appointmentWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(appointmentWrapper[3].childElementCount).toEqual(2);
            const firstEvent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_1"]');
            expect(firstEvent.style.height).toEqual('3.6px');
            const secondEvent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_2"]');
            expect(secondEvent.style.height).toEqual('54px');
        });
    });

    describe('allowInline property', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: Function) => {
            const model: ScheduleModel = {
                currentView: 'Week', views: [
                    { option: 'Week' },
                    { option: 'TimelineWeek' },
                    { option: 'Month' },
                    { option: 'Agenda' }
                ], height: '550px', width: '500px',
                allowInline: true, selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, defaultData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking allowInline property', (done: Function) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(24);
                expect((eventElementList[6].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Testing');
                expect(eventElementList[6].getAttribute('aria-grabbed')).toEqual('true');
                done();
            };
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[126] as HTMLElement;
            workCell.click();
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Testing';
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });

        });

        it('Checking allowInline edit action', (done: Function) => {
            schObj.dataBound = () => {
                const eventElement: Element = schObj.element.querySelector('[data-id="Appointment_44"]');
                expect(eventElement).toBeTruthy();
                expect((eventElement.querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Testing - edited');
                done();
            };
            const eventElement: Element = schObj.element.querySelector('[data-id="Appointment_44"]');
            expect(eventElement).toBeTruthy();
            const subjectElement: HTMLElement = eventElement.querySelector('.e-subject') as HTMLElement;
            subjectElement.click();
            const inputElement: HTMLInputElement = eventElement.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Testing - edited';
            keyModule.keyActionHandler({ action: 'enter', target: inputElement });
        });

        it('Checking allowInline allDay event', (done: Function) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect((eventElementList[0].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('week');
                expect(eventElementList[0].getAttribute('aria-grabbed')).toEqual('true');
                done();
            };
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(24);
            (schObj.element.querySelectorAll('.e-all-day-cells')[1] as HTMLElement).click();
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'week';
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
        });

        it('Changing current view to timeline week view', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
        });

        it('Checking allowInline event in timeline week view', (done: Function) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(26);
                expect((eventElementList[2].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('timeline');
                expect(eventElementList[2].getAttribute('aria-grabbed')).toEqual('true');
                done();
            };
            (schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement).click();
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'timeline';
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
        });

        it('Changing current view to Agenda', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(23);
                done();
            };
            schObj.currentView = 'Agenda';
            schObj.dataBind();
        });

        it('Checking allowInline edit action in Agenda view', (done: Function) => {
            schObj.dataBound = () => {
                const eventElement: Element = schObj.element.querySelector('[data-id="Appointment_19"]');
                expect(eventElement).toBeTruthy();
                expect((eventElement.querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Agenda view testing');
                done();
            };
            const eventElement: Element = schObj.element.querySelector('[data-id="Appointment_19"]');
            expect(eventElement).toBeTruthy();
            const subjectElement: HTMLElement = eventElement.querySelector('.e-subject') as HTMLElement;
            subjectElement.click();
            const inputElement: HTMLInputElement = eventElement.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Agenda view testing';
            keyModule.keyActionHandler({ action: 'enter', target: inputElement });
        });

        xit('Changing current view to Month', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(30);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        xit('Checking allowInline add action in Month view', (done: Function) => {
            schObj.dataBound = () => {
                const eventElement: Element = schObj.element.querySelector('[data-id="Appointment_47"]');
                expect(eventElement).toBeTruthy();
                expect((eventElement.querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Month view testing');
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelector('[data-date="1511461800000"]') as HTMLElement;
            workCell.click();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Month view testing';
            keyModule.keyActionHandler({ action: 'enter', target: inputElement });
        });

        xit('Checking allowInline edit action in Month view', (done: Function) => {
            schObj.dataBound = () => {
                const eventElement: Element = schObj.element.querySelector('[data-id="Appointment_47"]');
                expect(eventElement).toBeTruthy();
                expect((eventElement.querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Month view testing edited');
                done();
            };
            const eventElement: Element = schObj.element.querySelector('[data-id="Appointment_47"]');
            expect(eventElement).toBeTruthy();
            const subjectElement: HTMLElement = eventElement.querySelector('.e-subject') as HTMLElement;
            subjectElement.click();
            const inputElement: HTMLInputElement = eventElement.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Month view testing edited';
            keyModule.keyActionHandler({ action: 'enter', target: inputElement });
        });
    });

    describe('EJ2-50899 - Appointments are not rendering in vertical views with group resources in mobile mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2018, 3, 1),
                enableAdaptiveUI: true,
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', RoomId: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' },
                        { OwnerText: 'Smith', OwnerId: 4, OwnerGroupId: 3, color: '#5978ee' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking appointment rendering', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                done();
            };
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-hours') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            expect(schObj.eventsData.length).toEqual(9);
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Testing-1';
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('Select other resource and checking appointment rendering', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(11);
                done();
            };
            expect(schObj.eventsData.length).toEqual(10);
            schObj.selectResourceByIndex(2);
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-hours') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Testing-2';
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });

        it('Select other resource and checking appointment rendering', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(12);
                done();
            };
            expect(schObj.eventsData.length).toEqual(11);
            schObj.selectResourceByIndex(3);
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-hours') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-subject') as HTMLInputElement).value = 'Testing-3';
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
        });
    });

    describe('EJ2-51853 - Schedule events overlapping when same start and end time', () => {
        let schObj: Schedule;
        const eventsData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Test event-1',
            StartTime: new Date(2017, 10, 1, 9),
            EndTime: new Date(2017, 10, 1, 9)
        }, {
            Id: 2,
            Subject: 'Test event-2',
            StartTime: new Date(2017, 10, 1, 9),
            EndTime: new Date(2017, 10, 1, 9)
        }, {
            Id: 3,
            Subject: 'Test event-3',
            StartTime: new Date(2017, 10, 1, 9),
            EndTime: new Date(2017, 10, 1, 10)
        }, {
            Id: 4,
            Subject: 'Test event-4',
            StartTime: new Date(2017, 10, 1, 10),
            EndTime: new Date(2017, 10, 1, 10)
        }, {
            Id: 5,
            Subject: 'Test event-5',
            StartTime: new Date(2017, 10, 1, 10),
            EndTime: new Date(2017, 10, 1, 10)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Week', height: '550px', width: '500px', selectedDate: new Date(2017, 10, 2)
            };
            schObj = util.createSchedule(model, eventsData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking events overlapping', () => {
            const eventNormalElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventNormalElementList.length).toEqual(5);
            expect((eventNormalElementList[0] as HTMLElement).style.left).toBe('0%');
            expect((eventNormalElementList[1] as HTMLElement).style.left).toBe('31.3333%');
            expect((eventNormalElementList[2] as HTMLElement).style.left).toBe('62.6667%');
            expect((eventNormalElementList[3] as HTMLElement).style.left).toBe('0%');
            expect((eventNormalElementList[4] as HTMLElement).style.left).toBe('47%');
        });
    });

    describe('EJ2-52479 - Appointment missing when showWeekend is false', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Burning Man',
            StartTime: '2018-06-09T09:30:00.000Z',
            EndTime: '2018-06-09T11:30:00.000Z',
            OwnerId: 1,
            IsBlock: false
        },
        {
            Id: 2,
            Subject: 'Marketing Forum',
            StartTime: '2018-06-03T04:30:00.000Z',
            EndTime: '2018-06-03T06:00:00.000Z',
            OwnerId: 2,
            IsBlock: true
        }, {
            Id: 3,
            Subject: 'Business Factory',
            StartTime: '2018-06-03T08:00:00.000Z',
            EndTime: '2018-06-03T09:30:00.000Z',
            OwnerId: 3,
            IsBlock: true
        }, {
            Id: 4,
            Subject: 'Burning Man1',
            StartTime: '2018-06-04T06:00:00.000Z',
            EndTime: '2018-06-04T07:30:00.000Z',
            OwnerId: 1,
            IsBlock: true
        }, {
            Id: 5,
            Subject: 'Funnel Hacking',
            StartTime: '2018-06-05T04:00:00.000Z',
            EndTime: '2018-06-05T05:30:00.000Z',
            OwnerId: 3,
            IsBlock: true
        }
        ];
        const ownerCollections: Record<string, any>[] = [
            { OwnerText: 'Margaret', OwnerId: 1, Color: '#ea7a57', workDays: [1, 2, 3, 4, 5, 6] },
            { OwnerText: 'Robert', OwnerId: 2, Color: '#df5286' },
            { OwnerText: 'Laura', OwnerId: 3, Color: '#865fcf' }
        ];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                showWeekend: false,
                selectedDate: new Date(2018, 5, 5),
                group: {
                    resources: ['Owners']
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owners', name: 'Owners', allowMultiple: true,
                        dataSource: ownerCollections, textField: 'OwnerText', idField: 'OwnerId',
                        colorField: 'Color', workDaysField: 'workDays'
                    }
                ],
                eventSettings: {
                    dataSource: data
                }
            };
            schObj = util.createSchedule(schOptions, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking appointment rendering', () => {
            expect(schObj.eventsData.length).toEqual(5);
            const eventList: Element = schObj.element.querySelector('.e-appointment');
            expect(eventList.querySelector('.e-subject').innerHTML).toBe('Burning Man');
        });

    });

    describe('EJ2-56503 - Vertical view event rendered arguments checking', () => {
        let schObj: Schedule;
        const sampleData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 8, 10),
            EndTime: new Date(2017, 10, 8, 12)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                views: ['Week'],
                height: 'auto', width: '100%',
                selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, sampleData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking event rendered event args', (done: DoneFn) => {
            schObj.eventRendered = (args: EventRenderedArgs) => {
                expect((args.data[schObj.eventFields.startTime] as Date).getTime()).toEqual(new Date(2017, 10, 8, 10).getTime());
                expect((args.data[schObj.eventFields.endTime] as Date).getTime()).toEqual(new Date(2017, 10, 8, 12).getTime());
                expect(args.data.data).toBeTruthy();
                done();
            };
            schObj.refreshEvents();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
