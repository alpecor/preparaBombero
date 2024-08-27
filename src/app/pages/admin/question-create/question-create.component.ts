import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './question-create.component.html',
  styleUrl: './question-create.component.css'
})
export class QuestionCreateComponent implements OnInit{

  topicId:number = -1; //para almacenar el id que viene por URL

  constructor(private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.topicId = Number (this.route.snapshot.paramMap.get('topicId'));
  }


//************************* PETICIÓN PARA APERTURA Y CIERRE DEL MODAL ****************************//

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
