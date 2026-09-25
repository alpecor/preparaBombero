import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { RequestService } from '../../../services/request.service';
import {
  AnnouncementPageData,
  decodeAnnouncementPages,
  encodeAnnouncementPages,
} from '../../../services/announcement-content';

@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [EditorModule, FormsModule],
  templateUrl: './exams-list.component.html',
})
export class ExamsListComponent implements OnInit {
  summary = '';
  pages: AnnouncementPageData[] = [];
  activePreviewPage = 0;
  showSaveConfirmation = false;
  isSaving = false;
  validationMessage = '';

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    void this.loadInfo();
  }

  async loadInfo(): Promise<void> {
    try {
      const data = await this.requestService.request('GET', '/info', {}, {}, false);
      this.summary = data.title ?? '';
      this.pages = decodeAnnouncementPages(
        data.description,
        data.title,
        true
      );
    } catch (error) {
      console.error('Error cargando la información:', error);
      this.validationMessage = 'No se ha podido cargar la información. Inténtalo de nuevo.';
    }
  }

  addPage(): void {
    if (this.pages.length >= 30) {
      this.validationMessage = 'Puedes crear un máximo de 30 páginas de novedades.';
      return;
    }
    this.pages.push({ title: '', content: '' });
    this.activePreviewPage = this.pages.length - 1;
    this.validationMessage = '';
  }

  removePage(index: number): void {
    this.pages.splice(index, 1);
    this.activePreviewPage = Math.min(
      this.activePreviewPage,
      Math.max(this.pages.length - 1, 0)
    );
    this.validationMessage = '';
  }

  movePage(index: number, direction: -1 | 1): void {
    const destination = index + direction;
    if (destination < 0 || destination >= this.pages.length) return;

    [this.pages[index], this.pages[destination]] = [
      this.pages[destination],
      this.pages[index],
    ];

    if (this.activePreviewPage === index) {
      this.activePreviewPage = destination;
    } else if (this.activePreviewPage === destination) {
      this.activePreviewPage = index;
    }
  }

  selectPreviewPage(index: number): void {
    if (index >= 0 && index < this.pages.length) {
      this.activePreviewPage = index;
    }
  }

  async saveInfo(): Promise<void> {
    this.validationMessage = '';

    if (!this.summary.trim()) {
      this.validationMessage = 'Escribe el resumen que aparecerá en la barra negra.';
      return;
    }

    const invalidPageIndex = this.pages.findIndex(
      page => !page.title.trim() || !this.hasVisibleContent(page.content)
    );

    if (invalidPageIndex !== -1) {
      this.activePreviewPage = invalidPageIndex;
      this.validationMessage = `Completa el título y el contenido de la página ${invalidPageIndex + 1}.`;
      return;
    }

    this.isSaving = true;
    try {
      const saved = await this.requestService.request(
        'PUT',
        '/info',
        {
          title: this.summary.trim(),
          description: encodeAnnouncementPages(this.pages.map(page => ({
            title: page.title.trim(),
            content: page.content,
          }))),
        },
        {},
        true
      );

      this.summary = saved.title ?? this.summary.trim();
      this.pages = decodeAnnouncementPages(saved.description, saved.title);
      this.showSaveConfirmation = true;
    } catch (error) {
      console.error('Error actualizando la información:', error);
      this.validationMessage = 'No se han podido guardar los cambios. Revisa los datos e inténtalo de nuevo.';
    } finally {
      this.isSaving = false;
    }
  }

  dismissSaveConfirmation(): void {
    this.showSaveConfirmation = false;
  }

  finishSaveConfirmation(): void {
    this.showSaveConfirmation = false;
  }

  private hasVisibleContent(content: string): boolean {
    return content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim().length > 0;
  }
}
