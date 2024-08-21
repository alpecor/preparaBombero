import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-check-exam',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, NgOptimizedImage],
  templateUrl: './check-exam.component.html',
  styleUrl: './check-exam.component.css'
})
export class CheckExamComponent {

  constructor(private localStorageService: LocalStorageService) { }

  correctedExamQuestions: any[] = []; //aquí se almacenarán las preguntas corregidas
  userAnswers: any[] = []; //aquí se almacenarán las respuestas seleccionadas por el usuario

  ngOnInit(): void {
    // Obtener las preguntas corregidas y las respuestas del usuario desde el localStorage
    this.correctedExamQuestions = this.localStorageService.getItem('correctedExamQuestions') || [];
    this.userAnswers = this.localStorageService.getItem('userAnswer') || [];

    // Combinar las respuestas del usuario con las preguntas corregidas
    this.correctedExamQuestions = this.correctedExamQuestions.map((question: any) => {
      const userAnswer = this.userAnswers.find((answer: any) => answer.quizId === question.id);
      return {
        ...question,
        userAnswer: userAnswer ? userAnswer.optionSelected : null // Añade la respuesta del usuario a la pregunta corregida
      };
    });

    console.log("datos en check: ", this.correctedExamQuestions); // Verificar los datos cargados
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
}
