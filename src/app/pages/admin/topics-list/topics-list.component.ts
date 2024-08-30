import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RequestService } from '../../../services/request.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { adminTopicsComponent } from '../../../components/admin-topics/admin-topics.component';


@Component({
  selector: 'app-topics-list',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, adminTopicsComponent, RouterLink],
  templateUrl: './topics-list.component.html',
  styleUrl: './topics-list.component.css'
})
export class TopicsListComponent implements OnInit{

  constructor(private router: Router, private requestService: RequestService, private http: HttpClient){}

  topics: any = {};
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  topicIdToAdd: number | null = null; // Almacena el índice del tema padre al subtema a añadir


 async ngOnInit(): Promise<void> {
  try{
    // se realiza peticíon para obtener los temas
    this.topics = await this.requestService.request('GET', `http://localhost:3000/topic`,{},{},true);
    }catch(error: any){
      this.router.navigate(['/error']);
    }
  }



//************************* FUNCIONES APERTURA, CIERRE Y CREACIÓN DE TOPIC ****************************//

  openModalCreateTopic() {
    const modalReport = document.getElementById('crearTema');
    if (modalReport) {
      modalReport.classList.remove('hidden');
    }
  }

  closeModalCreateTopic() {
    const modalReport = document.getElementById('crearTema');
    if (modalReport) {
      modalReport.classList.add('hidden');
    }
  }

  async createTopic() {
    const title = (document.getElementById('title') as HTMLTextAreaElement).value;
    const categoryTitle = (document.getElementById('categoryTitle') as HTMLTextAreaElement).value;
    const payload = {title: title, categoryTitle: categoryTitle, type: "PRIMARY"};
    try{
      await this.requestService.request('POST', 'http://localhost:3000/topic', payload, {}, true);
      this.ngOnInit();
      alert("Se ha creado el tema");
      this.closeModalCreateTopic();
    }catch(error){
      console.log(error);
    }
  }


//************************* FUNCIONES PARA ELIMINACIÓN DE TOPIC ****************************//

  openModalDeleteTopic(topicId:number) {
    this.topicIdToAdd = topicId;
    const deleteTopic = document.getElementById('deleteTopic');
    if (deleteTopic) {
      deleteTopic.classList.remove('hidden');
    }
  }

  closeModalDeleteTopic(){
    const deleteTopic = document.getElementById('deleteTopic');
    if (deleteTopic) {
      deleteTopic.classList.add('hidden');
    }
    this.topicIdToAdd = null;
  }

  async deleteTopic(){
    try{
      // realizar la petición de eliminaciópn del tema
      await this.requestService.request('DELETE', 'http://localhost:3000/topic/' + this.topicIdToAdd , {}, {}, true);
      //cerrar el modal cuando se cree el tema
      this.closeModalDeleteTopic();
      //llamar a ngOnInit para volver a cargar los temas automáticamente
      this.ngOnInit();
      alert("se ha eliminado el tema");
    }catch(error: any){
      console.log(error);
    }
  }


//************************* FUNCIONES APERTURA, CIERRE Y CREACIÓN DE SUBTOPIC DESDE EL TEMA ****************************//

  openModalSubtopic(topicId:number) {
    this.topicIdToAdd = topicId;
    const modalReport = document.getElementById('crearSubtopic');
    if (modalReport) {
      modalReport.classList.remove('hidden');
      console.log("se abre el modal de preguntas");
    }
  }

  closeModalSubtopic() {
    const modalReport = document.getElementById('crearSubtopic');
    if (modalReport) {
      modalReport.classList.add('hidden');
      this.topicIdToAdd = null;
      console.log("se da en cancelar ahora");
    }
  }

  async createSubtopic() {
    // Obtener el título del subtema del modal
    const subtopicTitle = (document.getElementById('subtopicTitle') as HTMLTextAreaElement).value;
    // Verifica que el campo título del subtema no esté vacío
    if (!subtopicTitle || subtopicTitle.trim().length === 0) {
      alert("El campo del título no puede estar vacío");
      return;
    }
    const payload = {title: subtopicTitle, parentId: this.topicIdToAdd, type: "SECONDARY" }
    // realizar la petición de creación del subtema
    try{
      await this.requestService.request('POST', 'http://localhost:3000/topic', payload, {}, true);
      //cerrar el modal cuando se cree el subtema
      this.closeModalSubtopic();
      //llamar a ngOnInit para volver a cargar los temas automáticamente
      this.ngOnInit();
      alert("se ha creado el Subtema");
    }catch(error: any){
      console.log(error);
    }
  }


//************************* FUNCIONES PARA EDITAR LOS TÍTULOS DE LOS TEMAS ****************************//

  async editTitle(event: Event, topic:any){
    const inputElement = event.target as HTMLInputElement;
    const title = inputElement.value;
    const payload = {categoryTitle: topic.categoryTitle, title: title, type: "PRIMARY"};
    try{
      await this.requestService.request('PUT', 'http://localhost:3000/topic/' + topic.id, payload, {}, true);
      //cerrar el modal cuando se cree el subtema
      //llamar a ngOnInit para volver a cargar los temas automáticamente
      this.ngOnInit();
    }catch(error: any){
      console.log(error);
    }
  }


}

