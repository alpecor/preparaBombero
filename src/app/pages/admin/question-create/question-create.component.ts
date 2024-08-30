import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
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
    const topicDetails = await this.requestService.request('GET', `http://localhost:3000/topic/${this.topicId}`, {}, {}, true);
    this.topicTitle = topicDetails.title;
    // Hace la petición a la base de datos para obtener las preguntas del id capturado
    this.questions = await this.requestService.request('GET',`http://localhost:3000/quiz?topicId=${this.topicId}`, {}, {}, true);
    console.log(this.questions);
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


//************************* FUNCIÓNES PARA APERTURA Y CIERRE DEL MODAL ****************************//

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
  }


  //******************** FUNCIÓNES PARA CREACIÓN Y ELIMINACIÓN DE PREGUNTAS **********************//

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
      await this.requestService.request('POST', 'http://localhost:3000/quiz', payload, {}, true);
      alert("Se ha creado la pregunta");
      this.ngOnInit();
      this.closeModal();
    }catch(error){
      console.log(error);
    }
  }

  async deleteQuestion(questionId:number) {
    try{
      await this.requestService.request('DELETE', 'http://localhost:3000/quiz', {}, {}, true);
      alert("Se ha eliminado la pregunta");
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
      console.log("se abre eliminación de pregunta");
    }
  }

  closeRemoveQuestionModal() {
    const modalRemove = document.getElementById('removeQuestionModal');
    if (modalRemove) {
      modalRemove.classList.add('hidden');
      this.idQuestionToRemove = null; // Resetea el índice al cerrar el modal
      console.log("se da en cancelar eliminación de pregunta");
    }
  }

  async RemoveQuestion() {
    try{
      if (this.idQuestionToRemove !== null) {
        const data = await this.requestService.request('DELETE', `http://localhost:3000/quiz/${this.idQuestionToRemove}`, {}, {}, true);
        console.log(data);
        this.ngOnInit();
        this.idQuestionToRemove = null;// Resetea el índice después de eliminar
        this.closeRemoveQuestionModal(); // Cierra el modal después de eliminar
      }
    }catch (error){
      console.log(error);
    }
  }




}
