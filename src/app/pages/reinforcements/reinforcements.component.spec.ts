import { TestBed } from '@angular/core/testing';
import { ReinforcementsComponent } from './reinforcements.component';
import { ReinforcementsService } from './reinforcements.service';

describe('Refuerzos demo', () => {
  let component: ReinforcementsComponent;
  let store: ReinforcementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ReinforcementsComponent] });
    component = TestBed.createComponent(ReinforcementsComponent).componentInstance;
    store = TestBed.inject(ReinforcementsService);
  });

  it('includes all territories, even those without packs', () => {
    expect(store.territories.length).toBe(18);
    expect(store.territories.reduce((n, t) => n + t.provinces.length, 0)).toBe(52);
    component.community = 'Galicia';
    expect(component.provinces.length).toBe(4);
    expect(component.filteredPacks.length).toBe(0);
  });

  it('sorts every location dropdown alphabetically in Spanish', () => {
    const sortedCommunities = [...component.territories].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    expect(component.territories.map((item) => item.name)).toEqual(
      sortedCommunities.map((item) => item.name),
    );

    component.selectCommunity('Andalucía');
    expect(component.provinces.map((item) => item.name)).toEqual([
      'Almería',
      'Cádiz',
      'Córdoba',
      'Granada',
      'Huelva',
      'Jaén',
      'Málaga',
      'Sevilla',
    ]);

    component.selectProvince('Sevilla');
    expect(component.administrations).toEqual([
      'Ayuntamiento de Sevilla',
      'Consorcio Provincial de Bomberos',
    ]);
  });

  it('combines accent-insensitive search and hierarchical filters without duplicating ancestors', () => {
    component.search = 'cadiz';
    expect(component.filteredPacks.length).toBe(1);
    component.clearFilters();
    component.community = 'Andalucía';
    component.province = 'Sevilla';
    component.administration = 'Ayuntamiento de Sevilla';
    expect(component.filteredPacks.length).toBe(1);
    expect(component.filteredPacks[0].administration).toBe('Ayuntamiento de Sevilla');
    component.community = 'Madrid';
    component.changeCommunity();
    expect(component.province).toBe('');
    expect(component.administration).toBe('');
    expect(component.filteredPacks.every((p) => p.community === 'Madrid')).toBeTrue();
  });

  it('adds a demo pack once, rejects unknown packs and resets the demo collection', () => {
    const pack = store.packs[0];
    expect(store.simulatePurchase(pack.id)).toBeTrue();
    expect(store.simulatePurchase(pack.id)).toBeFalse();
    expect(store.simulatePurchase('unknown')).toBeFalse();
    expect(store.ownedPacks().length).toBe(2);
    expect(store.getDemoQuestions(pack).length).toBe(2);
    store.resetDemo();
    expect(store.ownedPacks().length).toBe(1);
    expect(store.getDemoQuestions(pack)).toEqual([]);
  });

  it('requires an answer and correction before progressing and counts results once', () => {
    component.questions = store.getDemoQuestions(store.ownedPacks()[0]);
    component.next();
    component.correct();
    expect(component.questionIndex).toBe(0);
    expect(component.corrected).toBeFalse();
    component.selectedAnswer = component.question!.correctIndex;
    component.correct();
    component.correct();
    expect(component.correctCount).toBe(1);
    component.next();
    expect(component.questionIndex).toBe(1);
    expect(component.selectedAnswer).toBeNull();
    expect(component.corrected).toBeFalse();
    component.selectedAnswer = 0;
    component.correct();
    component.next();
    expect(component.finished).toBeTrue();
    expect(component.correctCount).toBe(1);
  });

  it('supports new free-text pack types and integer cent prices', () => {
    expect(component.icon('PSICOTÉCNICOS')).toBe('fa-book-open');
    expect(component.price(395)).toContain('3,95');
    expect(store.packs.every((p) => Number.isInteger(p.priceCents))).toBeTrue();
  });
});
