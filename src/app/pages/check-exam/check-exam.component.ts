import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import {NgOptimizedImage} from '@angular/common';
import { TextSanitizerComponent } from '../../components/text-sanitizer/text-sanitizer.component';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-check-exam',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, NgOptimizedImage, TextSanitizerComponent],
  templateUrl: './check-exam.component.html',
  styleUrl: './check-exam.component.css'
})
export class CheckExamComponent {

  constructor(private localStorageService: LocalStorageService, private requestService:RequestService, private authService: AuthService) { }

  not_auth = this.authService.isNotAuth();

  correctedExamQuestions: any[] = []; //aquí se almacenarán las preguntas corregidas
  userAnswers: any[] = []; //aquí se almacenarán las respuestas seleccionadas por el usuario
  examSummary: { correctAnswers: number; incorrectAnswers: number; unansweredQuestions: number } | null = null; // Resumen del examen
  idReportedQuestion: number | null = null; //aquí se guardan las preguntas reportadas
  reportedQuestion: string[] = [];
  // Variables para las notas calculadas
  scores: { noPenalty: number; penaltyTwo: number; penaltyThree: number; penaltyFour: number } = {
    noPenalty: 0,
    penaltyTwo: 0,
    penaltyThree: 0,
    penaltyFour: 0
  };

  ngOnInit(): void {
    // Obtener las preguntas corregidas y las respuestas del usuario desde el localStorage
    this.correctedExamQuestions = this.localStorageService.getItem('correctedExamQuestions') ?? [];
    this.userAnswers = this.localStorageService.getItem('userAnswer') ?? [];

    // Obtener resultado del examen desde el localStorage
    this.examSummary = this.localStorageService.getItem('examSummary') ?? { correctAnswers: 0, incorrectAnswers: 0, unansweredQuestions: 0 };

    // Combinar las respuestas del usuario con las preguntas corregidas
    this.correctedExamQuestions = this.correctedExamQuestions.map((question: any) => {
      const userAnswer = this.userAnswers.find((answer: any) => answer.quizId === question.id);
      return {
        ...question,
        userAnswer: userAnswer ? userAnswer.optionSelected : null , // Añade la respuesta del usuario a la pregunta corregida
        showJustification: false // Nueva propiedad para controlar la visibilidad del motivo
      };
    });

    // Calcular las diferentes notas
    this.calculateScores();
  }

  // Función para determinar si una opción es la correcta
  isCorrect(question: any, option: string): boolean {
    return question.result === option;
  }

  // Función para determinar si es la opción seleccionada por el usuario y si está mal
  isUserSelectedAndIncorrect(question: any, option: string): boolean {
    return question.userAnswer === option && question.status === 'fail';
  }

   // Función para determinar si es la opción seleccionada por el usuario y si está bien
   isUserSelectedAndCorrect(question: any, option: string): boolean {
    return question.userAnswer === option && question.status === 'success';
  }

  // Función para mostras justifiación de la pregunta
  toggleJustification(question: any): void {
    question.showJustification = !question.showJustification;
  }

  // Función para calcular las notas del examen
  calculateScores(): void {
    const totalQuestions = this.correctedExamQuestions.length;
    const { correctAnswers, incorrectAnswers } = this.examSummary ?? { correctAnswers: 0, incorrectAnswers: 0 };

    if (totalQuestions > 0) {
      // Calcular la nota sin penalización
      this.scores.noPenalty = (correctAnswers / totalQuestions) * 10;

      // Calcular las notas con penalización
      this.scores.penaltyTwo = Math.max(0, ((correctAnswers - Math.floor(incorrectAnswers / 2)) / totalQuestions) * 10);
      this.scores.penaltyThree = Math.max(0, ((correctAnswers - Math.floor(incorrectAnswers / 3)) / totalQuestions) * 10);
      this.scores.penaltyFour = Math.max(0, ((correctAnswers - Math.floor(incorrectAnswers / 4)) / totalQuestions) * 10);
    }
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
}
