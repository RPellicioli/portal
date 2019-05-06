import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgDatepickerModule } from "ng2-datepicker";
import { DatePickerComponent } from "./datepicker.component";
import { PickerModule } from "./components/picker.module";

@NgModule({
    imports: [
          CommonModule,
          FormsModule,
          PickerModule,
          NgDatepickerModule
    ],
    exports: [
          DatePickerComponent
    ],
    declarations: [
          DatePickerComponent
    ]
})
export class DatePickerModule { }