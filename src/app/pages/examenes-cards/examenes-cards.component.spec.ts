import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenesCardsComponent } from './examenes-cards.component';

describe('ExamanesCardsComponent', () => {
  let component: ExamenesCardsComponent;
  let fixture: ComponentFixture<ExamenesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamenesCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
