import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportQuestionsListComponent } from './report-questions-list.component';

describe('ReportQuestionsListComponent', () => {
  let component: ReportQuestionsListComponent;
  let fixture: ComponentFixture<ReportQuestionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportQuestionsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
