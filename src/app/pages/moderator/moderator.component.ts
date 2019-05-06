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
    
    public buildForms(): void {
        this.moderatorForm = this.formBuilder.group({
            name: ['', Validators.required],
            birthday: ['', Validators.required],
            age: ['', Validators.required],
            institutionId: ['', Validators.required],
            profission: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            initPeriod: ['', Validators.required],
            toPeriod: ['', Validators.required],
            experience: [''],
            protocol: ['']
        });
    }

    public reset(): void {
        this.moderatorForm.controls['name'].setValue("");
        this.moderatorForm.controls['birthday'].setValue("");
        this.moderatorForm.controls['age'].setValue(null);
        this.moderatorForm.controls['institutionId'].setValue(null);
        this.moderatorForm.controls['profission'].setValue(null);
        this.moderatorForm.controls['email'].setValue("");
        this.moderatorForm.controls['initPeriod'].setValue("");
        this.moderatorForm.controls['toPeriod'].setValue("");
        this.moderatorForm.controls['protocol'].setValue("");

        FormsUtils.unTouchFormControls(this.moderatorForm);
    }

    public inputHasError(formControlName: string, validationAttrs?: Array<string>): boolean {
        return FormsUtils.inputHasError(this.moderatorForm, formControlName, validationAttrs);      
    }

    public selectModerator(value: Moderator): void {
        this.selected = value;
        this.fillForms(value);
    }

    public validName(): boolean {
        const moderators = this.moderatorService.list.filter(m => m.name.toLocaleLowerCase() == this.moderatorForm.controls['name'].value.toLocaleLowerCase());
        
        if(moderators.length > 0) { 
            alert("Já existe um moderador cadastrado com esse nome");
            return false 
        };

        return true;
    }

    public add(): void {
        if(this.moderatorForm.valid && this.validPeriod() && this.validName()){
            let postData = this.createRequestData();
            postData.id = this.moderatorService.list.length;
            postData.protocol = this.fib(postData.id + 4);

            this.moderatorService.push(postData);
            this.reset();
            alert("Moderador cadastrado com sucesso");
        }
        else {
            FormsUtils.touchFormControls(this.moderatorForm);
        }
    }

    public update(): void {
        if(this.moderatorForm.valid && this.selected && this.validPeriod()){
            let postData = this.createRequestData();

            var moderator = this.moderatorService.list.find(i => i.id == this.selected.id);
            moderator.id = this.selected.id;
            moderator.name = postData.name;
            moderator.birthday = postData.birthday;
            moderator.age = postData.age;
            moderator.institutionId = postData.institutionId;
            moderator.profission = postData.profission;
            moderator.email = postData.email;
            moderator.initPeriod = postData.initPeriod;
            moderator.toPeriod = postData.toPeriod;
            moderator.experience = postData.experience;
            moderator.protocol = postData.protocol;

            alert("Moderador atualizado");
        }
        else {
            FormsUtils.touchFormControls(this.moderatorForm);
        }
    }

    public delete(): void {
        if(!this.selected) return;

        this.moderatorService.delete(this.selected.id);
        this.reset();
        alert("Moderador excluído com sucesso");
    }

    public birthdayChange($event): void {
        let birthday = new Date($event);
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        let age = Math.abs(ageDate.getUTCFullYear() - 1970);
        
        if(!isNaN(age)){
            if(age < 18 || age > 120){
                alert("Sua idade deve estar em 18 a 120 anos");
                this.moderatorForm.controls['age'].setValue(null);
            }
            else{
                this.moderatorForm.controls['age'].setValue(age);
            }
        }
    }

    public fib(n: number): number{
        let arr = [0, 1];
        for (let i = 2; i < n + 1; i++){
            arr.push(arr[i - 2] + arr[i -1])
        }

        return arr[n]
    }

    public fillForms(moderator: Moderator): void {
        if (moderator) {
            FormsUtils.autoFillForm(this.moderatorForm, moderator);

            if (moderator.birthday) {
                let date = new Date(moderator.birthday);
                date.setDate(date.getDate() + 1);

                this.moderatorForm.controls.birthday.setValue(new Date(date));
            }

            if (moderator.initPeriod) {
                let dateInit = new Date(moderator.initPeriod);
                dateInit.setDate(dateInit.getDate() + 1);

                this.moderatorForm.controls.initPeriod.setValue(new Date(dateInit));
            }

            if (moderator.toPeriod) {
                let dateTo = new Date(moderator.toPeriod);
                dateTo.setDate(dateTo.getDate() + 1);

                this.moderatorForm.controls.toPeriod.setValue(new Date(dateTo));
            }
        }
    }

    public validPeriod(): boolean {
        if(!this.moderatorForm.controls['initPeriod'].value || !this.moderatorForm.controls['toPeriod'].value){
            return false;
        }
        
        const init = new Date(this.moderatorForm.controls['initPeriod'].value);
        const to = new Date(this.moderatorForm.controls['toPeriod'].value);

        const today = new Date();
        const myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

        if(init.getTime() < myToday.getTime()){
            alert("A data inicial do periodo deve ser maior que a data de hoje");
            return false;
        }

        if (init.getTime() > to.getTime()) {
            alert("A data final do periodo deve ser maior que a inicial");
            return false;
        }

        return true;
    }

    private createRequestData(): Moderator {
        let birthday = (this.moderatorForm.controls.birthday.value as Date).toISOString().split('T')[0];
        let initPeriod = (this.moderatorForm.controls.initPeriod.value as Date).toISOString().split('T')[0];
        let toPeriod = (this.moderatorForm.controls.toPeriod.value as Date).toISOString().split('T')[0];
        let moderator = FormsUtils.formToModel<Moderator>(this.moderatorForm, Moderator);

        moderator.birthday = birthday;
        moderator.initPeriod = initPeriod;
        moderator.toPeriod = toPeriod;
        
        return moderator;
    }
}
