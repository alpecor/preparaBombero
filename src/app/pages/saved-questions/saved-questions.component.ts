import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

// ---- Tipos (fuera de la clase)
interface Topic { id: string; name: string; }
type BlockKey = 'all' | 'leg' | 'esp' | 'otr';

@Component({
  selector: 'app-saved-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './saved-questions.component.html',
  styleUrls: ['./saved-questions.component.css']
})
export class SavedQuestionsComponent {

  // Selección actual
  selectedBlock: BlockKey = 'all';
  selectedTopic: string = 'all'; // 'all' = Todos los temas

  // Bloques
  blocks = [
    { id: 'all' as BlockKey, name: 'Todos los bloques' },
    { id: 'leg' as BlockKey, name: 'Legislación' },
    { id: 'esp' as BlockKey, name: 'Específico' },
    { id: 'otr' as BlockKey, name: 'Otros' },
  ];

  // 5 temas por bloque (demo)
  topicsByBlock: Record<Exclude<BlockKey, 'all'>, Topic[]> = {
    leg: [
      { id: 'leg-1', name: 'Constitución' },
      { id: 'leg-2', name: 'LOPC y Fuerzas' },
      { id: 'leg-3', name: 'Prevención laboral' },
      { id: 'leg-4', name: 'Norma UNE' },
      { id: 'leg-5', name: 'Protección Civil' },
    ],
    esp: [
      { id: 'esp-1', name: 'Hidráulica' },
      { id: 'esp-2', name: 'Incendios urbanos' },
      { id: 'esp-3', name: 'Incendios forestales' },
      { id: 'esp-4', name: 'Materiales y agentes' },
      { id: 'esp-5', name: 'Vehículos y EPIs' },
    ],
    otr: [
      { id: 'otr-1', name: 'Primeros auxilios' },
      { id: 'otr-2', name: 'Comunicación' },
      { id: 'otr-3', name: 'Psicología emergencias' },
      { id: 'otr-4', name: 'Topografía' },
      { id: 'otr-5', name: 'Física básica' },
    ],
  };

  // Lista plana de todos los temas (15)
  private allTopics(): Topic[] {
    return [
      ...this.topicsByBlock.leg,
      ...this.topicsByBlock.esp,
      ...this.topicsByBlock.otr,
    ];
  }

  // Opciones visibles del segundo select según bloque
  get topicOptions(): Topic[] {
    return this.selectedBlock === 'all'
      ? this.allTopics()
      : this.topicsByBlock[this.selectedBlock];
  }

  onBlockChange(): void {
    this.selectedTopic = 'all'; // reset a “Todos los temas”
  }

  onSearch(): void {
    console.log({
      bloque: this.selectedBlock,
      tema: this.selectedTopic,
      temaTexto:
        this.selectedTopic === 'all'
          ? 'Todos los temas'
          : this.topicOptions.find(t => t.id === this.selectedTopic)?.name,
    });
    // TODO: aplica aquí el filtrado real
  }
}
