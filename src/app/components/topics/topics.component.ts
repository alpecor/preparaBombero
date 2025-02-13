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

  constructor(private router: Router, private localStorageService:LocalStorageService, private requestService: RequestService){}
  async ngOnInit() {
    // pedimos info del user para saber si esta o no subscrito
    const user = await this.requestService.request('GET', `/user`,{},{}, true);
    const subscribed = user.subscribed;
    let topicSelected = this.localStorageService.getItem("topicsSelected") ?? [];
    // Si el localStorage está vacío, inicializa con el topic 662 y sus hijos
    if (topicSelected.length === 0 && !subscribed ) {
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
  async startReviewForSpecificTopic(topicId:number) {
    try{
      const user = await this.requestService.request('GET', `/user`,{},{}, true);
      const subscribed = user.subscribed == true;

      if(!subscribed && topicId !== 662){
        alert("Los usuarios no subscritos solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
        return;
      }

      // Hacer la solicitud POST al backend
      const questions = await this.requestService.request('POST', `/quiz/generate`,{topicIds: [topicId]},{});
      if (questions.length === 0) {
        alert("No hay suficientes preguntas para generarte un repaso.");
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

