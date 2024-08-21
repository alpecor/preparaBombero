import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  constructor(private localStorageService:LocalStorageService){}
  ngOnInit(): void {
    if(this.topics.length > 0){
      console.log(this.topics);
      this.topics = this.topics.map((x:any) =>{
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
    }
  }

  selectedTopic(topicId: number, event: any) {
    const isChecked: boolean = event.target.checked;
    console.log(topicId);
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
                console.log(`Actualizando ${topic.id} a seleccionado: ${isSelected}`);

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
    console.log(this.topics, topicId);
  }



    // let topicSelected = this.localStorageService.getItem("topicsSelected") || [];
    // // Actualizar la variable topic
    // const index = this.topics[key].findIndex((x:any)=> x.id == topicId);
    // this.topics[key][index].selected = isChecked;
    // console.log(this.topics, key, index);
}

