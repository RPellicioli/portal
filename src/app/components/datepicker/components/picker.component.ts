import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { startOfMonth, endOfMonth, addMonths, subMonths, setYear, eachDay, getDate, getMonth, getYear, isToday, isSameDay, isSameMonth, isSameYear, format, getDay, subDays, setDay } from 'date-fns';
import { ISlimScrollOptions } from 'ngx-slimscroll';
import * as moment from 'moment';

export type AddClass = string | string[] | { [k: string]: boolean } | null;

export interface PickerOptions {
	minYear?: number; // default: current year - 30
	maxYear?: number; // default: current year + 30
	maskFormat?: string
	displayFormat?: string; // default: 'MMM D[,] YYYY'
	barTitleFormat?: string; // default: 'MMMM YYYY'
	dayNamesFormat?: string; // default 'ddd'
	barTitleIfEmpty?: string;
	firstCalendarDay?: number; // 0 = Sunday (default), 1 = Monday, ..
	locale?: object;
	minDate?: Date;
	maxDate?: Date;
	/** Placeholder for the input field */
	placeholder?: string;
	/** [ngClass] to add to the input field */
	addClass?: AddClass;
	/** [ngStyle] to add to the input field */
	addStyle?: {
		[k: string]: any
	} | null;
	/** ID to assign to the input field */
	fieldId?: string;
	/** If false, barTitleIfEmpty will be disregarded and a date will always be shown. Default: true */
	useEmptyBarTitle?: boolean;
}

let counter = 0;

const isNil = (value: Date | PickerOptions) => {
	return (typeof value === 'undefined') || (value === null);
};

@Component({
	selector: 'picker',
	templateUrl: 'picker.component.html',
	styleUrls: ['picker.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => PickerComponent),
		multi: true
	}]
})
export class PickerComponent implements ControlValueAccessor, OnInit, OnChanges {
	@Input() public options: PickerOptions;
	@Input() public headless = false;
	@Input() public isOpened = false;
	@Input() public position = 'bottom-right';

	private positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
	public innerValue: Date;
	public displayValue: string;
	public displayFormat: string;
	public maskFormat: string;
	public date: Date;
	public barTitle: string;
	public barTitleFormat: string;
	public barTitleIfEmpty: string;
	public minYear: number;
	public maxYear: number;
	public firstCalendarDay: number;
	public view: string;
	public years: { year: number; isThisYear: boolean }[];
	public dayNames: string[];
	public dayNamesFormat: string;
	public scrollOptions: ISlimScrollOptions;
	public days: {
		date: Date;
		day: number;
		month: number;
		year: number;
		inThisMonth: boolean;
		isToday: boolean;
		isSelected: boolean;
		isSelectable: boolean;
	}[];
	public locale: object;
	public placeholder: string;
	public addClass: AddClass;
	public addStyle: { [k: string]: any } | null;
	public fieldId: string;
	public useEmptyBarTitle: boolean;
	public disabled: boolean;
	private onTouchedCallback: () => void = () => { };
	private onChangeCallback: (_: any) => void = () => { };
	public setDisabledState(isDisabled: boolean) {
		this.disabled = isDisabled;
	}

	public get value(): Date {
		return this.innerValue;
	}
	public set value(val: Date) {
		this.innerValue = val;
		this.onChangeCallback(this.innerValue);
	}

	constructor(private elementRef: ElementRef) {
		this.scrollOptions = {
			barBackground: '#DFE3E9',
			gridBackground: '#FFFFFF',
			barBorderRadius: '3',
			gridBorderRadius: '3',
			barWidth: '6',
			gridWidth: '6',
			barMargin: '0',
			gridMargin: '0'
		};
	}

	public ngOnInit(): void {
		this.view = 'days';
		this.date = new Date();
		this.setOptions();
		this.initDayNames();
		this.initYears();

		if (this.positions.indexOf(this.position) === -1) {
			throw new TypeError(`ng-datepicker: invalid position property value '${this.position}' (expected: ${this.positions.join(', ')})`);
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if ('options' in changes) {
			this.setOptions();
			this.initDayNames();
			this.init();
			this.initYears();
		}
	}

	public get defaultFieldId(): string {
		const value = `datepicker-${counter++}`;
		Object.defineProperty(this, 'defaultFieldId', { value });
		return value;
	}

	public setOptions(): void {
		const today = new Date();
		this.minYear = this.options && this.options.minYear || getYear(today) - 30;
		this.maxYear = this.options && this.options.maxYear || getYear(today) + 30;
		this.displayFormat = this.options && this.options.displayFormat || 'MMM D[,] YYYY';
		this.maskFormat = this.options && this.options.maskFormat || '00/00/0000';
		this.barTitleFormat = this.options && this.options.barTitleFormat || 'MMMM YYYY';
		this.dayNamesFormat = this.options && this.options.dayNamesFormat || 'ddd';
		this.barTitleIfEmpty = this.options && this.options.barTitleIfEmpty || 'Click to select a date';
		this.firstCalendarDay = this.options && this.options.firstCalendarDay || 0;
		this.locale = this.options && { locale: this.options.locale } || {};
		this.placeholder = this.options && this.options.placeholder || '';
		this.addClass = this.options && this.options.addClass || {};
		this.addStyle = this.options && this.options.addStyle || {};
		this.fieldId = this.options && this.options.fieldId || this.defaultFieldId;
		this.useEmptyBarTitle = this.options && 'useEmptyBarTitle' in this.options ? this.options.useEmptyBarTitle : true;
	}

	public nextMonth(): void {
		this.date = addMonths(this.date, 1);
		this.init();
	}

	public prevMonth(): void {
		this.date = subMonths(this.date, 1);
		this.init();
	}

	public setDate(i: number): void {
		this.date = this.days[i].date;
		this.value = this.date;
		this.init();
		this.close();
	}

	public setYear(i: number): void {
		this.date = setYear(this.date, this.years[i].year);
		this.init();
		this.initYears();
		this.view = 'days';
	}

	private isDateSelectable(date: Date): boolean {
		if (isNil(this.options)) {
			return true;
		}
		const minDateSet = !isNil(this.options.minDate);
		const maxDateSet = !isNil(this.options.maxDate);
		const timestamp = date.valueOf();
		if (minDateSet && (timestamp < this.options.minDate.valueOf())) {
			return false;
		}
		if (maxDateSet && (timestamp > this.options.maxDate.valueOf())) {
			return false;
		}
		return true;
	}

	public init(): void {
		const actualDate = this.date || new Date();
		const start = startOfMonth(actualDate);
		const end = endOfMonth(actualDate);
		this.days = eachDay(start, end).map(date => {
			return {
				date: date,
				day: getDate(date),
				month: getMonth(date),
				year: getYear(date),
				inThisMonth: true,
				isToday: isToday(date),
				isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
				isSelectable: this.isDateSelectable(date)
			};
		});
		const tmp = getDay(start) - this.firstCalendarDay;
		const prevDays = tmp < 0 ? 7 - this.firstCalendarDay : tmp;
		for (let i = 1; i <= prevDays; i++) {
			const date = subDays(start, i);
			this.days.unshift({
				date: date,
				day: getDate(date),
				month: getMonth(date),
				year: getYear(date),
				inThisMonth: false,
				isToday: isToday(date),
				isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
				isSelectable: this.isDateSelectable(date)
			});
		}
		if (this.innerValue) {
			this.displayValue = format(this.innerValue, this.displayFormat, this.locale);
			this.barTitle = format(start, this.barTitleFormat, this.locale);
		} else {
			this.displayValue = '';
			this.barTitle = this.useEmptyBarTitle ? this.barTitleIfEmpty : format(start, this.barTitleFormat, this.locale);
		}
	}

	public initYears(): void {
		const range = this.maxYear - this.minYear;
		this.years = Array.from(new Array(range), (x, i) => i + this.minYear).map(year => {
			return {
				year: year,
				isThisYear: year === getYear(this.date)
			};
		});
	}

	public initDayNames(): void {
		this.dayNames = [];
		const start = this.firstCalendarDay;
		for (let i = start; i <= 6 + start; i++) {
			const date = setDay(new Date(), i);
			this.dayNames.push(format(date, this.dayNamesFormat, this.locale));
		}
	}

	public toggleView(): void {
		this.view = this.view === 'days' ? 'years' : 'days';
	}

	public toggle(): void {
		this.isOpened = !this.isOpened;
		if (!this.isOpened && this.view === 'years') {
			this.toggleView();
		}
	}

	public close(): void {
		this.isOpened = false;
		if (this.view === 'years') {
			this.toggleView();
		}
	}

	public reset(fireValueChangeEvent = false): void {
		this.displayValue = '';
		this.date = null;
		this.innerValue = null;
		this.init();
		if (fireValueChangeEvent && this.onChangeCallback) {
			this.onChangeCallback(this.innerValue);
		}
	}

	public writeValue(val: Date) {
		if (val) {
			this.date = val;
			this.innerValue = val;
			this.init();
			this.displayValue = format(this.innerValue, this.displayFormat, this.locale);
			this.barTitle = format(startOfMonth(val), this.barTitleFormat, this.locale);
		} else {
			this.date = null;
			this.innerValue = null;
			this.init();
			this.displayValue = '';
			this.barTitle = '';
		}
	}

	public registerOnChange(fn: any): void {
		this.onChangeCallback = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouchedCallback = fn;
	}

	public pickerTextKeyUp(): void {
		this.handleTypedDate();
	}

	public pickerChange(): void {
		if (this.displayValue.length === this.maskFormat.length) {
			this.handleTypedDate();
		} else {
			this.reset(true);
			this.init();
			this.close();
		}
	}

	private handleTypedDate(): void {
		if (this.displayValue.length === this.maskFormat.length) {
			const momentDate: moment.Moment = moment(this.displayValue, this.displayFormat, true);
			if (momentDate.isValid()) {
				this.date = momentDate.toDate();
				this.value = this.date;
				this.init();
			} else {
				this.reset(true);
				this.init();
			}
		} else {
			this.date = null;
			this.value = null;
		}
	}

	public onFocus(): void {
		if (!this.isOpened) {
			this.toggle();
		}
	}

	@HostListener('document:click', ['$event']) public onBlur(e: MouseEvent): void {
		if (!this.isOpened) {
			return;
		}

		const input = this.elementRef.nativeElement.querySelector('.picker-input');
		if (input == null) {
			return;
		}
		if (e.target === input || input.contains(<any>e.target)) {
			return;
		}

		const container = this.elementRef.nativeElement.querySelector('.picker-calendar-container');
		if (container && container !== e.target && !container.contains(<any>e.target) && !(<any>e.target).classList.contains('year-unit')) {
			this.close();
		}
	}
}