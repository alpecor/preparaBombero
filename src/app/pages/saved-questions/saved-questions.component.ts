import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { TextSanitizerComponent } from "../../components/text-sanitizer/text-sanitizer.component";

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


  //************************* CONSTRUCTOR ****************************//
  constructor(
    private requestService: RequestService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
  ) {}


  //************************* ngOnInit ****************************//
  async ngOnInit(): Promise<void> {
    const rawPackId = this.route.snapshot.paramMap.get('packId');
    const parsedPackId = Number(rawPackId);

    if (rawPackId && Number.isInteger(parsedPackId) && parsedPackId > 0) {
      this.packId = parsedPackId;
      await this.loadPackQuestions();
      return;
    }

    await this.loadSavedQuestions();
  }

  get isPackView(): boolean {
    return this.packId !== null;
  }


  //************************* FUNCION PARA OBTENER PREGUNTAS GUARDADAS ****************************//
  async loadSavedQuestions() {
    const allSavedQuestions = await this.requestService.request('GET', `/quiz/favorite`, {}, {}, true);
    this.initializeQuestions(allSavedQuestions);
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

      this.packName = response?.pack?.name ?? 'Pack comprado';
      this.packDescription = response?.pack?.description ?? null;
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
      this.showToast('Se ha quitado la pregunta de la sección preguntas guardadas.', 'error');
    }catch(error: any){
      console.log(error);
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
