import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasUserComponent } from './topics.component';

describe('TemasUserComponent', () => {
  let component: TemasUserComponent;
  let fixture: ComponentFixture<TemasUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemasUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemasUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
