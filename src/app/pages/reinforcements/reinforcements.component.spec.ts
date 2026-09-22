import { TestBed } from '@angular/core/testing';
import { RequestService } from '../../services/request.service';
import { ReinforcementsComponent } from './reinforcements.component';
import { ReinforcementsService } from './reinforcements.service';

describe('ReinforcementsComponent', () => {
  let component: ReinforcementsComponent;
  let service: ReinforcementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReinforcementsComponent],
      providers: [
        {
          provide: RequestService,
          useValue: { request: jasmine.createSpy('request') },
        },
      ],
    });

    component = TestBed.createComponent(ReinforcementsComponent).componentInstance;
    service = TestBed.inject(ReinforcementsService);
    service.packs.set([
      {
        id: 1,
        name: 'Pack de prueba',
        description: 'Preguntas de prueba',
        priceCents: 395,
        numQuestions: 20,
        purchased: false,
        createdAt: '2026-09-23T00:00:00.000Z',
      },
    ]);
  });

  it('filters packs by name and description', () => {
    component.search = 'PREGUNTAS';
    expect(component.filteredPacks.length).toBe(1);

    component.search = 'inexistente';
    expect(component.filteredPacks.length).toBe(0);
  });

  it('formats prices in euros', () => {
    expect(component.price(395)).toContain('3,95');
  });
});
