import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTestComponent } from './review-test.component';

describe('ReviewTestComponent', () => {
  let component: ReviewTestComponent;
  let fixture: ComponentFixture<ReviewTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
