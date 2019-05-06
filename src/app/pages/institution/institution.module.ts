import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { InstitutionComponent } from './institution.component';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from "ngx-mask";
import { ApiAddressService } from 'src/app/services/api-address.service';
import { InstitutionService } from './service/institution.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxMaskModule.forRoot()
    ],
    exports: [
        InstitutionComponent
    ],
    declarations: [
        InstitutionComponent
    ],
    providers: [
        ApiAddressService,
        InstitutionService
    ]
})
export class InstitutionModule { }