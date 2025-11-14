import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.css'
})
export class topicsComponent implements OnInit {
  @Input() topics:any;
  @Input() margin:number= -1;

  //variables para mostrar mensaje de pregunta guardada
  showSavedToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private router: Router, private localStorageService:LocalStorageService, private requestService: RequestService){}
  async ngOnInit() {
   

    let topicSelected = this.localStorageService.getItem("topicsSelected") ?? [];
    if(this.topics.length > 0){
      this.topics = this.topics.map((x:any) =>{
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
    }
  }

  selectedTopic(topicId: number, event: any) {
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
    updateTopicSelection(this.topics, topicId, isChecked);

    this.localStorageService.setItem("topicsSelected", topicSelected);
  }



  // función para manejar el clic en la flecha
  async startExamForSpecificTopic(topicId: number) {
    try {
       // Realizar petición para saber si el usuario es demo
       const user = await this.requestService.request('GET', `/user`,{},{}, true);
      // const subscribed = user.subscribed == true;
      // if(!subscribed && topicId !== 662){
      //   alert("Los usuarios no subscritos solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
      //   return;
      // }

      // Realizar petición para generar preguntas solo del tema seleccionado
      const questions = await this.requestService.request('POST', `/quiz/generate`, { topicIds: [topicId] }, {});
      if (questions.length === 0) {
        this.showToast('El temario seleccionado no tiene preguntas todavía para realizar un examen.', 'error');
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


  //************************* FUNCION PRA TOAST ****************************//
  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showSavedToast = true;

    setTimeout(() => {
      this.showSavedToast = false;
    }, 2500); //el mensaje se queda 2 segundo y medio
  }


  // Función que se llama al hacer clic en el botón para empezar el repaso
  async startReviewForSpecificTopic(topicId:number) {
    try{
      // Hacer la solicitud POST al backend
      const questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds: [topicId]},{});
      if (questions.length === 0) {
        this.showToast('El temario seleccionado no tiene preguntas todavía para realizar un repaso.', 'error');
        return;
      }
      //Guardar las preguntas generadas en localStorage
      this.localStorageService.setItem("examQuestions", questions);
      this.router.navigate(['/review-test']);
    }catch(error: any){
      console.log(error);
    }
  }
}

