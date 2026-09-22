import { Injectable, computed, signal } from '@angular/core';
import { DEMO_PACKS, DEMO_TERRITORIES } from './reinforcements.mock';
import { PracticeQuestion, ReinforcementPack } from './reinforcements.models';

/** Demo adapter only. No payments, backend writes or real entitlements. */
@Injectable({ providedIn: 'root' })
export class ReinforcementsService {
  readonly packs = DEMO_PACKS;
  readonly territories = DEMO_TERRITORIES;
  private readonly ownedIds = signal(new Set(['demo-pack-2']));
  readonly ownedPacks = computed(() => this.packs.filter((pack) => this.isOwned(pack.id)));

  isOwned(id: string): boolean {
    return this.ownedIds().has(id);
  }

  simulatePurchase(id: string): boolean {
    if (!this.packs.some((pack) => pack.id === id) || this.isOwned(id)) return false;
    this.ownedIds.update((ids) => new Set([...ids, id]));
    return true;
  }

  resetDemo(): void {
    this.ownedIds.set(new Set(['demo-pack-2']));
  }

  /** Illustrates correction only; these are not the advertised pack contents. */
  getDemoQuestions(pack: ReinforcementPack): PracticeQuestion[] {
    if (!this.isOwned(pack.id)) return [];
    return [
      {
        id: `${pack.id}-scope`,
        title: '¿A qué comunidad autónoma pertenece este refuerzo de muestra?',
        options: [
          pack.community,
          ...this.territories
            .map((t) => t.name)
            .filter((name) => name !== pack.community)
            .slice(0, 3),
        ],
        correctIndex: 0,
        explanation: `Este refuerzo está ubicado en ${pack.community}. Esta pregunta solo demuestra el funcionamiento de la práctica.`,
      },
      {
        id: `${pack.id}-content`,
        title: '¿De dónde proceden las preguntas de los refuerzos?',
        options: [
          'Solo de exámenes oficiales',
          'De contenido propio creado por el equipo',
          'De las respuestas de otros usuarios',
        ],
        correctIndex: 1,
        explanation:
          'Los refuerzos son contenido propio y complementan el banco oficial. Esta es una pregunta de demostración, no una pregunta del pack.',
      },
    ];
  }
}
