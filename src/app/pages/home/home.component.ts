import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { Router, RouterLink } from '@angular/router';
import { topicsComponent } from '../../components/topics/topics.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule, NgOptimizedImage, RouterLink, topicsComponent],
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


  //************************* CONSTRUCTOR ****************************//
  constructor(private router: Router, private authService: AuthService, private requestService: RequestService, private localStorageService: LocalStorageService){
  }


  //************************* ngOnInit ****************************//
  async ngOnInit(): Promise<void> {
    const modalShown = localStorage.getItem('modalShown');
    if (!modalShown) {
      this.openModalTest();  // Abre el modal si no se ha mostrado antes
      localStorage.setItem('modalShown', 'true');  // Marca como mostrado
    }
    try {
      // pedimos info del user para saber si esta o no subscrito
      let subscribed;
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


  //************************* FUNCION PARA MOSTAR FUNCIONALIDAD PREMIUM EN EXAMEN Y REPASO ****************************//
  onStartExam() {
    if (!this.isSubscribed) {
      this.showToastMsg('Funcionalidad PREMIUM: necesitas estar subscrito para realizar exámenes por temas.');
      return;
    }
    this.startExam(); // tu función existente
  }


  onStartReview() {
    if (!this.isSubscribed) {
      this.showToastMsg('Funcionalidad PREMIUM: necesitas estar subscrito para realizar el repaso por temas.');
      return;
    }
    this.startReview(); // tu función existente
  }


  //************************* FUNCION AL HACER CLICK EN EMPEZAR EXAMEN ****************************//
  async startExam() {
    // Obtener los temas seleccionados del localStorage
    const topicsSelected = this.localStorageService.getItem("topicsSelected");
    if (!topicsSelected || topicsSelected.length === 0) {
      this.showToastMsg('No hay temario seleccionado para realizar el examen.');
      return;
    }
    // Extraer los IDs de los temas seleccionados
    const topicIds = topicsSelected.map((topic: any) => topic.id);
    // Hacer la solicitud POST al backend
    try{
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds},{});
      if (this.questions.length === 0) {
        this.showToastMsg('El temario seleccionado no tiene preguntas todavía para realizar un examen.');
        return;
      }
      //Guardar las preguntas generadas en localStorage
      this.localStorageService.setItem("examQuestions", this.questions);
      this.router.navigate(['/test']);
    }catch(error: any){
      console.log(error);
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
    if (!this.isSubscribed) {
      this.showToastMsg('Funcionalidad PREMIUM: necesitas estar subscrito para realizar exámenes por tema.');
      return;
    }
    try {
      // Realizar petición para generar preguntas solo del tema seleccionado
      const questions = await this.requestService.request('POST', `/quiz/generate`, { topicIds: [topicId] }, {});
      if (questions.length === 0) {
        this.showToastMsg('El temario seleccionado no tiene preguntas todavía para realizar un examen.');
        return;
      }
      // Limitar las preguntas a un máximo de 100
      const limitedQuestions = questions.slice(0, 100);
      // Guardar las preguntas limitadas en localStorage
      this.localStorageService.setItem("examQuestions", limitedQuestions);
      // Navegar a la vista del examen
      this.router.navigate(['/test']);
    } catch (error: any) {
      console.log(error);
    }
  }


  //************************* FUNCION AL HACER CLICK EN EMPEZAR REPASO ****************************//
  async startReview() {
    const topicsSelected = this.localStorageService.getItem("topicsSelected");
    // Obtener los temas seleccionados del localStorage
    if (!topicsSelected || topicsSelected.length === 0) {
      this.showToastMsg('No hay temario seleccionado para realizar el repaso.');
      return;
    }
    // Extraer los IDs de los temas seleccionados
    const topicIds = topicsSelected.map((topic: any) => topic.id);
    // Hacer la solicitud POST al backend
    try{
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds},{});
      if (this.questions.length === 0) {
        this.showToastMsg('El temario seleccionado no tiene preguntas todavía para realizar el repaso.');
        return;
      }
      //Guardar las preguntas generadas en localStorage
      this.localStorageService.setItem("examQuestions", this.questions);
      this.router.navigate(['/review-test']);
    }catch(error: any){
      console.log(error);
    }
  }

 
  //************************* FUNCION AL HACER CLICK EN EMPEZAR REPASO TEMA ESPECIFICO ****************************//
  async startReviewForSpecificTopic(topicId:number) {
    if (!this.isSubscribed) {
      this.showToastMsg('Funcionalidad PREMIUM: necesitas estar subscrito para realizar el repaso por tema.');
      return;
    }
    // Hacer la solicitud POST al backend
    try{
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds: [topicId]},{});
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


}
