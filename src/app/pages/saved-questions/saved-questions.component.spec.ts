import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedQuestionsComponent } from './saved-questions.component';

describe('SavedQuestionsComponent', () => {
  let component: SavedQuestionsComponent;
  let fixture: ComponentFixture<SavedQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
