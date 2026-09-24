import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReinforcementsService } from './reinforcements.service';
import { ReinforcementPack } from './reinforcements.models';

type ReinforcementDropdown = 'community' | 'city' | 'administration' | null;

@Component({
  selector: 'app-reinforcements',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reinforcements.component.html',
})
export class ReinforcementsComponent {
  private readonly alphabeticalOrder = new Intl.Collator('es', { sensitivity: 'base' });
  readonly store = inject(ReinforcementsService);
  @ViewChild('packDialog') dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('catalogTitle') catalogTitle!: ElementRef<HTMLElement>;

  search = '';
  community = '';
  city = '';
  administration = '';
  activeDropdown: ReinforcementDropdown = null;
  selectedPack: ReinforcementPack | null = null;
  message = '';

  get filteredPacks(): ReinforcementPack[] {
    const query = this.normalize(this.search.trim());

    return this.store.packs().filter((pack) => {
      const matchesTerritory =
        this.matchesSelection(pack.comunidad, this.community) &&
        this.matchesSelection(pack.ciudad, this.city) &&
        this.matchesSelection(pack.administracion, this.administration);
      const searchableText = [
        pack.nombre,
        pack.comunidad,
        pack.ciudad,
        pack.administracion,
        pack.check1,
        pack.check2,
        pack.check3,
      ]
        .filter(Boolean)
        .join(' ');

      return matchesTerritory && (!query || this.normalize(searchableText).includes(query));
    });
  }

  get ownedPacks(): ReinforcementPack[] {
    return this.store.packs().filter((pack) => pack.purchased);
  }

  get communities(): string[] {
    return this.uniqueSorted(this.store.packs().map((pack) => pack.comunidad));
  }

  get cities(): string[] {
    return this.uniqueSorted(
      this.store
        .packs()
        .filter((pack) => this.matchesSelection(pack.comunidad, this.community))
        .map((pack) => pack.ciudad),
    );
  }

  get administrations(): string[] {
    return this.uniqueSorted(
      this.store
        .packs()
        .filter(
          (pack) =>
            this.matchesSelection(pack.comunidad, this.community) &&
            this.matchesSelection(pack.ciudad, this.city),
        )
        .map((pack) => pack.administracion),
    );
  }

  toggleDropdown(dropdown: Exclude<ReinforcementDropdown, null>): void {
    if (
      (dropdown === 'city' && !this.community) ||
      (dropdown === 'administration' && !this.city)
    ) {
      return;
    }

    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  selectCommunity(community: string): void {
    this.community = community;
    this.city = '';
    this.administration = '';
    this.activeDropdown = null;
  }

  selectCity(city: string): void {
    this.city = city;
    this.administration = '';
    this.activeDropdown = null;
  }

  selectAdministration(administration: string): void {
    this.administration = administration;
    this.activeDropdown = null;
  }

  cityLabel(): string {
    if (this.city) return this.city;
    if (!this.community) return 'Selecciona una comunidad primero';
    return this.cities.length ? 'Todas las ciudades' : 'Sin ciudades registradas';
  }

  administrationLabel(): string {
    if (this.administration) return this.administration;
    if (!this.city) return 'Selecciona una ciudad primero';
    return this.administrations.length ? 'Todas las administraciones' : 'Sin administraciones registradas';
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.activeDropdown = null;
  }

  @HostListener('document:keydown.escape')
  closeDropdownOnEscape(): void {
    this.activeDropdown = null;
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

  clearFilters(): void {
    this.search = '';
    this.community = '';
    this.city = '';
    this.administration = '';
    this.activeDropdown = null;
    this.catalogTitle.nativeElement.focus({ preventScroll: true });
  }

  location(pack: ReinforcementPack): string {
    return [pack.comunidad, pack.ciudad, pack.administracion].filter(Boolean).join(' · ');
  }

  checks(pack: ReinforcementPack): string[] {
    return [pack.check1, pack.check2, pack.check3].filter((check): check is string => Boolean(check));
  }

  private uniqueSorted(values: Array<string | null | undefined>): string[] {
    const uniqueValues = new Map<string, string>();

    values.forEach((value) => {
      const cleanValue = value?.trim();
      if (!cleanValue) return;

      const normalizedValue = this.normalize(cleanValue);
      if (!uniqueValues.has(normalizedValue)) {
        uniqueValues.set(normalizedValue, cleanValue);
      }
    });

    return [...uniqueValues.values()].sort((a, b) => this.alphabeticalOrder.compare(a, b));
  }

  private matchesSelection(value: string | null, selectedValue: string): boolean {
    return !selectedValue || this.normalize(value?.trim() ?? '') === this.normalize(selectedValue.trim());
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
