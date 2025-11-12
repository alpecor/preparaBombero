import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Router, RouterLink } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import {Title} from "@angular/platform-browser";



@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule, HeaderComponent, PaginatorModule, RouterLink],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent implements OnInit {

  constructor(private titleService:Title, private requestService:RequestService, private localStorageService: LocalStorageService, private router: Router, private authService: AuthService) {
    this.titleService.setTitle("PreparaBombero - " + this.localStorageService.getItem('examenName')?.examenName);
  }

  //************************* DEFINICIÓN DE VARIABLES ****************************//

  examQuestion:any = this.localStorageService.getItem("examQuestions"); //aquí se guardan las preguntas del examen
  idReportedQuestion: number | null = null; //aquí se guardan las preguntas reportadas
  reportedQuestion: string[] = [];
  userResponses: { quizId: number, optionSelected: string }[] = []; // Array para almacenar las respuestas del usuario
  page: any = {page: 0, first:0}
  questionsPerPage:any = 20;
  savedQuestions = [];  // ids de preguntas guardadas
  //variables para mostrar mensaje de pregunta guardada
  showSavedToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  //variables para saber si esta subscrito el usuario y poder guardar preguntas
  isSubscribed = false;



  //************************* ngOnInit ****************************//
  ngOnDestroy() {
    this.localStorageService.removeItem('examQuestions');
    this.localStorageService.removeItem('examenName');
    this.titleService.setTitle("PreparaBombero");
  }

  async ngOnInit(){
    
    // aqui obtenemos las preguntas guardadas si el usuario está subscrito
    if(this.isSubscribed){
      this.savedQuestions = await this.requestService.request('GET', `/quiz/favorite`,{},{}, true);
    }

    try {
      const user = await this.requestService.request('GET', '/user', {}, {}, true);
      this.isSubscribed = user.subscribed === true;
    } catch (err) {
      this.isSubscribed = false;
    }
  
    
    if (!this.examQuestion || this.examQuestion.length === 0) {
      location.href="/";
      return;
    }

    // Inicializar userResponses con el id de cada pregunta y optionSelected como vacío
    this.userResponses = this.examQuestion.map((question: any) => {
      return {
        quizId: question.id,
        optionSelected: null // Inicialmente vacío
      };
    });

    //para recorrer las opciones de respuestas
    this.examQuestion = this.examQuestion.map((question:any) => {
      return {
        ...question,
        respuestas: [question.option1, question.option2, question.option3, question.option4]
      };
    });
  }




  //************************* FUNCIONES PARA RECOGER LAS OPCIONES SEÑALADAS EN EL EXAMEN ****************************//

  onSelectAnswer(questionIndex: number, answer: string) {
    // Actualizar la opción seleccionada en userResponses
    this.userResponses[questionIndex].optionSelected = answer;
  }



  //************************* FUNCIONES PARA APERTURA, CIERRE y ENVIO DEL MODAL DE REPORTE ****************************//

  openModal(questionId:number) {
    this.idReportedQuestion = questionId; // Almacena el ID de la pregunta seleccionada
    const modalReport = document.getElementById('reportModal');
    const reportReason = (document.getElementById('reportReason') as HTMLTextAreaElement);
    if (modalReport) {
      modalReport.classList.remove('hidden');
      reportReason.value = ''; // Limpiar el campo del motivo del reporte
    }
  }

  closeModal() {
    this.idReportedQuestion = null; // Limpiar el ID seleccionado
    const modalReport = document.getElementById('reportModal');
    if (modalReport) {
      modalReport.classList.add('hidden');
    }
  }

  async sendReport() {
    // Obtener el motivo del reporte desde el textarea
    const reportReason = (document.getElementById('reportReason') as HTMLTextAreaElement).value;
    // Verifica que el campo no esté vacío
    if (!reportReason || reportReason.trim().length === 0) {
      alert("El campo del motivo no puede estar vacío");
      return;
    }
    // realizar la petición del reporte
    try{
      this.reportedQuestion = await this.requestService.request('POST', `/report`,{reason: reportReason, quizId:this.idReportedQuestion},{}, true);
      this.closeModal();
      alert("se ha enviado el reporte de la pregunta.");
    }catch(error: any){
      console.log(error);
    }
  }


  //************************* FUNCIONES PARA GUARDAR PREGUNTA DESTACADA ****************************//
  

  isQuestionSaved(id: number): boolean {
    if(this.savedQuestions.filter((x: any)=> x.id == id).length > 0){
      return true
    } else{
      return false
    }
  }


  async questionSaved(id: number): Promise<void> {
    if (!this.isSubscribed) {
      this.showToast('Esta es una funcionalidad PREMIUM solo para usuarios subscritos.','error');
      return;
    }

    if(this.savedQuestions.filter((x: any)=> x.id == id).length > 0){
      await this.requestService.request('DELETE', `/quiz/${id}/favorite`,{},{}, true);
      this.savedQuestions = await this.requestService.request('GET', `/quiz/favorite`,{},{}, true);
      this.showToast('Se ha quitado la pregunta de la sección preguntas guardadas.', 'error');
    } else{
      await this.requestService.request('POST', `/quiz/favorite`,{quizId: id},{}, true);
      this.savedQuestions = await this.requestService.request('GET', `/quiz/favorite`,{},{}, true); 
      this.showToast('Se ha guardado la pregunta en la sección preguntas guardadas.', 'success');
    }
  }


  private showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showSavedToast = true;

    setTimeout(() => {
      this.showSavedToast = false;
    }, 2500); //el mensaje se queda 2 segundo y medio
  }


  //************************* FUNCIONES PARA CONTROLAR LA PAGINACIÓN Y PREGUNTAS POR PÁGINA ****************************//

  onPageChange($event: PaginatorState) {
    this.page = $event;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  progress() {
    const endQuestion = Math.min((this.page.page + 1) * this.questionsPerPage, this.examQuestion.length);
    const progress = (endQuestion / this.examQuestion.length) * 100;
    return Math.min(progress, 100); // para asegurar de que el valor no exceda 100%
  }

  progressText() {
    const startQuestion = this.page.page  * this.questionsPerPage + 1;
    const endQuestion = Math.min((this.page.page+1) * this.questionsPerPage, this.examQuestion.length);
    return `${startQuestion}-${endQuestion} de ${this.examQuestion.length}`;
  }




  //************************* FUNCIÓNES PARA EL ENVÍO DEL TEST ****************************//

  openModalTest() {
    const modalTest = document.getElementById('finishTest');
    if (modalTest) {
      modalTest.classList.remove('hidden');
    }
  }

  closeModalTest() {
    const modalTest = document.getElementById('finishTest');
    if (modalTest) {
      modalTest.classList.add('hidden');
    }
  }

  async sendTest() {
    try{
      // Encapsula el array userResponses dentro de un objeto con la clave 'quizzes'
      const payload = {quizzes: this.userResponses, type: "EXAM"};

      // Hacer la petición POST al backend para corregir el examen
      const response = await this.requestService.request('POST', '/quiz/check', payload, {}, true);

      // Guardar las preguntas corregidas y las respuestas del usuario en el localStorage
      this.localStorageService.setItem('correctedExamQuestions', response.quizzes);
      this.localStorageService.setItem('userAnswer', this.userResponses);

      // Guardar el resumen del resultado en el localStorage
      const summary = {
        correctAnswers: response.success,
        incorrectAnswers: response.fail,
        unansweredQuestions: response.not_answered
      };
      this.localStorageService.setItem('examSummary', summary);

      // Redirigir al componente de chequeo de examen
      this.router.navigate(['/check-exam']);

      //eliminar del localStorage las preguntas del examen
      this.localStorageService.removeItem('examQuestions')

    }catch(error){
      console.log(error);
    }
    const modalTest = document.getElementById('finishTest');
    if (modalTest) {
      modalTest.classList.add('hidden');
    }
  }

}
