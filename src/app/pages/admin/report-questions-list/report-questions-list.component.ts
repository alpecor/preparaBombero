import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { RequestService } from '../../../services/request.service';


@Component({
  selector: 'app-report-questions-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './report-questions-list.component.html',
  styleUrl: './report-questions-list.component.css'
})
export class ReportQuestionsListComponent implements OnInit {

  questions: any[] = [];
  selectedReason: string = '';  // Almacena el motivo del reporte seleccionado
  questionToRemoveIndex: number | null = null; // Almacena el índice de la pregunta a eliminar


  constructor(private http: HttpClient, private requestService: RequestService) { }

  ngOnInit(): void {
    this.loadReportedQuestions();
  }


  //************************* PETICIÓN PARA OBTENER PREGUNTAS REPORTADAS ****************************//

  async loadReportedQuestions() {
    // Primero cargamos las preguntas reportadas
    const data = await this.requestService.request('GET', `/report`, {}, {}, true);
    // Iteramos sobre cada pregunta reportada para añadir el título del tema (topic.title)
    for (let question of data) {
      // Hacemos una petición para obtener el título del tema según el topicId de la pregunta
      let topicData = null;
      if (question.quiz.topicId != null) {
        topicData = await this.requestService.request('GET', `/topic/${question.quiz.topicId}`, {}, {}, true);
      }
      // Añadimos el título del tema a la pregunta
      question.quiz.topicTitle = topicData?.title ?? "Esta pregunta todavía no está asignada a ningún tema";
    }
    // Asignamos los datos modificados a la propiedad this.questions
    this.questions = data;
  }


  //************************* FUNCIONES PARA APERTURA, CIERRE y ELIMINACIÓN DE PREGUNTA REPORTADA ****************************//

  openRemoveModal(index: number) {
    this.questionToRemoveIndex = index; // Almacena el índice de la pregunta a eliminar
    const modalRemove = document.getElementById('removeQuestion');
    if (modalRemove) {
      modalRemove.classList.remove('hidden');
    }
  }

  closeRemoveModal() {
    const modalRemove = document.getElementById('removeQuestion');
    if (modalRemove) {
      modalRemove.classList.add('hidden');
      this.questionToRemoveIndex = null; // Resetea el índice al cerrar el modal
    }
  }

  async RemoveQuestion() {
    try {
      if (this.questionToRemoveIndex !== null) {
        const questionId = this.questions[this.questionToRemoveIndex].id;
        await this.requestService.request('DELETE', `/report/${questionId}`, {}, {}, true);
        // Elimina la pregunta del array si la eliminación en la base de datos es exitosa
        this.questions.splice(this.questionToRemoveIndex!, 1); // Elimina la pregunta del array  // Aquí puedes usar el operador ! para indicar que no será null
        this.questionToRemoveIndex = null;// Resetea el índice después de eliminar
        this.closeRemoveModal(); // Cierra el modal después de eliminar
      }
    } catch (error) {
      console.log(error);
    }
  }


  //************************* FUNCIÓN PARA VISUALIZACIÓN DE PREGUNTA REPORTADA ****************************//

  openSeeModal(reason: string) {
    this.selectedReason = reason;
    const modalSee = document.getElementById('seeQuestion');
    if (modalSee) {
      modalSee.classList.remove('hidden');
    }
  }

  closeSeeModal() {
    const modalSee = document.getElementById('seeQuestion');
    if (modalSee) {
      modalSee.classList.add('hidden');
    }
  }




}
