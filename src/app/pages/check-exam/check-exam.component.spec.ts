import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckExamComponent } from './check-exam.component';

describe('CheckExamComponent', () => {
  let component: CheckExamComponent;
  let fixture: ComponentFixture<CheckExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
