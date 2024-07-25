import { ComponentFixture, TestBed } from '@angular/core/testing';

import { topicsComponent } from './topics.component';

describe('topicsComponent', () => {
  let component: topicsComponent;
  let fixture: ComponentFixture<topicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [topicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(topicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
