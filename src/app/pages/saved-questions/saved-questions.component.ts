import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { TextSanitizerComponent } from "../../components/text-sanitizer/text-sanitizer.component";
import { SavedQuestionsInitialData } from './saved-questions.resolver';

// ---- Tipos (fuera de la clase)
interface Topic { id: string; name: string; }
type BlockKey = 'all' | 'leg' | 'esp' | 'otr';

@Component({
  selector: 'app-saved-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, TextSanitizerComponent],
  templateUrl: './saved-questions.component.html',
  styleUrls: ['./saved-questions.component.css']
})
export class SavedQuestionsComponent implements OnInit {

  //************************* VARIABLES ****************************//
  savedQuestions: any[] = [];
  isLoading = true;
  isSubscribed = false;
  totalSavedQuestions = 0;
  packId: number | null = null;
  packName = '';
  packDescription: string | null = null;
  packLoadError = '';
  topics: Set<string> = new Set();
  topicSelected: string = '';
  isTopicMenuOpen = false;
  //variables para mostrar mensaje de pregunta guardada
  showSavedToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  favoriteQuestionIds = new Set<number>();
  reportedQuestionId: number | null = null;
  reportReason = '';
  isReportModalOpen = false;
  isSendingReport = false;


  //************************* CONSTRUCTOR ****************************//
  constructor(
    private requestService: RequestService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}


  //************************* ngOnInit ****************************//
  ngOnInit(): void {
    const initialData = this.route.snapshot.data['savedQuestionsData'] as SavedQuestionsInitialData;
    this.isSubscribed = initialData?.isSubscribed === true;
    this.packId = initialData?.packId ?? null;
    this.packLoadError = initialData?.packLoadError ?? '';
    this.favoriteQuestionIds = new Set(
      (initialData?.favoriteQuestions ?? []).map((question: any) => Number(question.id)),
    );

    if (this.isPackView) {
      this.packName = initialData?.pack?.nombre ?? 'Pack comprado';
      this.packDescription = [
        initialData?.pack?.comunidad,
        initialData?.pack?.ciudad,
        initialData?.pack?.administracion,
      ].filter(Boolean).join(' · ') || null;
    }

    this.initializeQuestions(initialData?.questions ?? []);
    this.isLoading = false;
  }

  get isPackView(): boolean {
    return this.packId !== null;
  }


  goToSubscription(): void {
    void this.router.navigate(['/profile']);
  }


  //************************* FUNCION PARA OBTENER PREGUNTAS GUARDADAS ****************************//
  async loadSavedQuestions() {
    const allSavedQuestions = await this.requestService.request('GET', `/quiz/favorite`, {}, {}, true);
    this.favoriteQuestionIds = new Set(
      allSavedQuestions.map((question: any) => Number(question.id)),
    );
    this.initializeQuestions(allSavedQuestions);
  }

  private async loadFavoriteState(): Promise<void> {
    try {
      const favoriteQuestions = await this.requestService.request(
        'GET',
        `/quiz/favorite`,
        {},
        {},
        true,
      );
      this.favoriteQuestionIds = new Set(
        favoriteQuestions.map((question: any) => Number(question.id)),
      );
    } catch {
      this.favoriteQuestionIds = new Set<number>();
    }
  }

  async loadPackQuestions(): Promise<void> {
    if (!this.packId) return;

    this.packLoadError = '';

    try {
      const response = await this.requestService.request(
        'GET',
        `/pack/${this.packId}/questions`,
        {},
        {},
        true,
      );

      this.packName = response?.pack?.nombre ?? 'Pack comprado';
      this.packDescription = [
        response?.pack?.comunidad,
        response?.pack?.ciudad,
        response?.pack?.administracion,
      ].filter(Boolean).join(' · ') || null;
      this.topicSelected = '';
      this.initializeQuestions(response?.questions ?? []);
    } catch {
      this.packLoadError = 'No se han podido cargar las preguntas de este pack.';
      this.initializeQuestions([]);
    }
  }

  private initializeQuestions(questions: any[]): void {
    this.totalSavedQuestions = questions.length;
    this.topics = new Set(
      questions
        .map((question: any) => question.topicTitle)
        .filter((topic: any) => Boolean(topic)),
    );
    this.savedQuestions = !this.isPackView && this.topicSelected !== ''
      ? questions.filter((question: any) => question.topicTitle === this.topicSelected)
      : questions;
    this.savedQuestions.forEach((question: any) => {
      question.isCorrected = false;
      question.showJustification = false;
      question.optionSelected = null;
    });

    this.originalOrder = null;
    this.isShuffled = false;
    this.isTopicMenuOpen = false;
  }


  toggleTopicMenu(): void {
    this.isTopicMenuOpen = !this.isTopicMenuOpen;
  }


  selectTopic(topic: string): void {
    this.topicSelected = topic;
    this.isTopicMenuOpen = false;
  }


  @HostListener('document:click')
  closeTopicMenu(): void {
    this.isTopicMenuOpen = false;
  }


  async handleButtonClick(id:number, selectedOption: string) {
    const payload = {
      quizzes: [
        {
          quizId: id,
          optionSelected: selectedOption
        }
      ],
      type: "REVIEW"
    };
    try {
      const response = await this.requestService.request('POST', '/quiz/check', payload, {}, true);
      const quizResponse = response.quizzes[0];

      // Guardar la respuesta correcta en la pregunta correspondiente
      this.savedQuestions = this.savedQuestions.map((question: any) => {
        if (question.id === id) {
          return {
            ...question,
            optionSelected: selectedOption,
            isCorrected :true,// Marcar como corregida
            correctAnswer: quizResponse.result, // Guardar la respuesta correcta
            showJustification: false // Nueva propiedad para controlar la visibilidad del motivo
          };
        }
        return question;
      });
    } catch (error) {
      console.error('Error al corregir la pregunta:', error);
    }
  }



  async showJustification(id:number, value:boolean) {
    try {
      // Guardar la respuesta correcta en la pregunta correspondiente
      this.savedQuestions = this.savedQuestions.map((question: any) => {
        if (question.id === id) {
          return {
            ...question,
            showJustification: value // Nueva propiedad para controlar la visibilidad del motivo
          };
        }
        return question;
      });
    } catch (error) {
      console.error('Error al corregir la pregunta:', error);
    }
  }


  //************************* FUNCIÓN PARA ALETORIEDAD ****************************//
  // --- Estado para barajar/restaurar
private originalOrder: any[] | null = null;
isShuffled = false;

// Fisher–Yates
private shuffleInPlace(arr: any[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

toggleShuffle(): void {
  if (!this.savedQuestions || this.savedQuestions.length === 0) {
    this.showToast('No hay preguntas que barajar.', 'error');
    return;
  }

  if (!this.isShuffled) {
    // Guardamos el orden actual y barajamos la lista visible
    this.originalOrder = [...this.savedQuestions];
    this.shuffleInPlace(this.savedQuestions);
    this.isShuffled = true;
  } else {
    // Restauramos el orden original
    if (this.originalOrder) {
      this.savedQuestions = [...this.originalOrder];
    }
    this.originalOrder = null;
    this.isShuffled = false;
  }
}


  //************************* FUNCIÓN PARA ELIMINAR LA PREGUNTA GUARDADA ****************************//
  async deleteSavedQuestion(id: number) {
    try{
      await this.requestService.request('DELETE', `/quiz/${id}/favorite`,{},{}, true);
      this.loadSavedQuestions();
      this.showToast('Se ha quitado la pregunta de la sección preguntas guardadas.', 'success');
    }catch(error: any){
      console.log(error);
    }
  }


  isQuestionSaved(id: number): boolean {
    return this.favoriteQuestionIds.has(Number(id));
  }


  async toggleSavedQuestion(id: number): Promise<void> {
    const questionId = Number(id);

    try {
      if (this.isQuestionSaved(questionId)) {
        await this.requestService.request('DELETE', `/quiz/${questionId}/favorite`, {}, {}, true);
        const updatedIds = new Set(this.favoriteQuestionIds);
        updatedIds.delete(questionId);
        this.favoriteQuestionIds = updatedIds;
        this.showToast('Se ha quitado la pregunta de la sección preguntas guardadas.', 'success');
        return;
      }

      await this.requestService.request('POST', `/quiz/favorite`, { quizId: questionId }, {}, true);
      this.favoriteQuestionIds = new Set([...this.favoriteQuestionIds, questionId]);
      this.showToast('Se ha guardado la pregunta en la sección preguntas guardadas.', 'success');
    } catch {
      this.showToast('No se ha podido actualizar la pregunta guardada.', 'error');
    }
  }


  openReportModal(questionId: number): void {
    this.reportedQuestionId = Number(questionId);
    this.reportReason = '';
    this.isReportModalOpen = true;
  }


  closeReportModal(): void {
    if (this.isSendingReport) return;

    this.reportedQuestionId = null;
    this.reportReason = '';
    this.isReportModalOpen = false;
  }


  async sendReport(): Promise<void> {
    const reason = this.reportReason.trim();
    if (!reason) {
      this.showToast('Escribe el motivo del reporte antes de enviarlo.', 'error');
      return;
    }
    if (!this.reportedQuestionId || this.isSendingReport) return;

    this.isSendingReport = true;
    try {
      await this.requestService.request(
        'POST',
        `/report`,
        { reason, quizId: this.reportedQuestionId },
        {},
        true,
      );
      this.isReportModalOpen = false;
      this.reportedQuestionId = null;
      this.reportReason = '';
      this.showToast('Se ha enviado el reporte de la pregunta.', 'success');
    } catch {
      this.showToast('No se ha podido enviar el reporte de la pregunta.', 'error');
    } finally {
      this.isSendingReport = false;
    }
  }


  /************************* FUNCION PARA MOSTRAR toast *********************/
  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showSavedToast = true;

    setTimeout(() => {
      this.showSavedToast = false;
    }, 2500); //el mensaje se queda 2 segundo y medio
  }



}
