import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSanitizerComponent } from './text-sanitizer.component';

describe('topicsComponent', () => {
  let component: TextSanitizerComponent;
  let fixture: ComponentFixture<TextSanitizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSanitizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextSanitizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
