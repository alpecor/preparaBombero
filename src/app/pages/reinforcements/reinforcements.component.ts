import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReinforcementsService } from './reinforcements.service';
import { PracticeQuestion, ReinforcementPack } from './reinforcements.models';

@Component({
  selector: 'app-reinforcements',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reinforcements.component.html',
})
export class ReinforcementsComponent {
  readonly store = inject(ReinforcementsService);
  @ViewChild('packDialog') dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('collectionTitle') collectionTitle!: ElementRef<HTMLElement>;
  search = '';
  community = '';
  province = '';
  administration = '';
  message = '';
  selectedPack: ReinforcementPack | null = null;
  mode: 'purchase' | 'practice' = 'purchase';
  questions: PracticeQuestion[] = [];
  questionIndex = 0;
  selectedAnswer: number | null = null;
  corrected = false;
  finished = false;
  correctCount = 0;
  private trigger?: HTMLElement;

  get provinces() {
    return this.store.territories.find((t) => t.name === this.community)?.provinces ?? [];
  }

  get administrations() {
    return this.provinces.find((p) => p.name === this.province)?.administrations ?? [];
  }

  get filteredPacks(): ReinforcementPack[] {
    const query = this.normalize(this.search.trim());
    return this.store.packs.filter(
      (pack) =>
        (!this.community || pack.community === this.community) &&
        (!this.province || pack.province === this.province) &&
        (!this.administration || pack.administration === this.administration) &&
        (!query ||
          this.normalize([pack.title, pack.type, this.location(pack), ...pack.bullets].join(' ')).includes(
            query,
          )),
    );
  }

  get question(): PracticeQuestion | undefined {
    return this.questions[this.questionIndex];
  }

  changeCommunity(): void {
    this.province = '';
    this.administration = '';
  }
  changeProvince(): void {
    this.administration = '';
  }
  clearFilters(): void {
    this.search = '';
    this.community = '';
    this.changeCommunity();
  }

  price(cents: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  }

  location(pack: ReinforcementPack): string {
    return [pack.community, pack.province, pack.administration].filter(Boolean).join(' · ');
  }

  scope(pack: ReinforcementPack): string {
    return pack.administration ? 'Administración' : pack.province ? 'Provincia' : 'Comunidad autónoma';
  }

  icon(type: string): string {
    return (
      (
        {
          CALLEJERO: 'fa-location-dot',
          GEOGRAFÍA: 'fa-map',
          'TEMAS DEL SERVICIO': 'fa-building-columns',
        } as Record<string, string>
      )[type] ?? 'fa-book-open'
    );
  }

  open(pack: ReinforcementPack, mode: 'purchase' | 'practice', trigger: HTMLElement): void {
    if (mode === 'purchase' && this.store.isOwned(pack.id)) return;
    if (mode === 'practice' && !this.store.isOwned(pack.id)) return;
    this.trigger = trigger;
    this.selectedPack = pack;
    this.mode = mode;
    this.questions = mode === 'practice' ? this.store.getDemoQuestions(pack) : [];
    this.questionIndex = 0;
    this.selectedAnswer = null;
    this.corrected = false;
    this.finished = false;
    this.correctCount = 0;
    this.dialog.nativeElement.showModal();
  }

  close(): void {
    this.dialog.nativeElement.close();
  }
  restoreFocus(): void {
    const target = this.trigger?.isConnected ? this.trigger : this.collectionTitle.nativeElement;
    target.focus({ preventScroll: true });
  }
  backdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement) this.close();
  }

  purchase(): void {
    if (!this.selectedPack || this.mode !== 'purchase') return;
    if (this.store.simulatePurchase(this.selectedPack.id)) {
      this.message = `«${this.selectedPack.title}» añadido a tu colección de demostración. No se ha realizado ningún cobro.`;
    }
    this.close();
  }

  correct(): void {
    if (this.selectedAnswer === null || !this.question || this.corrected) return;
    this.corrected = true;
    if (this.selectedAnswer === this.question.correctIndex) this.correctCount++;
  }

  next(): void {
    if (!this.corrected) return;
    if (this.questionIndex === this.questions.length - 1) {
      this.finished = true;
      return;
    }
    this.questionIndex++;
    this.selectedAnswer = null;
    this.corrected = false;
  }

  resetDemo(): void {
    this.store.resetDemo();
    this.message = 'Demostración reiniciada. Solo queda el refuerzo de muestra inicial.';
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
