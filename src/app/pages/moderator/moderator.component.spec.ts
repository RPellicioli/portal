import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorComponent } from './moderator.component';

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
});
