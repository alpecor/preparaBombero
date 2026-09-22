import { Injectable, inject, signal } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { ReinforcementPack } from './reinforcements.models';

@Injectable({ providedIn: 'root' })
export class ReinforcementsService {
  private readonly requestService = inject(RequestService);

  readonly packs = signal<ReinforcementPack[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly purchasingId = signal<number | null>(null);

  async loadPacks(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const packs = await this.requestService.request('GET', '/pack', {}, {});
      this.packs.set(packs as ReinforcementPack[]);
    } catch {
      this.error.set('No se han podido cargar los packs. Inténtalo de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  async checkout(packId: number): Promise<string | null> {
    this.purchasingId.set(packId);
    this.error.set('');

    try {
      const response = await this.requestService.request(
        'POST',
        `/pack/${packId}/checkout`,
        {},
        {},
      );

      return response?.url ?? null;
    } catch {
      this.error.set('No se ha podido iniciar la compra. Inténtalo de nuevo.');
      return null;
    } finally {
      this.purchasingId.set(null);
    }
  }
}
