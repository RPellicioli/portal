import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorComponent } from './moderator.component';
import { ModeratorModule } from './moderator.module';

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
});
