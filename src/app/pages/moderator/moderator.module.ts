import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModeratorComponent } from './moderator.component';
import { InstitutionService } from '../institution/service/institution.service';
import { ModeratorService } from './service/moderator.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    exports: [
        ModeratorComponent
    ],
    declarations: [
        ModeratorComponent
    ],
    providers: [
        InstitutionService,
        ModeratorService
    ]
})
export class ModeratorModule { }