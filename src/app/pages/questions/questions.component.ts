import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule, HeaderComponent, PaginatorModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {

  page: any = {page: 0, first:0}
  questionsPerPage:number = 20;

  onPageChange($event: PaginatorState) {
    this.page = $event;
    console.log($event)
  }



  //FUNCIONES PARA APERTURA, CIERRE y ENVIO DEL MODAL
  openModal() {
    const modalReport = document.getElementById('reportModal');
    if (modalReport) {
      modalReport.classList.remove('hidden');
    }
  }

  closeModal() {
    const modalReport = document.getElementById('reportModal');
    if (modalReport) {
      modalReport.classList.add('hidden');
      console.log("se da en cancelar");
    }
  }

  sendReport() {
    const modal = document.getElementById('reportModal');
    if (modal) {
      modal.classList.add('hidden');
      console.log("se da en enviar");
    }
  }

  //FUNCIONES PARA CONTROLAR LA PAGINACIÓN Y PREGUNTAS POR PÁGINA


  progress() {
    const endQuestion = Math.min((this.page.page + 1) * this.questionsPerPage, this.questions.length);
    const progress = (endQuestion / this.questions.length) * 100;
    return Math.min(progress, 100); // para asegurar de que el valor no exceda 100%
  }

  progressText() {
    const startQuestion = this.page.page  * this.questionsPerPage + 1;
    const endQuestion = Math.min((this.page.page+1) * this.questionsPerPage, this.questions.length);
    return `${startQuestion}-${endQuestion} de ${this.questions.length}`;
  }


  //FUNCIÓN PARA EL ENVÍO DEL TEST
  openModalTest() {
    const modalTest = document.getElementById('finishTest');
    if (modalTest) {
      modalTest.classList.remove('hidden');
    }
  }

  closeModalTest() {
    const modalTest = document.getElementById('finishTest');
    if (modalTest) {
      modalTest.classList.add('hidden');
      console.log("se da en cancelar envio del test");
    }
  }

  sendTest() {
    const modalTest = document.getElementById('finishTest');
    if (modalTest) {
      modalTest.classList.add('hidden');
      console.log("se termina el test");
    }
  }




  questions = [
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "ESTA ES LA 21",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware,",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "ESTA ES LA 30",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "Esta es la 39",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    },
    {
      enunciado: "Esta es la 40",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    }
  ];
}
