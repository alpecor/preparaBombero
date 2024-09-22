import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../services/request.service';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [EditorModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './question-create.component.html',
  styleUrl: './question-create.component.css'
})
export class QuestionCreateComponent implements OnInit{

  topicId:number = -1; //para almacenar el id que viene por URL
  questions: any[] = [];
  topicTitle: string = ''; // para almacenar el título del tema
  idQuestionToRemove: number | null = null;

  constructor(private route: ActivatedRoute, private requestService: RequestService) {}


  async ngOnInit(): Promise<void> {
    //capturamos el id que se pasa por URL
    this.topicId = Number (this.route.snapshot.paramMap.get('topicId'));
    //obtener título del tema
    const topicDetails = await this.requestService.request('GET', `/topic/${this.topicId}`, {}, {}, true);
    this.topicTitle = topicDetails.title;
    // Hace la petición a la base de datos para obtener las preguntas del id capturado
    this.questions = await this.requestService.request('GET',`/quiz?topicId=${this.topicId}`, {}, {}, true);
    // Transformar las opciones en un array
    this.questions = this.questions.map(question => ({
      ...question,
      options: [
        { letter: 'A', text: question.option1 },
        { letter: 'B', text: question.option2 },
        { letter: 'C', text: question.option3 },
        { letter: 'D', text: question.option4 }
      ]
    }));
  }


//************* FUNCIÓNES PARA APERTURA Y CIERRE DEL MODAL DE CREAR PREGUNTA ***************//

  openModal() {
    const modalCreate = document.getElementById('createQuestion');
    if (modalCreate) {
      modalCreate.classList.remove('hidden');
    }
  }

  closeModal() {
    const modalCreate = document.getElementById('createQuestion');
    if (modalCreate) {
      modalCreate.classList.add('hidden');
    }
    //limpiar los campos de crear preguntas
    (document.getElementById('questionTitle') as HTMLTextAreaElement).value = "";
    (document.getElementById('optionA') as HTMLTextAreaElement).value = "";
    (document.getElementById('optionB') as HTMLTextAreaElement).value = "";
    (document.getElementById('optionC') as HTMLTextAreaElement).value = "";
    (document.getElementById('optionD') as HTMLTextAreaElement).value = "";
    (document.getElementById('result') as HTMLTextAreaElement).value = "";
    (document.getElementById('justification') as HTMLTextAreaElement).value = "";
  }


  //************************** FUNCIÓN PARA CREACIÓN DE PREGUNTAS ***************************//

  async createQuestion() {
    const title = (document.getElementById('questionTitle') as HTMLTextAreaElement).value;
    const option1 = (document.getElementById('optionA') as HTMLTextAreaElement).value;
    const option2 = (document.getElementById('optionB') as HTMLTextAreaElement).value;
    const option3 = (document.getElementById('optionC') as HTMLTextAreaElement).value;
    const option4 = (document.getElementById('optionD') as HTMLTextAreaElement).value;
    const result = (document.getElementById('result') as HTMLTextAreaElement).value;
    const justification = (document.getElementById('justification') as HTMLTextAreaElement).value;
    const payload = {title: title, option1: option1, option2: option2, option3: option3, option4: option4, result: result, topicId: this.topicId, justification: justification};
    try{
      await this.requestService.request('POST', '/quiz', payload, {}, true);
      alert("Se ha creado la pregunta");
      this.ngOnInit();
      this.closeModal();
    }catch(error){
      console.log(error);
    }
  }


//************************* FUNCIONES PARA APERTURA, CIERRE y ELIMINACIÓN DE PREGUNTA ****************************//

  openRemoveQuestionModal(index: number) {
    this.idQuestionToRemove = index; // Almacena el índice de la pregunta a eliminar
    const modalRemove = document.getElementById('removeQuestionModal');
    if (modalRemove) {
      modalRemove.classList.remove('hidden');
    }
  }

  closeRemoveQuestionModal() {
    const modalRemove = document.getElementById('removeQuestionModal');
    if (modalRemove) {
      modalRemove.classList.add('hidden');
      this.idQuestionToRemove = null; // Resetea el índice al cerrar el modal
    }
  }

  async RemoveQuestion() {
    try{
      if (this.idQuestionToRemove !== null) {
        await this.requestService.request('DELETE', `/quiz/${this.idQuestionToRemove}`, {}, {}, true);
        this.ngOnInit();
        this.idQuestionToRemove = null;// Resetea el índice después de eliminar
        this.closeRemoveQuestionModal(); // Cierra el modal después de eliminar
        alert("Se ha eliminado la pregunta");
      }
    }catch (error){
      console.log(error);
    }
  }




}
