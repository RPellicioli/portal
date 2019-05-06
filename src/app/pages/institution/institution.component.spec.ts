import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionComponent } from './institution.component';
import { InstitutionModule } from './institution.module';
import { InstitutionService } from './service/institution.service';
import { ModeratorService } from '../moderator/service/moderator.service';
import { Moderator } from 'src/app/models/moderator';

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

    it('dont remove when associated', () => {
        component.institutionForm.controls['name'].setValue("Universidade Teste");
        component.institutionForm.controls['cnpj'].setValue("47.892.280/0001-53");
        component.institutionForm.controls['zipcode'].setValue("95110-022");
        component.institutionForm.controls['number'].setValue("12");
        component.institutionForm.controls['street'].setValue("Luiz Cavion");
        component.institutionForm.controls['neighbourhood'].setValue("Rizzo");
        component.institutionForm.controls['city'].setValue("Caxias do Sul");
        component.institutionForm.controls['state'].setValue(3);
        component.institutionForm.controls['type'].setValue(2);

        component.add();

        const moderatorService: ModeratorService = TestBed.get(ModeratorService);
        let moderator = new Moderator();

        moderator['id'] = 0;
        moderator['name'] = "Universidade Teste";
        moderator['birthday'] = '1993-04-13';
        moderator['age'] = 26;
        moderator['institutionId'] = 0;
        moderator['profission'] = 1;
        moderator['initPeriod'] = '2019-11-13';
        moderator['toPeriod'] = '2019-11-22';
        moderator['description'] = "Empreendedor";
        moderator['protocol'] = '3';

        moderatorService.list.push(moderator);

        const institutionService: InstitutionService = TestBed.get(InstitutionService);
        component.selected = institutionService.list[0];

        const validDelete = component.validDelete();
        expect(validDelete).toBeFalsy();
        expect(component.delete()).toBeFalsy();
    });

    it('form invalid when cnpj is wrong', () => {
        component.institutionForm.controls['cnpj'].setValue("11.111.280/1001-53");
        let cnpj = component.institutionForm.controls['cnpj'];

        expect(cnpj.valid).toBeFalsy();
    });

    it('form valid when cnpj is Truthy', () => {
        component.institutionForm.controls['cnpj'].setValue("47.892.280/0001-53");
        let cnpj = component.institutionForm.controls['cnpj'];

        expect(cnpj.valid).toBeTruthy();
    });

    it('form invalid when type is not selected', () => {
        component.institutionForm.controls['type'].setValue(null);
        let type = component.institutionForm.controls['type'];

        expect(type.valid).toBeFalsy();
    });
});
