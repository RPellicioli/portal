import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionComponent } from './institution.component';
import { InstitutionModule } from './institution.module';

describe('InstitutionComponent', () => {
    let component: InstitutionComponent;
    let fixture: ComponentFixture<InstitutionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                InstitutionModule          
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstitutionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be create component', () => {
        expect(component).toBeTruthy();
    });

    it('form invalid when empty', () => {
        expect(component.institutionForm.valid).toBeFalsy();
    });

    it('submitting a form emits a institution', () => {
        expect(component.institutionForm.valid).toBeFalsy();

        component.institutionForm.controls['name'].setValue("Universidade Teste");
        component.institutionForm.controls['cnpj'].setValue("47.892.280/0001-53");
        component.institutionForm.controls['zipcode'].setValue("95110-022");
        component.institutionForm.controls['number'].setValue("12");
        component.institutionForm.controls['street'].setValue("Luiz Cavion");
        component.institutionForm.controls['neighbourhood'].setValue("Rizzo");
        component.institutionForm.controls['city'].setValue("Caxias do Sul");
        component.institutionForm.controls['state'].setValue(3);
        component.institutionForm.controls['type'].setValue(2);

        expect(component.institutionForm.valid).toBeTruthy();
    });
});
