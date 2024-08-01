import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeTestimonialsComponent } from './welcome-testimonials.component';

describe('WelcomeFaqComponent', () => {
  let component: WelcomeTestimonialsComponent;
  let fixture: ComponentFixture<WelcomeTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeTestimonialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
