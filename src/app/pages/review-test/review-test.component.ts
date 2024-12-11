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

  constructor(private requestService: RequestService, private localStorageService: LocalStorageService, private router: Router) { }

  //************************* DEFINICIÓN DE VARIABLES ****************************//

  examQuestion: any = this.localStorageService.getItem("examQuestions"); // Aquí se guardan las preguntas del examen
  idReportedQuestion: number | null = null; // Aquí se guardan las preguntas reportadas
  reportedQuestion: string[] = [];
  userResponses: { quizId: number, optionSelected: string }[] = []; // Array para almacenar las respuestas del usuario

  page: any = { page: 0, first: 0 }
  questionsPerPage: number = 1; // Cambiado a 1 para mostrar una pregunta por página

  isCorrected: boolean = false; // Controla si la pregunta ha sido corregida
  quizResult: string = ""; // Controla si la pregunta ha sido corregida


  //************************* ngOnInit ****************************//
  ngOnDestroy() {
    this.localStorageService.removeItem('examQuestions');
  }

  ngOnInit(): void {
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


  // ****** Cambiar el texto del botón de "Corregir" a "Siguiente pregunta", si ya se ha
  // ****** dado en corregir *************

  getButtonText() {
    return this.isCorrected ? 'Siguiente pregunta' : 'Corregir';
  }

  // Manejo del botón para corregir o pasar a la siguiente pregunta
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
        alert("Por favor, selecciona una respuesta antes de corregir.");
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
        this.router.navigate(['/home']); // Redirigir a la home
      }
    }
  }


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

//************************* FUNCION PARA MOSTRAR MOTIVO *********************//
  // Función para mostras justifiación de la pregunta
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

  //************************* FUNCIONES PARA CONTROLAR LA PAGINACIÓN Y PREGUNTAS POR PÁGINA ****************************//

  progress() {
    const endQuestion = Math.min((this.page.page + 1) * this.questionsPerPage, this.examQuestion.length);
    const progress = (endQuestion / this.examQuestion.length) * 100;
    return Math.min(progress, 100);
  }

  progressText() {
    const startQuestion = this.page.page * this.questionsPerPage + 1;
    const endQuestion = Math.min((this.page.page + 1) * this.questionsPerPage, this.examQuestion.length);
    return `${startQuestion} de ${this.examQuestion.length}`;
  }


}
