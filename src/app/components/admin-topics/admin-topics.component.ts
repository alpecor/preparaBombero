import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-admin-topics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-topics.component.html',
  styleUrl: './admin-topics.component.css'
})
export class adminTopicsComponent {

  @Input() topics:any;
  @Input() margin:number= -1;


  constructor(private localStorageService:LocalStorageService, private requestService: RequestService){}


//************************* FUNCIONES PARA CREACIÓN DE SUBTOPIC ****************************//

  openModalCreateSubtopic(topicId: number) {
    const modalReport = document.getElementById('crearSubtopicSon');
    this.localStorageService.setItem("topicId", topicId);
    if (modalReport) {
      modalReport.classList.remove('hidden');
    }
  }

  closeModalCreateSubtopic() {
    const modalReport = document.getElementById('crearSubtopicSon');
    if (modalReport) {
      (document.getElementById('subtopicName') as HTMLTextAreaElement).value = "";
      modalReport.classList.add('hidden');
      this.localStorageService.removeItem("topicId");
    }
  }

  async createSubtopic() {
    // Obtener el título del subtema del modal
    const subtopicTitle = (document.getElementById('subtopicName') as HTMLTextAreaElement).value;
    // Verifica que el campo título del subtema no esté vacío
    if (!subtopicTitle || subtopicTitle.trim().length === 0) {
      alert("El campo del título no puede estar vacío");
      return;
    }
    const payload = {title: subtopicTitle, parentId: this.localStorageService.getItem("topicId"), type: "SECONDARY" }
    // realizar la petición de creación del subtema
    try{
      await this.requestService.request('POST', '/topic', payload, {}, true);
      //cerrar el modal cuando se cree el subtema
      this.closeModalCreateSubtopic();
      alert("se ha creado el Subtema");
      window.location.reload();
    }catch(error: any){
      console.log(error);
    }
  }



//************************* FUNCIONES PARA ELIMINACIÓN DE SUBTOPIC ****************************//

  openModalDeleteSubtopic(topicId:number) {
    this.localStorageService.setItem("topicId", topicId);
    const deleteSubtopic = document.getElementById('deleteSubtopic');
    if (deleteSubtopic) {
      deleteSubtopic.classList.remove('hidden');
    }
  }

  closeModalDeleteSubtopic(){
    const deleteSubtopic = document.getElementById('deleteSubtopic');
    if (deleteSubtopic) {
      deleteSubtopic.classList.add('hidden');
      this.localStorageService.removeItem("topicId");
    }
  }

  async deleteSubtopic(){
    try{
      // realizar la petición de eliminaciópn del tema
      await this.requestService.request('DELETE', '/topic/' + this.localStorageService.getItem("topicId"), {}, {}, true);
      //cerrar el modal cuando se cree el tema
      this.closeModalDeleteSubtopic();
      //llamar a ngOnInit para volver a cargar los temas automáticamente
      //this.ngOnInit();
      alert("se ha eliminado el tema");
      window.location.reload();
    }catch(error: any){
      console.log(error);
    }
  }


//************************* FUNCIONES PARA EDITAR LOS TÍTULOS DE LOS SUBTEMAS ****************************//

  async editTitleSubtopic(event: Event, topic:any){
    const inputElement = event.target as HTMLInputElement;
    const title = inputElement.value;
    const payload = {parentId: topic.parentId, title: title, type: "SECONDARY"};
    try{
      await this.requestService.request('PUT', '/topic/' + topic.id, payload, {}, true);
    }catch(error: any){
      console.log(error);
    }
  }
}

