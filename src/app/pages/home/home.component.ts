import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { Router, RouterLink } from '@angular/router';
import { topicsComponent } from '../../components/topics/topics.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule, FormsModule, NgOptimizedImage, RouterLink, topicsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  //************************* VARIABLES ****************************//
  questions:string[] = []; //definir array donde guardaremos las preguntas
  not_auth: boolean = !this.authService.isNotAuth();
  isSubscribed = false;
  topics: any = {};
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  //configurar preguntas examen y repaso
  showExamConfigModal = false;
  questionOptions: number[] = [10, 25, 50, 100, 200];
  selectedQuestionOption: number | null = 50;
  customQuestionNumber: number | null = null;
  maxAvailableQuestions = 0;
  examModalSubtitle = '';
  examConfigMode: 'exam' | 'review' = 'exam';
  specificTopicId: number | null = null;


  //************************* CONSTRUCTOR ****************************//
  constructor(private router: Router, private authService: AuthService, private requestService: RequestService, private localStorageService: LocalStorageService){
  }


  //************************* ngOnInit ****************************//
  async ngOnInit(): Promise<void> {
     // Recalcular auth por si cambió
    this.not_auth = !this.authService.isNotAuth();
    // Solo mostrar modal si el usuario está logueado
    if (this.not_auth && !localStorage.getItem('modalShown')) {
      this.openModalTest();                  // Abre el modal solo tras login
      localStorage.setItem('modalShown', 'true');
    }

    try {
      // pedimos info del user para saber si esta o no subscrito
      if (this.not_auth) {
        const user = await this.requestService.request('GET', `/user`,{},{}, true);
        this.isSubscribed = user.subscribed;
      }
      // Solicita los temas desde el servidor
      this.topics = await this.requestService.request('GET', `/topic`,{},{}, true);

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
    }catch(error: any){
      this.router.navigate(['/error']);
    }
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
  }



  //************************* FUNCIONES PARA CONFIGURAR PREGUNTAS EN EXAMEN Y REPASO ****************************//
  openQuestionConfigModal(mode: 'exam' | 'review', topic?: any) {
    this.examConfigMode = mode;
    this.specificTopicId = topic?.id ?? null;

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


  closeExamConfigModal() {
    this.showExamConfigModal = false;
    this.specificTopicId = null;
  }


  selectQuestionOption(option: number) {
    this.selectedQuestionOption = option;
    this.customQuestionNumber = null;
  }


  onCustomQuestionInput() {
    this.selectedQuestionOption = null;
  }


  getSelectedQuestionNumber(): number {
    if (this.customQuestionNumber) {
      return Math.min(this.customQuestionNumber, this.maxAvailableQuestions);
    }

    return Math.min(this.selectedQuestionOption ?? this.maxAvailableQuestions, this.maxAvailableQuestions);
  }


  getSelectedTopicsQuestionCount(): number {
    const topicsSelected = this.localStorageService.getItem("topicsSelected") ?? [];
    const selectedIds = topicsSelected.map((topic: any) => topic.id);

    let total = 0;

    const walk = (items: any[]) => {
      items?.forEach(topic => {
        if (selectedIds.includes(topic.id)) {
          total += Number(topic.quizCount || 0);
        }

        if (Array.isArray(topic.topics) && topic.topics.length > 0) {
          walk(topic.topics);
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

    if (this.specificTopicId) {
      await this.startQuestionModeForSpecificTopic();
      return;
    }

    await this.startQuestionModeWithSelectedQuestions();
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
