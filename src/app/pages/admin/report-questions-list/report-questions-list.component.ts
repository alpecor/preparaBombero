import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestService } from '../../../services/request.service';


interface Quiz {
  id: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  title: string;
  topicId: number;
}

interface ReportedQuestion {
  id: number;
  quiz: Quiz;
  quizId: number;
  reason: string;
  options?: { letter: string; text: string }[];
}

@Component({
  selector: 'app-report-questions-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './report-questions-list.component.html',
  styleUrl: './report-questions-list.component.css'
})
export class ReportQuestionsListComponent implements OnInit {

  questions:any[] = [];
  selectedReason: string = '';  // Almacena el motivo del reporte seleccionado
  questionToRemoveIndex: number | null = null; // Almacena el índice de la pregunta a eliminar


  constructor(private http: HttpClient, private requestService: RequestService){}

  ngOnInit(): void {
    this.loadReportedQuestions();
  }

  //petición para obtener las preguntas reportadas
  async loadReportedQuestions(){
    const data = await this.requestService.request('GET', `http://localhost:3000/report`, {}, {}, true);
    this.questions = data;
  }


 // Método para abrir el modal de eliminación y almacenar el índice de la pregunta
 openRemoveModal(index: number) {
  this.questionToRemoveIndex = index; // Almacena el índice de la pregunta a eliminar
  const modalRemove = document.getElementById('removeQuestion');
  if (modalRemove) {
    modalRemove.classList.remove('hidden');
    console.log("se abre eliminación de pregunta");
  }
}

closeRemoveModal() {
  const modalRemove = document.getElementById('removeQuestion');
  if (modalRemove) {
    modalRemove.classList.add('hidden');
    this.questionToRemoveIndex = null; // Resetea el índice al cerrar el modal
    console.log("se da en cancelar eliminación de pregunta");
  }
}

async RemoveQuestion() {
  try{
    if (this.questionToRemoveIndex !== null) {
      const questionId = this.questions[this.questionToRemoveIndex].id;
      const data = await this.requestService.request('DELETE', `http://localhost:3000/report/${questionId}`, {}, {}, true);
      // Elimina la pregunta del array si la eliminación en la base de datos es exitosa
      this.questions.splice(this.questionToRemoveIndex!, 1); // Elimina la pregunta del array  // Aquí puedes usar el operador ! para indicar que no será null
      this.questionToRemoveIndex = null;// Resetea el índice después de eliminar
      this.closeRemoveModal(); // Cierra el modal después de eliminar
      console.log("Pregunta eliminada de la base de datos y del array.");
    }
  }catch (error){
    console.log(error);
  }
}


 //FUNCIÓN PARA VISUALIZACIÓN DE PREGUNTA REPORTADA
 openSeeModal(reason: string) {
  this.selectedReason = reason;
  const modalSee = document.getElementById('seeQuestion');
  if (modalSee) {
    modalSee.classList.remove('hidden');
    console.log("se abre visualización de pregunta");
  }
}

closeSeeModal() {
  const modalSee = document.getElementById('seeQuestion');
  if (modalSee) {
    modalSee.classList.add('hidden');
    console.log("se ve el motivo del reporte de la pregunta");
  }
}

  // questions = [
  //   {
  //     id: 1,
  //     question: '¿Cuál es la capital de Francia?',
  //     options: [
  //       { letter: 'A', text: 'Madrid' },
  //       { letter: 'B', text: 'París' },
  //       { letter: 'C', text: 'Berlín' },
  //       { letter: 'D', text: 'Roma' }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     question: '¿Cuál es el resultado de 2 + 2?',
  //     options: [
  //       { letter: 'A', text: '3' },
  //       { letter: 'B', text: '4' },
  //       { letter: 'C', text: '5' },
  //       { letter: 'D', text: '6' }
  //     ]
  //   },
  //   {
  //     id: 1,
  //     question: '¿Cuál es la capital de Francia?',
  //     options: [
  //       { letter: 'A', text: 'Madrid' },
  //       { letter: 'B', text: 'París' },
  //       { letter: 'C', text: 'Berlín' },
  //       { letter: 'D', text: 'Roma' }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     question: '¿Cuál es el resultado de 2 + 2?',
  //     options: [
  //       { letter: 'A', text: '3' },
  //       { letter: 'B', text: '4' },
  //       { letter: 'C', text: '5' },
  //       { letter: 'D', text: '6' }
  //     ]
  //   },
  //   {
  //     id: 1,
  //     question: '¿Cuál es la capital de Francia?',
  //     options: [
  //       { letter: 'A', text: 'Madrid' },
  //       { letter: 'B', text: 'París' },
  //       { letter: 'C', text: 'Berlín' },
  //       { letter: 'D', text: 'Roma' }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     question: '¿Cuál es el resultado de 2 + 2?',
  //     options: [
  //       { letter: 'A', text: '3' },
  //       { letter: 'B', text: '4' },
  //       { letter: 'C', text: '5' },
  //       { letter: 'D', text: '6' }
  //     ]
  //   }
  // ]
}
