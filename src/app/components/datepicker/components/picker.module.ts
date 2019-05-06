import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { PickerComponent } from './picker.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
	declarations: [
		PickerComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		NgxMaskModule,
		NgSlimScrollModule
	],
	exports: [
		PickerComponent,
		CommonModule,
		FormsModule,
		NgSlimScrollModule
	]
})
export class PickerModule { }
