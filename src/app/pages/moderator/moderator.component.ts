import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstitutionService } from '../institution/service/institution.service';
import { FormsUtils } from 'src/app/utils/forms-utils';
import { Moderator } from 'src/app/models/moderator';
import { ModeratorService } from './service/moderator.service';

@Component({
    selector: 'moderator',
    templateUrl: './moderator.component.html',
    styleUrls: ['./moderator.component.scss']
})
export class ModeratorComponent implements OnInit {
    public moderatorForm: FormGroup;
    public selected: Moderator;
    
    constructor(
        private formBuilder: FormBuilder, 
        public institutionService: InstitutionService,
        public moderatorService: ModeratorService
    ) { }

    public ngOnInit(): void {
        this.buildForms();
    }
    
    private buildForms(): void {
        this.moderatorForm = this.formBuilder.group({
            name: ['', Validators.required],
            birthdate: ['', Validators.required],
            age: ['', ],
            institutionId: ['', Validators.required],
            profission: ['', Validators.required],
            email: ['', Validators.required],
            initPeriod: ['', Validators.required],
            toPeriod: ['', Validators.required],
            description: [''],
            protocol: ['']
        });
    }

    public inputHasError(formControlName: string, validationAttrs?: Array<string>): boolean {
        return FormsUtils.inputHasError(this.moderatorForm, formControlName, validationAttrs);      
    }

    public selectModerator(value: Moderator): void {
        this.selected = value;
        this.fillForms(value);
    }

    public add(): void {
        if(this.moderatorForm.valid){
            let postData = this.createRequestData();
            postData.id = this.moderatorService.list.length;

            this.moderatorService.push(postData);
            this.buildForms();
        }
        else {
            FormsUtils.touchFormControls(this.moderatorForm);
        }
    }

    public update(): void {
        if(this.moderatorForm.valid && this.selected){
            let postData = this.createRequestData();

            var moderator = this.moderatorService.list.find(i => i.id == this.selected.id);
            moderator.id = this.selected.id;
            moderator.name = postData.name;
        }
        else {
            FormsUtils.touchFormControls(this.moderatorForm);
        }
    }

    public delete(): void {
        if(!this.selected) return;

        this.moderatorService.delete(this.selected.id);
        this.buildForms();
    }

    public fillForms(moderator: Moderator): void {
        if (moderator) {
            FormsUtils.autoFillForm(this.moderatorForm, moderator);
        }
    }

    private createRequestData(): Moderator {
        return FormsUtils.formToModel<Moderator>(this.moderatorForm, Moderator);
    }
}
