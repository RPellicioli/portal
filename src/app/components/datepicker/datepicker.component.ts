import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as ptLocale from 'date-fns/locale/pt';
import { PickerOptions } from './components/picker.component';

export const VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => DatePickerComponent),
	multi: true
};

@Component({
	selector: 'datepicker',
	providers: [VALUE_ACCESSOR],
	templateUrl: 'datepicker.component.html',
	styleUrls: ['datepicker.component.scss']
})
export class DatePickerComponent {
	public propagateChange = (_: any) => { };
	public propagateTouch = () => { };

	@Input() public disabled: boolean;
	@Input() public date: Date;
	@Output() public dateChange: EventEmitter<Date> = new EventEmitter<Date>();
	@Input() public options: PickerOptions = {
		minYear: 1970,
		maxYear: 2050,
		maskFormat: '00/00/0000',
		displayFormat: 'DD/MM/YYYY',
		barTitleFormat: 'MMMM YYYY',
		dayNamesFormat: 'dd',
		firstCalendarDay: 0,
		locale: ptLocale,
		barTitleIfEmpty: '__/__/____',
		placeholder: '__/__/____',
		addClass: 'default-input',
		useEmptyBarTitle: false
	};

	public onChange($event: Date): void {
		this.date = $event;
		this.dateChange.emit($event);
		this.propagateTouch();
		this.propagateChange(this.date);
	}

	public writeValue(date: Date): void {
		this.date = date;
		this.dateChange.emit(this.date);
		this.propagateChange(this.date);
	}

	public registerOnChange(fn: any): void {
		this.dateChange.emit(this.date);
		this.propagateChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.propagateTouch = fn;
	}

	public setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}
}
