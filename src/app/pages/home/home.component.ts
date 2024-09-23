import { Component} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { Router, RouterLink } from '@angular/router';
import { topicsComponent } from '../../components/topics/topics.component';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule, NgOptimizedImage, RouterLink, topicsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router,private requestService: RequestService, private localStorageService: LocalStorageService){}

  questions:string[] = []; //definir array donde guardaremos las preguntas

  // Función que se llama al hacer clic en el botón para empezar el examen
  async startExam() {

    try{
      const user = await this.requestService.request('GET', `/user`,{},{},true);

      // Validación de subscripción
      if(!user.subscribed){
        alert("Esto es una función PREMIUM, debes subscribirte");
        return;
      }

      // Validación para el usuario "demo"
      const topicsSelected = this.localStorageService.getItem("topicsSelected");
      if (user.name === 'demo') {
        if (!topicsSelected || topicsSelected.length !== 1 || topicsSelected[0].id !== 662) {
          alert("El usuario demo solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
          return;
        }
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
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds},{},true);
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
      const user = await this.requestService.request('GET', `/user`, {}, {}, true);

      // Realizar petición para generar preguntas solo del tema seleccionado
      const questions = await this.requestService.request('POST', `/quiz/generate`, { topicIds: [topicId] }, {}, true);

      if(user.name === "demo" && topicId !== 662){
        alert("El usuario demo solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
        return;
      }

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.log(error);
    }
  }




   // Función que se llama al hacer clic en el botón para empezar el repaso
   async startReview() {
    const user = await this.requestService.request('GET', `/user`,{},{},true);

    if(!user.subscribed){
      alert("Esto es una función PREMIUM, debes subscribirte");
      return;
    }

    // Obtener los temas seleccionados del localStorage
    const topicsSelected = this.localStorageService.getItem("topicsSelected");

    if (user.name === 'demo') {
      if (!topicsSelected || topicsSelected.length !== 1 || topicsSelected[0].id !== 662) {
        alert("El usuario demo solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
        return;
      }
    }

    if (!topicsSelected || topicsSelected.length === 0) {
      alert("No hay temario seleccionado para realizar el repaso.");
      return;
    }

    // Extraer los IDs de los temas seleccionados
    const topicIds = topicsSelected.map((topic: any) => topic.id);

    // Hacer la solicitud POST al backend
    try{
      this.questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds},{},true);
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

    // Navegar a la vista del examen
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
  try{
    // Solicita los temas desde el servidor
    this.topics = await this.requestService.request('GET', `/topic`,{},{},true);

    Object.keys(this.topics).forEach(key => {
      // Iterando sobre el array correspondiente a cada clave
      this.topics[key] = this.topics[key].map((x: any) => {
          let topicSelected = this.localStorageService.getItem("topicsSelected") || [];
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
    const isChecked: boolean = event.target.checked;
    let topicSelected = this.localStorageService.getItem("topicsSelected") || [];
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

}


