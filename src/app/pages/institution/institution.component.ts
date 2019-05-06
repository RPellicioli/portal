import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InstitutionService } from './service/institution.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Institution } from 'src/app/models/institution';
import { FormsUtils } from 'src/app/utils/forms-utils';
import { FormsValidators } from 'src/app/utils/forms-validators';
import { Address } from 'src/app/models/address';
import { ApiAddressService } from 'src/app/services/api-address.service';

@Component({
    selector: 'institution',
    templateUrl: './institution.component.html',
    styleUrls: ['./institution.component.scss']
})
export class InstitutionComponent implements OnInit {
    @ViewChild("inputNumber") public inputNumber: ElementRef;
    
    public institutionForm: FormGroup;
    public selected: Institution;
    public zipcodeMask: string = "00000-000";
    public cnpjMask: string = "00.000.000/0000-00";

    private _citiesStateId: number;
    private _suspendLoadStates: boolean;

    public cities: Address.City[];
    public states: Address.State[];

    constructor(
        private formBuilder: FormBuilder, 
        public institutionService: InstitutionService,
        public addressesService: ApiAddressService
    ) { }

    public ngOnInit(): void {
        this.buildForms();
        this.loadStates();
    }

    private buildForms(): void {
        this.institutionForm = this.formBuilder.group({
            name: ['', Validators.required],
            cnpj: ['', [FormsValidators.validateCNPJ]],
            street: ['', Validators.required],
            neighbourhood: ['', Validators.required],
            number: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            type: ['', Validators.required],
            complement: [''],
            zipcode: ['', Validators.required]
        });

        this.institutionForm.controls['city'].disable();

        this.institutionForm.controls['state'].valueChanges.subscribe(v => {
            this.loadCities();
            this.institutionForm.controls['city'].enable();
        });
    }

    public inputHasError(formControlName: string, validationAttrs?: Array<string>): boolean {
        return FormsUtils.inputHasError(this.institutionForm, formControlName, validationAttrs);      
    }

    public selectInstitution(value: Institution): void {
        this.selected = value;
        this.fillForms(value);
    }

    public add(): void {
        if(this.institutionForm.valid){
            let postData = this.createRequestData();
            postData.id = this.institutionService.list.length;

            this.institutionService.push(postData);
            this.buildForms();
        }
        else {
            FormsUtils.touchFormControls(this.institutionForm);
        }
    }

    public update(): void {
        if(this.institutionForm.valid && this.selected){
            let postData = this.createRequestData();

            var institution = this.institutionService.list.find(i => i.id == this.selected.id);
            institution.id = this.selected.id;
            institution.name = postData.name;
            institution.cnpj = postData.cnpj;
            institution.type = postData.type;
            institution.zipcode = postData.zipcode;
            institution.complement = postData.complement;
            institution.city = postData.city;
            institution.neighbourhood = postData.neighbourhood;
            institution.street = postData.street;
            institution.number = postData.number;
            institution.state = postData.state;
        }
        else {
            FormsUtils.touchFormControls(this.institutionForm);
        }
    }

    public delete(): void {
        if(!this.selected) return;

        this.institutionService.delete(this.selected.id);
        this.buildForms();
    }

    public fillForms(institution: Institution): void {
        if (institution) {
            FormsUtils.autoFillForm(this.institutionForm, institution);
        }
    }

    public inputChange(data) {
        debugger
        if (data.target && data.target.attributes.formcontrolname) {
            this.institutionForm.controls[data.target.attributes.formcontrolname.value].setValue(data.target.value);

            if (data.target.attributes.formcontrolname.value == 'zipcode') {
                this.loadZipCode();
            }
        }
    }

    private createRequestData(): Institution {
        return FormsUtils.formToModel<Institution>(this.institutionForm, Institution);
    }

    private loadCities(callback?: () => void) {
        if (this.institutionForm && this.states) {
            const stateId = this.institutionForm.controls['state'].value;
            if ((!this.cities || this._citiesStateId != stateId) && stateId) {
                this._citiesStateId = stateId;
                this.addressesService.getCities(stateId).then(response => {
                    this.cities = response;

                    if (callback) {
                        callback();
                    }
                });
            }
        }
    }

    private loadStates(callback?: () => void) {
        if (this._suspendLoadStates) {
            return;
        }

        if (!this.states) {
            this._suspendLoadStates = true;
            this.addressesService.getStates(55).then(response => {
                this.states = response;

                this.loadCities(() => {
                    if (callback) {
                        callback();
                    }
                });
            });
        }
    }

    private loadZipCode(): void {
        if (this.institutionForm && this.institutionForm.controls.zipcode.value) {
            const zipcode = this.institutionForm.controls.zipcode.value;
            this.addressesService.getAddressByZipCode(zipcode).then((response: Address) => {
                if (response) {
                    let address = response;

                    var institution = new Institution();
                    institution.id = this.selected ? this.selected.id : 0;
                    institution.name = this.institutionForm.controls['name'].value;
                    institution.cnpj = this.institutionForm.controls['cnpj'].value;
                    institution.type = this.institutionForm.controls['type'].value;
                    institution.zipcode = zipcode;
                    institution.city = address.city.id;
                    institution.neighbourhood = address.district.name;
                    institution.street = address.address1;
                    institution.number = address.number;
                    institution.state = address.state.id;

                    this.fillForms(institution);
                    this.inputNumber.nativeElement.focus();
                } else {
                    console.log(response);
                    (window as any).alert(response);
                }
            }, (error: any) => {
                console.log(error);
                (window as any).alert('Não foi possível carregar o endereço a partir do CEP. Por favor verifique o mesmo!');
            });
        }
    }
}
