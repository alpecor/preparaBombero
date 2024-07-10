import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-report-questions-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './report-questions-list.component.html',
  styleUrl: './report-questions-list.component.css'
})
export class ReportQuestionsListComponent {
  @Input() isAdmin: boolean = true; //para cambiar la cabecera si es user o admin

 //FUNCIÓN PARA ELIMINACIÓN DE PREGUNTA REPORTADA
 openRemoveModal() {
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
    console.log("se da en cancelar eliminación de pregunta");
  }
}

RemoveQuestion() {
  const modalRemove = document.getElementById('removeQuestion');
  if (modalRemove) {
    console.log("se da en eliminación de pregunta");
  }
}

 //FUNCIÓN PARA VISUALIZACIÓN DE PREGUNTA REPORTADA
 openSeeModal() {
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

  questions = [
    {
      id: 1,
      question: '¿Cuál es la capital de Francia?',
      options: [
        { letter: 'A', text: 'Madrid' },
        { letter: 'B', text: 'París' },
        { letter: 'C', text: 'Berlín' },
        { letter: 'D', text: 'Roma' }
      ]
    },
    {
      id: 2,
      question: '¿Cuál es el resultado de 2 + 2?',
      options: [
        { letter: 'A', text: '3' },
        { letter: 'B', text: '4' },
        { letter: 'C', text: '5' },
        { letter: 'D', text: '6' }
      ]
    },
    {
      id: 1,
      question: '¿Cuál es la capital de Francia?',
      options: [
        { letter: 'A', text: 'Madrid' },
        { letter: 'B', text: 'París' },
        { letter: 'C', text: 'Berlín' },
        { letter: 'D', text: 'Roma' }
      ]
    },
    {
      id: 2,
      question: '¿Cuál es el resultado de 2 + 2?',
      options: [
        { letter: 'A', text: '3' },
        { letter: 'B', text: '4' },
        { letter: 'C', text: '5' },
        { letter: 'D', text: '6' }
      ]
    },
    {
      id: 1,
      question: '¿Cuál es la capital de Francia?',
      options: [
        { letter: 'A', text: 'Madrid' },
        { letter: 'B', text: 'París' },
        { letter: 'C', text: 'Berlín' },
        { letter: 'D', text: 'Roma' }
      ]
    },
    {
      id: 2,
      question: '¿Cuál es el resultado de 2 + 2?',
      options: [
        { letter: 'A', text: '3' },
        { letter: 'B', text: '4' },
        { letter: 'C', text: '5' },
        { letter: 'D', text: '6' }
      ]
    }
  ]
}
