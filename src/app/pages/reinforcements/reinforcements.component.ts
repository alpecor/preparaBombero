import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReinforcementsService } from './reinforcements.service';
import { ReinforcementPack } from './reinforcements.models';

@Component({
  selector: 'app-reinforcements',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reinforcements.component.html',
})
export class ReinforcementsComponent implements OnInit {
  readonly store = inject(ReinforcementsService);
  @ViewChild('packDialog') dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('catalogTitle') catalogTitle!: ElementRef<HTMLElement>;

  search = '';
  selectedPack: ReinforcementPack | null = null;
  message = '';

  ngOnInit(): void {
    void this.store.loadPacks();
  }

  get filteredPacks(): ReinforcementPack[] {
    const query = this.normalize(this.search.trim());

    return this.store.packs().filter((pack) => {
      if (!query) return true;

      return this.normalize(`${pack.name} ${pack.description ?? ''}`).includes(query);
    });
  }

  price(cents: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  }

  openPurchase(pack: ReinforcementPack): void {
    if (pack.purchased) return;
    this.selectedPack = pack;
    this.message = '';
    this.dialog.nativeElement.showModal();
  }

  close(): void {
    this.dialog.nativeElement.close();
  }

  backdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement) this.close();
  }

  async purchase(): Promise<void> {
    if (!this.selectedPack) return;

    const url = await this.store.checkout(this.selectedPack.id);
    if (url) {
      window.location.assign(url);
    }
  }

  clearSearch(): void {
    this.search = '';
    this.catalogTitle.nativeElement.focus({ preventScroll: true });
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
