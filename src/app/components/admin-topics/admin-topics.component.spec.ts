import { ComponentFixture, TestBed } from '@angular/core/testing';

import { adminTopicsComponent } from './admin-topics.component';

describe('topicsComponent', () => {
  let component: adminTopicsComponent;
  let fixture: ComponentFixture<adminTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [adminTopicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(adminTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
