import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpsComponent } from './ips.component';

describe('IpsComponent', () => {
  let component: IpsComponent;
  let fixture: ComponentFixture<IpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
