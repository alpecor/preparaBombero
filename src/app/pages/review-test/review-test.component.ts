import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { RequestService } from '../../services/request.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TextSanitizerComponent } from '../../components/text-sanitizer/text-sanitizer.component';


@Component({
  selector: 'app-review-test',
  standalone: true,
  imports: [PaginatorModule, HeaderComponent, FooterComponent, CommonModule, NgOptimizedImage, TextSanitizerComponent],
  templateUrl: './review-test.component.html',
  styleUrl: './review-test.component.css'
})
export class ReviewTestComponent {

  //************************* VARIABLES ****************************//   
  examQuestion: any = this.localStorageService.getItem("examQuestions"); // Aquí se guardan las preguntas del examen
  idReportedQuestion: number | null = null; // Aquí se guardan las preguntas reportadas
  reportedQuestion: string[] = [];
  userResponses: { quizId: number, optionSelected: string }[] = []; // Array para almacenar las respuestas del usuario
  page: any = { page: 0, first: 0 }
  questionsPerPage: number = 1; // Cambiado a 1 para mostrar una pregunta por página
  isCorrected: boolean = false; // Controla si la pregunta ha sido corregida
  quizResult: string = ""; // Controla si la pregunta ha sido corregida
  savedQuestions = [];  // ids de preguntas guardadas
  //variables para mostrar mensaje de pregunta guardada
  showSavedToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  //variables para saber si esta subscrito el usuario y poder guardar preguntas
  isSubscribed = false;


  //************************* CONSTRUCTOR ****************************//
  constructor(private requestService: RequestService, private localStorageService: LocalStorageService, private router: Router) { }


  //************************* ngOnInit DESTROY ****************************//
  ngOnDestroy() {
    this.localStorageService.removeItem('examQuestions');
  }


  //************************* ngOnInit ****************************//
  async ngOnInit(): Promise<void> {
    //saber si el user esta subscrito para acceder a funcionalidad de preguntas guardadas
    try {
      const user = await this.requestService.request('GET', '/user', {}, {}, true);
      this.isSubscribed = user.subscribed === true;
    } catch (err) {
      this.isSubscribed = false;
    }
    // aqui obtenemos las preguntas guardadas
    this.savedQuestions = await this.requestService.request('GET', `/quiz/favorite`,{},{}, true);
    //aqui se cargan un arrya con todas las preguntas a responder y como respuesta null,
    //a la espera de que el user marque una respuesta
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


  //************************* CAMBIAR TEXTO DE BOTON CORREGIR A SIGUIENTE PREGUNTA ****************************//
  getButtonText() {
    return this.isCorrected ? 'Siguiente pregunta' : 'Corregir';
  }


  //************************* FUNCION PARA MANEJO DEL BOTON CORREGIR O PASAR A LA SIG PREGUNTA ****************************//
  handleButtonClick() {
    if (!this.isCorrected) {
      // Corregir la pregunta actual
      const currentQuestionIndex = this.page.page * this.questionsPerPage;
      const currentQuestion = this.examQuestion[currentQuestionIndex];
      const selectedOption = this.userResponses[currentQuestionIndex].optionSelected;
      if (selectedOption !== null) {
        // Llamar a la función para corregir la pregunta
        this.correctSingleQuestion(currentQuestion.id, selectedOption);
      } else {
        this.showToast('Por favor, selecciona una respuesta antes de corregir.', 'error');
      }
    } else {
      // Avanzar a la siguiente pregunta
      this.isCorrected = false; // Resetear el estado de corrección
      // Actualizar el índice de la primera pregunta de la página
      this.page.page += 1;
      this.page.first = this.page.page * this.questionsPerPage;
      // Verificar si llegamos al final
      if (this.page.page >= Math.ceil(this.examQuestion.length / this.questionsPerPage)) {
        alert("Has completado todas las preguntas.");
        this.router.navigate(['/']); // Redirigir a la home
      }
    }
  }


  //************************* FUNCION PARA MANEJO DEL BOTON PREGUNTA ANTERIOR ****************************//
  previousQuestion() {
    if (this.page.page > 0) {
      this.isCorrected = false; // al cambiar de pregunta, volvemos al estado "sin corregir"
      this.page.page -= 1;
      this.page.first = this.page.page * this.questionsPerPage;

      // opcional: cerrar el motivo si estaba abierto
      const q = this.examQuestion[this.page.page * this.questionsPerPage];
      if (q) q.showJustification = false;
    }
  }

  //************************* FUNCION PARA CORREGIR PREGUNTA A PREGUNTA ****************************//
  async correctSingleQuestion(questionId: number, selectedOption: string) {
    const payload = {
      quizzes: [
        {
          quizId: questionId,
          optionSelected: selectedOption
        }
      ],
      type: "REVIEW"
    };
    try {
      const response = await this.requestService.request('POST', '/quiz/check', payload, {}, true);
      const quizResponse = response.quizzes[0];
      // Guardar la respuesta correcta en la pregunta correspondiente
      this.examQuestion = this.examQuestion.map((question: any) => {
        if (question.id === questionId) {
          return {
            ...question,
            correctAnswer: quizResponse.result, // Guardar la respuesta correcta
            showJustification: false // Nueva propiedad para controlar la visibilidad del motivo
          };
        }
        return question;
      });
      this.isCorrected = true; // Marcar como corregida
    } catch (error) {
      console.error('Error al corregir la pregunta:', error);
    }
  }


  //************************* FUNCION PARA MOSTRAR MOTIVO ****************************//
  toggleJustification(question: any): void {
    question.showJustification = !question.showJustification;
  }


  //************************* FUNCIONES PARA RECOGER LAS OPCIONES SEÑALADAS EN EL EXAMEN ****************************//
  onSelectAnswer(questionIndex: number, answer: string) {
    // Actualizar la opción seleccionada en userResponses
    this.userResponses[questionIndex].optionSelected = answer;
  }


  //************************* FUNCIONES PARA APERTURA, CIERRE y ENVÍO DEL MODAL DE REPORTE ****************************//
  openModal(questionId: number) {
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
    const modal = document.getElementById('reportModal');
    const reportReason = (document.getElementById('reportReason') as HTMLTextAreaElement).value;
    if (!reportReason || reportReason.trim().length === 0) {
      alert("El campo del motivo no puede estar vacío");
      return;
    }
    try {
      this.reportedQuestion = await this.requestService.request('POST', `/report`, { reason: reportReason, quizId: this.idReportedQuestion }, {}, true);
      if (modal) {
        modal.classList.add('hidden');
      }
      this.idReportedQuestion = null;
      alert("Se ha enviado el reporte de la pregunta.");
    } catch (error: any) {
      console.log(error);
    }
  }


//************************* FUNCIONES PARA APERTURA, CIERRE y ENVÍO DEL MODAL DE FIN REPASO ****************************//


openFinishReviewModal() {
  const modal = document.getElementById('finishReviewModal');
  if (modal) modal.classList.remove('hidden');
}

closeFinishReviewModal() {
  const modal = document.getElementById('finishReviewModal');
  if (modal) modal.classList.add('hidden');
}

confirmFinishReview() {
  // Cerrar modal
  this.closeFinishReviewModal();

  // Limpiar el examen y salir
  this.localStorageService.removeItem('examQuestions');
  this.router.navigate(['/']);
}


  //************************* FUNCIONES PARA CONTROLAR LA PAGINACIÓN Y PREGUNTAS POR PÁGINA ****************************//
  progress() {
    const endQuestion = Math.min((this.page.page + 1) * this.questionsPerPage, this.examQuestion.length);
    const progress = (endQuestion / this.examQuestion.length) * 100;
    return Math.min(progress, 100);
  }


  progressText() {
    const startQuestion = this.page.page * this.questionsPerPage + 1;
    return `${startQuestion} de ${this.examQuestion.length}`;
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


  /************************* FUNCION PARA MOSTRAR TOAST *********************/
  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showSavedToast = true;

    setTimeout(() => {
      this.showSavedToast = false;
    }, 2500); //el mensaje se queda 2 segundo y medio
  }


  /************************* FUNCION PARA FINALIZAR REPASO *********************/
  finishReview() {
  const ok = confirm('¿Seguro que quieres finalizar el repaso?');
  if (!ok) return;

  // Opcional: limpiar preguntas del localStorage ya aquí, además del ngOnDestroy
  this.localStorageService.removeItem('examQuestions');

  // Navegar a donde quieras
  this.router.navigate(['/']);
}




}
