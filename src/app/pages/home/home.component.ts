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

  questions:string[] = []; //definir array donde guardaremos las preguntas
  not_auth: boolean = !this.authService.isNotAuth();

  constructor(private router: Router, private authService: AuthService, private requestService: RequestService, private localStorageService: LocalStorageService){
  }

  // Función que se llama al hacer clic en el botón para empezar el examen
  async startExam() {
    try{
      const user = await this.requestService.request('GET', `/user`,{},{}, true);
      const subscribed = user.subscribed == true;

      // Validación de subscripción
      const topicsSelected = this.localStorageService.getItem("topicsSelected");
      if(!subscribed && topicsSelected?.filter((x: any) => x.id == 662).length <= 0){
        alert("Los usuarios no subscritos solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
        return;
      }
    }catch(error){
      console.log(error);
    }
    // Obtener los temas seleccionados del localStorage
    const topicsSelected = this.localStorageService.getItem("topicsSelected");



    if (!topicsSelected || topicsSelected.length === 0) {
      alert("No hay temario seleccionado para realizar el examen.");
      return;
    }

    // Extraer los IDs de los temas seleccionados
    const topicIds = topicsSelected.map((topic: any) => topic.id);

    // Hacer la solicitud POST al backend
    try{
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds},{});
      if (this.questions.length === 0) {
        alert("No hay suficientes preguntas para generarte un examen.");
        return;
      }
      //Guardar las preguntas generadas en localStorage
      this.localStorageService.setItem("examQuestions", this.questions);
      this.router.navigate(['/test']);
    }catch(error: any){
      console.log(error);
    }
  }

   // función para manejar el clic en la flecha
  async startExamForSpecificTopic(topicId: number) {
    try {
      // Realizar petición para saber si el usuario es demo
      const user = await this.requestService.request('GET', `/user`, {}, {});
      const subscribed = user.subscribed == true;
      if(!subscribed && topicId !== 662){
        alert("Los usuarios no subscritos solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
        return;
      }

      // Realizar petición para generar preguntas solo del tema seleccionado
      const questions = await this.requestService.request('POST', `/quiz/generate`, { topicIds: [topicId] }, {});
      if (questions.length === 0) {
        alert("El temario seleccionado no tiene preguntas todavía para realizar un examen.");
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




   // Función que se llama al hacer clic en el botón para empezar el repaso
   async startReview() {
    const user = await this.requestService.request('GET', `/user`,{},{}, true);
    const subscribed = user.subscribed == true;

    const topicsSelected = this.localStorageService.getItem("topicsSelected");
    if(!subscribed && topicsSelected?.filter((x: any) => x.id == 662).length <= 0){
      alert("Los usuarios no subscritos solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
      return;
    }

    // Obtener los temas seleccionados del localStorage
    if (!topicsSelected || topicsSelected.length === 0) {
      alert("No hay temario seleccionado para realizar el repaso.");
      return;
    }

    // Extraer los IDs de los temas seleccionados
    const topicIds = topicsSelected.map((topic: any) => topic.id);

    // Hacer la solicitud POST al backend
    try{
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds},{});
      if (this.questions.length === 0) {
        alert("No hay suficientes preguntas para generarte un repaso.");
        return;
      }
      //Guardar las preguntas generadas en localStorage
      this.localStorageService.setItem("examQuestions", this.questions);
      this.router.navigate(['/review-test']);
    }catch(error: any){
      console.log(error);
    }
  }

   // Función que se llama al hacer clic en el botón para empezar el repaso
   async startReviewForSpecificTopic(topicId:number) {
    const user = await this.requestService.request('GET', `/user`,{},{}, true);
    const subscribed = user.subscribed == true;

    if(!subscribed && topicId !== 662){
      alert("Los usuarios no subscritos solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
      return;
    }

    // Hacer la solicitud POST al backend
    try{
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds: [topicId]},{});
      if (this.questions.length === 0) {
        alert("No hay suficientes preguntas para generarte un repaso.");
        return;
      }
      //Guardar las preguntas generadas en localStorage
      this.localStorageService.setItem("examQuestions", this.questions);
      this.router.navigate(['/review-test']);
    }catch(error: any){
      console.log(error);
    }
  }




  //FUNCIÓN PARA EL MODAL
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

  topics: any = {};
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

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
    subscribed = user.subscribed;
  }
  // Si el localStorage está vacío, inicializa con el topic 662 y sus hijos
  let topicSelected = this.localStorageService.getItem("topicsSelected") ?? [];
  if (topicSelected.length === 0 && !subscribed) {
    topicSelected = [
      { id: 662, isChecked: true },
      { id: 1451, isChecked: true },
      { id: 1453, isChecked: true },
      { id: 1454, isChecked: true },
      { id: 1452, isChecked: true },
      { id: 1455, isChecked: true },
      { id: 1456, isChecked: true },
      { id: 1457, isChecked: true }
    ];
    this.localStorageService.setItem("topicsSelected", topicSelected);
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


  selectedTopic(topicId: number, event: any, key: string) {
    if (!this.not_auth) {
      return
    }

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



  // Función Deseleccionar todos los temas
  deselectAllTopics() {
    const clear = (arr: any[]) => {arr?.forEach(t => {t.selected = false;
        if (Array.isArray(t.topics) && t.topics.length) {
          clear(t.topics);
        }
      });
    };

    Object.keys(this.topics || {}).forEach(group => clear(this.topics[group] || []));
    this.localStorageService.setItem('topicsSelected', []);
  }






}
