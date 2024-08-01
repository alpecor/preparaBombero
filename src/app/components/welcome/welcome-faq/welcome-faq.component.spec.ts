import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeFaqComponent } from './welcome-faq.component';

describe('WelcomeFaqComponent', () => {
  let component: WelcomeFaqComponent;
  let fixture: ComponentFixture<WelcomeFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
