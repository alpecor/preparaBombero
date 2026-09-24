import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RequestService } from '../../services/request.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { topicsComponent } from '../../components/topics/topics.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomeInitialData } from './home.resolver';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink, topicsComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  //************************* VARIABLES ****************************//
  questions:string[] = []; //definir array donde guardaremos las preguntas
  isAuthenticated = false;
  isSubscribed = false;
  topics: any = {};
  pdfPreviewUrl: SafeResourceUrl | null = null;
  userDisplayName = '';
  hasStudyPlan = false;
  totalAvailableQuestions = 0;
  totalAvailableTopics = 0;
  totalTopicGroups = 0;
  selectedTopicsCount = 0;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  premiumTopicNoticeId: number | null = null;
  premiumTopicNoticeMessage = '';
  private premiumTopicNoticeTimer: ReturnType<typeof setTimeout> | null = null;

  //configurar preguntas examen y repaso
  showExamConfigModal = false;
  questionOptions: number[] = [10, 25, 50, 100, 200];
  selectedQuestionOption: number | null = 50;
  customQuestionNumber: number | null = null;
  maxAvailableQuestions = 0;
  examModalSubtitle = '';
  questionConfigError = '';
  examConfigMode: 'exam' | 'review' = 'exam';
  specificTopicId: number | null = null;


  //************************* CONSTRUCTOR ****************************//
  constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestService, private localStorageService: LocalStorageService, private sanitizer: DomSanitizer){
  }

  showPdfPreview(url: string, topicId?: number) {
    if (!this.isSubscribed) {
      if (topicId) {
        this.showToast = false;
        this.showTopicPremiumNotice(topicId, 'PDF: función Premium');
      } else {
        this.showToastMsg('Consultar los PDF del temario es una funcionalidad Premium.');
      }
      return;
    }

    this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    setTimeout(() => {
      document
        .getElementById('home-pdf-preview')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  closePdfPreview() {
    this.pdfPreviewUrl = null;
  }


  //************************* ngOnInit ****************************//
  ngOnInit(): void {
    const initialData = this.route.snapshot.data['homeData'] as HomeInitialData;

    this.isAuthenticated = initialData.isAuthenticated;
    this.isSubscribed = initialData.user?.subscribed === true;
    this.userDisplayName = initialData.user?.name?.trim() ?? '';
    this.hasStudyPlan = Boolean(initialData.user?.studyPlan);
    this.topics = initialData.topics ?? {};

    // Solo mostrar modal si el usuario está logueado
    if (this.isAuthenticated && !localStorage.getItem('modalShown')) {
      this.openModalTest();                  // Abre el modal solo tras login
      localStorage.setItem('modalShown', 'true');
    }

    Object.keys(this.topics).forEach(key => {
      // Iterando sobre el array correspondiente a cada clave
      this.topics[key] = this.topics[key].map((x: any) => {
        let topicSelected = this.localStorageService.getItem("topicsSelected") ?? [];
        if (topicSelected.length > 0) {
          const topic = topicSelected.filter((y: any) => x.id == y.id); // Asegúrate de que la comparación sea por 'id'
          if (topic.length > 0) {
            x.selected = true;
          } else {
            x.selected = false; // En caso de que no esté seleccionado en localStorage
          }
        }
        return x;
      });
    });
    this.collapseTopicTrees();
    this.refreshHomeMetrics();
  }


  //************************* FUNCION PARA TOAST ****************************//
  showToastMsg(msg: string, type: 'success' | 'error' = 'error') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2500);
  }


  //************************* FUNCION AL HACER CLICK EN EXAMEN TEMA ESPECIFICO ****************************//
  async startExamForSpecificTopic(topicId: number) {
    try {
      // Realizar petición para generar preguntas solo del tema seleccionado
      const questions = await this.requestService.request('POST', `/quiz/generate`, { topicIds: [topicId], numberOfQuestions: 100 }, {});
      if (questions.length === 0) {
        this.showToastMsg('El temario seleccionado no tiene preguntas todavía para realizar un examen.');
        return;
      }

      // Guardar las preguntas limitadas en localStorage
      this.localStorageService.setItem("examQuestions", questions);
      // Navegar a la vista del examen
      this.router.navigate(['/test']);
    } catch (error: any) {
      console.log(error);
    }
  }


  //************************* FUNCION AL HACER CLICK EN EMPEZAR REPASO TEMA ESPECIFICO ****************************//
  async startReviewForSpecificTopic(topicId:number) {
    // Hacer la solicitud POST al backend
    try{
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds: [topicId], numberOfQuestions: 100},{});
      if (this.questions.length === 0) {
        this.showToastMsg('El temario seleccionado no tiene preguntas todavía para realizar un repaso.');
        return;
      }
      //Guardar las preguntas generadas en localStorage
      this.localStorageService.setItem("examQuestions", this.questions);
      this.router.navigate(['/review-test']);
    }catch(error: any){
      console.log(error);
    }
  }


  //************************* FUNCIONES PARA EL MODAL ****************************//
  openModalTest() {
    const modalTest = document.getElementById('multicuentas');
    if (modalTest) {
      modalTest.classList.remove('hidden');
    }
  }


  closeModalTest() {
    const modalTest = document.getElementById('multicuentas');
    if (modalTest) {
      modalTest.classList.add('hidden');
    }
  }

  
  //************************* FUNCION PARA TOPIC SELECCIONADO ****************************//
  selectedTopic(topicId: number, event: any, key: string) {
    const isChecked: boolean = event.target.checked;
    let topicSelected = this.localStorageService.getItem("topicsSelected") ?? [];
    if (isChecked) {
        // Agrega el topic actual
        topicSelected.push({ id: topicId, isChecked });
    } else {
        // Filtra el topic actual de los seleccionados
        topicSelected = topicSelected.filter((x: any) => x.id != topicId);
    }
    // Función recursiva para seleccionar/deseleccionar un topic y sus hijos
    const updateTopicSelection = (topics: any[], id: number, isSelected: boolean) => {
        for (let topic of topics) {
            if (topic.id === id) {
                topic.selected = isSelected;

                // Si el topic tiene hijos, también actualiza sus hijos recursivamente
                if (topic.topics && topic.topics.length > 0) {
                    for (let child of topic.topics) {
                        updateTopicSelection([child], child.id, isSelected);
                        if (isSelected) {
                            topicSelected.push({ id: child.id, isChecked: isSelected });
                        } else {
                            topicSelected = topicSelected.filter((x: any) => x.id != child.id);
                        }
                    }
                }
            } else if (topic.topics && topic.topics.length > 0) {
                // Recurre en los subtopics si no es el topic actual pero tiene hijos
                updateTopicSelection(topic.topics, id, isSelected);
            }
        }
    };
    // Actualizar la variable topics
    updateTopicSelection(this.topics[key], topicId, isChecked);
    this.localStorageService.setItem("topicsSelected", topicSelected);
    this.refreshHomeMetrics();
  }


  //************************* FUNCION PARA DESELECCIONAR TODOS LOS TEMAS ****************************//
  deselectAllTopics() {
    const clear = (arr: any[]) => {
      arr?.forEach(t => {
        t.selected = false;
        if (Array.isArray(t.topics) && t.topics.length) {
          clear(t.topics);
        }
      });
    };
    Object.keys(this.topics || {}).forEach(group => clear(this.topics[group] || []));
    this.localStorageService.setItem('topicsSelected', []);
    this.refreshHomeMetrics();
  }

  scrollToTopics() {
    document.getElementById('home-topics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onTopicsSelectionChanged() {
    this.refreshHomeMetrics();
  }

  goToStudyPlan() {
    this.router.navigate(['/plan-estudio']);
  }

  categoryIcon(category: string): string {
    const normalizedCategory = category.toLowerCase();

    if (normalizedCategory.includes('legis')) {
      return 'fa-scale-balanced';
    }

    if (normalizedCategory.includes('territ')) {
      return 'fa-location-dot';
    }

    return 'fa-fire-flame-curved';
  }

  categoryTopicCount(category: string): number {
    return Array.isArray(this.topics?.[category]) ? this.topics[category].length : 0;
  }

  categoryQuestionCount(category: string): number {
    return (this.topics?.[category] ?? [])
      .reduce((total: number, topic: any) => total + Number(topic.quizCount || 0), 0);
  }

  private refreshHomeMetrics() {
    const groups = Object.keys(this.topics || {});
    const selectedTopics = this.localStorageService.getItem('topicsSelected') ?? [];
    const selectedIds = new Set(selectedTopics.map((topic: any) => Number(topic.id)));

    this.totalTopicGroups = groups.length;
    this.totalAvailableTopics = groups.reduce(
      (total, group) => total + this.categoryTopicCount(group),
      0
    );
    this.totalAvailableQuestions = groups.reduce(
      (total, group) => total + this.categoryQuestionCount(group),
      0
    );
    this.selectedTopicsCount = selectedIds.size;
  }

  private collapseTopicTrees() {
    const collapse = (items: any[]) => {
      items?.forEach(topic => {
        topic.expanded = false;
        if (Array.isArray(topic.topics) && topic.topics.length > 0) {
          collapse(topic.topics);
        }
      });
    };

    Object.keys(this.topics || {}).forEach(group => collapse(this.topics[group] || []));
  }



  //************************* FUNCIONES PARA CONFIGURAR PREGUNTAS EN EXAMEN Y REPASO ****************************//
  openQuestionConfigModal(mode: 'exam' | 'review', topic?: any) {
    if (!this.isSubscribed) {
      const message = mode === 'exam'
        ? 'Examen: función Premium'
        : 'Repaso: función Premium';

      if (topic) {
        this.showToast = false;
        this.showTopicPremiumNotice(topic.id, message);
      } else {
        this.clearTopicPremiumNotice();
        this.showToastMsg(
          mode === 'exam'
            ? 'Crear un examen personalizado es una funcionalidad Premium.'
            : 'Repasar preguntas es una funcionalidad Premium.'
        );
      }
      return;
    }

    this.examConfigMode = mode;
    this.specificTopicId = topic?.id ?? null;
    this.questionConfigError = '';

    if (topic) {
      this.maxAvailableQuestions = Number(topic.quizCount || 0);
      this.examModalSubtitle = topic.title;
      this.selectedQuestionOption = this.maxAvailableQuestions >= 50 ? 50 : this.maxAvailableQuestions;
      this.customQuestionNumber = null;
      this.showExamConfigModal = true;
      return;
    }

    const topicsSelected = this.localStorageService.getItem("topicsSelected");

    if (!topicsSelected || topicsSelected.length === 0) {
      this.showToastMsg(
        mode === 'exam'
          ? 'No hay temario seleccionado para realizar el examen.'
          : 'No hay temario seleccionado para realizar el repaso.'
      );
      return;
    }

    this.maxAvailableQuestions = this.getSelectedTopicsQuestionCount();

    this.examModalSubtitle =
      `${topicsSelected.length} temas seleccionados`;

    this.selectedQuestionOption = this.maxAvailableQuestions >= 50 ? 50 : this.maxAvailableQuestions;
    this.customQuestionNumber = null;
    this.showExamConfigModal = true;
  }

  private showTopicPremiumNotice(topicId: number, message: string) {
    this.clearTopicPremiumNotice();
    this.premiumTopicNoticeId = topicId;
    this.premiumTopicNoticeMessage = message;
    this.premiumTopicNoticeTimer = setTimeout(() => this.clearTopicPremiumNotice(), 3000);
  }

  private clearTopicPremiumNotice() {
    if (this.premiumTopicNoticeTimer) {
      clearTimeout(this.premiumTopicNoticeTimer);
      this.premiumTopicNoticeTimer = null;
    }
    this.premiumTopicNoticeId = null;
    this.premiumTopicNoticeMessage = '';
  }


  closeExamConfigModal() {
    this.showExamConfigModal = false;
    this.specificTopicId = null;
    this.questionConfigError = '';
  }


  selectQuestionOption(option: number) {
    this.selectedQuestionOption = option;
    this.customQuestionNumber = null;
    this.questionConfigError = '';
  }


  onCustomQuestionInput() {
    this.selectedQuestionOption = null;
    this.questionConfigError = '';
  }


  getSelectedQuestionNumber(): number {
    if (this.customQuestionNumber) {
      return Math.min(this.customQuestionNumber, this.maxAvailableQuestions, 200);
    }

    return Math.min(this.selectedQuestionOption ?? this.maxAvailableQuestions, this.maxAvailableQuestions, 200);
  }


  getSelectedTopicsQuestionCount(): number {
    const topicsSelected = this.localStorageService.getItem("topicsSelected") ?? [];
    const selectedIds = new Set(topicsSelected.map((topic: any) => Number(topic.id)));

    let total = 0;

    const walk = (items: any[], hasSelectedAncestor = false) => {
      items?.forEach(topic => {
        const isSelected = selectedIds.has(Number(topic.id));

        // El recuento del padre ya incluye las preguntas de sus descendientes.
        if (isSelected && !hasSelectedAncestor) {
          total += Number(topic.quizCount || 0);
        }

        if (Array.isArray(topic.topics) && topic.topics.length > 0) {
          walk(topic.topics, hasSelectedAncestor || isSelected);
        }
      });
    };

    Object.keys(this.topics || {}).forEach(key => {
      walk(this.topics[key]);
    });

    return total;


  }




  async startQuestionMode() {
    if (!this.isSubscribed) {
      this.showToastMsg(
        'Funcionalidad PREMIUM: necesitas estar subscrito.'
      );
      return;
    }

    if (!this.validateQuestionConfiguration()) {
      return;
    }

    if (this.specificTopicId) {
      await this.startQuestionModeForSpecificTopic();
      return;
    }

    await this.startQuestionModeWithSelectedQuestions();
  }

  private validateQuestionConfiguration(): boolean {
    const customValue = this.customQuestionNumber;

    if (customValue !== null && (
      !Number.isFinite(customValue) ||
      !Number.isInteger(customValue) ||
      customValue < 1 ||
      customValue > 200
    )) {
      this.questionConfigError = 'Introduce un número entre 1 y 200. El máximo permitido es 200 preguntas.';
      return false;
    }

    const requestedQuestions = customValue ?? this.selectedQuestionOption;

    if (requestedQuestions !== null && requestedQuestions > this.maxAvailableQuestions) {
      this.questionConfigError = `El temario seleccionado solo tiene ${this.maxAvailableQuestions} preguntas disponibles.`;
      return false;
    }

    this.questionConfigError = '';
    return true;
  }


  async startQuestionModeForSpecificTopic() {
    if (!this.specificTopicId) {
      this.showToastMsg(
        this.examConfigMode === 'exam'
          ? 'No hay tema seleccionado para realizar el examen.'
          : 'No hay tema seleccionado para realizar el repaso.'
      );
      return;
    }

    const numberOfQuestions = this.getSelectedQuestionNumber();

    if (!numberOfQuestions || numberOfQuestions <= 0) {
      this.showToastMsg('Introduce un número de preguntas válido.');
      return;
    }

    try {
      this.questions = await this.requestService.request(
        'POST',
        `/quiz/generate`,
        { topicIds: [this.specificTopicId], numberOfQuestions },
        {}
      );

      if (this.questions.length === 0) {
        this.showToastMsg(
          this.examConfigMode === 'exam'
            ? 'El temario seleccionado no tiene preguntas todavía para realizar un examen.'
            : 'El temario seleccionado no tiene preguntas todavía para realizar un repaso.'
        );
        return;
      }

      const limitedQuestions = this.questions.slice(0, numberOfQuestions);

      this.localStorageService.setItem("examQuestions", limitedQuestions);
      this.closeExamConfigModal();

      this.router.navigate([
        this.examConfigMode === 'exam' ? '/test' : '/review-test'
      ]);

    } catch (error: any) {
      console.log(error);
    }
  }


  async startQuestionModeWithSelectedQuestions() {
    const topicsSelected = this.localStorageService.getItem("topicsSelected");

    if (!topicsSelected || topicsSelected.length === 0) {
      this.showToastMsg(
        this.examConfigMode === 'exam'
          ? 'No hay temario seleccionado para realizar el examen.'
          : 'No hay temario seleccionado para realizar el repaso.'
      );
      return;
    }

    const numberOfQuestions = this.getSelectedQuestionNumber();

    if (!numberOfQuestions || numberOfQuestions <= 0) {
      this.showToastMsg('Introduce un número de preguntas válido.');
      return;
    }

    const topicIds = topicsSelected.map((topic: any) => topic.id);

    try {
      this.questions = await this.requestService.request(
        'POST',
        `/quiz/generate`,
        { topicIds, numberOfQuestions },
        {}
      );

      if (this.questions.length === 0) {
        this.showToastMsg(
          this.examConfigMode === 'exam'
            ? 'El temario seleccionado no tiene preguntas todavía para realizar un examen.'
            : 'El temario seleccionado no tiene preguntas todavía para realizar un repaso.'
        );
        return;
      }

      const limitedQuestions = this.questions.slice(0, numberOfQuestions);

      this.localStorageService.setItem("examQuestions", limitedQuestions);
      this.closeExamConfigModal();

      this.router.navigate([
        this.examConfigMode === 'exam' ? '/test' : '/review-test'
      ]);

    } catch (error: any) {
      console.log(error);
    }
  }




}
