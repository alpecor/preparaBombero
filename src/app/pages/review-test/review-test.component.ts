import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { RequestService } from '../../services/request.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';


@Component({
  selector: 'app-review-test',
  standalone: true,
  imports: [PaginatorModule, HeaderComponent, FooterComponent, CommonModule, NgOptimizedImage],
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

  //************************* ngOnInit ****************************//

  ngOnInit(): void {
    // Inicializar userResponses con el id de cada pregunta y optionSelected como vacío
    this.userResponses = this.examQuestion.map((question: any) => {
      return {
        quizId: question.id,
        optionSelected: "" // Inicialmente vacío
      };
    });

    // Para recorrer las opciones de respuestas
    this.examQuestion = this.examQuestion.map((question: any) => {
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
    return `${startQuestion}-${endQuestion} de ${this.examQuestion.length}`;
  }

  //************************* FUNCIÓNES PARA EL ENVÍO DEL TEST ****************************//

  async sendTest() {
    try {
      const payload = { quizzes: this.userResponses };
      const response = await this.requestService.request('POST', '/quiz/check', payload, {}, true);

      this.localStorageService.setItem('correctedExamQuestions', response.quizzes);
      this.localStorageService.setItem('userAnswer', this.userResponses);

      this.router.navigate(['/check-exam']);
      this.localStorageService.removeItem('examQuestions')

    } catch (error) {
      console.log(error);
    }
  }
}
