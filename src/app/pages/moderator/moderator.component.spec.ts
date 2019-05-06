import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorComponent } from './moderator.component';
import { ModeratorModule } from './moderator.module';
import { ModeratorService } from './service/moderator.service';

describe('ModeratorComponent', () => {
    let component: ModeratorComponent;
    let fixture: ComponentFixture<ModeratorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ModeratorModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModeratorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be create component', () => {
        expect(component).toBeTruthy();
    });

    it('form invalid when initial period its bigger than final period', () => {
        component.moderatorForm.controls['initPeriod'].setValue(new Date('2019-12-07'));
        component.moderatorForm.controls['toPeriod'].setValue(new Date('2019-12-06'));
        let valid = component.validPeriod();

        expect(valid).toBeFalsy();
    });

    it('form valid when final period its bigger than initial period', () => {
        component.moderatorForm.controls['initPeriod'].setValue(new Date('2019-12-07'));
        component.moderatorForm.controls['toPeriod'].setValue(new Date('2019-12-12'));
        let valid = component.validPeriod();

        expect(valid).toBeTruthy();
    });

    it('form invalid when date now its bigger than initial period', () => {
        component.moderatorForm.controls['initPeriod'].setValue(new Date('2019-04-07'));
        component.moderatorForm.controls['toPeriod'].setValue(new Date('2019-12-12'));
        let valid = component.validPeriod();

        expect(valid).toBeFalsy();
    });

    it('Its valid email', () => {
        component.moderatorForm.controls['email'].setValue('ricardo@goimage.com.br');
        let valid = component.moderatorForm.controls['email'].valid;

        expect(valid).toBeTruthy();
    });

    it('Its invalid email', () => {
        component.moderatorForm.controls['email'].setValue('ricardo!pellicioli.com');
        let valid = component.moderatorForm.controls['email'].valid;

        expect(valid).toBeFalsy();
    });

    it('First moderator created should be protocol equals 3', () => {
        const moderatorService: ModeratorService = TestBed.get(ModeratorService);
        moderatorService.list = [];

        component.moderatorForm.controls['name'].setValue("Ricardo");
        component.moderatorForm.controls['email'].setValue("ricardo@goimage.com.br");
        component.moderatorForm.controls['birthday'].setValue(new Date('1993-04-13'));
        component.moderatorForm.controls['age'].setValue(26);
        component.moderatorForm.controls['institutionId'].setValue(0);
        component.moderatorForm.controls['profission'].setValue(1);
        component.moderatorForm.controls['initPeriod'].setValue(new Date('2019-11-13'));
        component.moderatorForm.controls['toPeriod'].setValue(new Date('2019-11-22'));
        component.moderatorForm.controls['description'].setValue("Empreendedor");

        component.add();

        expect(moderatorService.list[0].protocol).toBe(3);
    });
});
