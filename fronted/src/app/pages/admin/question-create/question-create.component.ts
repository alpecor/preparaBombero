import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './question-create.component.html',
  styleUrl: './question-create.component.css'
})
export class QuestionCreateComponent {
  @Input() isAdmin: boolean = true; //para cambiar la cabecera si es user o admin

    //FUNCIONES PARA APERTURA, CIERRE y ENVIO DEL MODAL
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
        console.log("se da en cancelar");
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
