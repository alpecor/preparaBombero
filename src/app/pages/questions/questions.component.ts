import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';


@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {

  @Input() isAdmin: boolean = true; //para cambiar la cabecera si es user o admin

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
  currentPage: number = 1; // página actual
  questionsPerPage = 20; // preguntas por página

  setPage(page: number) {
    this.currentPage = page;
  }

  get totalQuestions() {  //devuelve el nº de preguntas del array de preguntas
    return this.questions.length;
  }

  get totalPages() {  //para calcular cuantas páginas debe mostrar la paginación en función del total de preguntas del examen
    return Math.ceil(this.totalQuestions / this.questionsPerPage);
  }

  getPaginatedQuestions() {  //devuelve 20 preguntas del array por página
    const start = (this.currentPage - 1) * this.questionsPerPage;
    const end = start + this.questionsPerPage;
    return this.questions.slice(start, end);
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get progress() {
    const endQuestion = Math.min(this.currentPage * this.questionsPerPage, this.totalQuestions);
    const progress = (endQuestion / this.totalQuestions) * 100;
    return Math.min(progress, 100); // para asegurar de que el valor no exceda 100%
  }

  get progressText() {
    const startQuestion = (this.currentPage - 1) * this.questionsPerPage + 1;
    const endQuestion = Math.min(this.currentPage * this.questionsPerPage, this.totalQuestions);
    return `${startQuestion}-${endQuestion} de ${this.totalQuestions}`;
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages;
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
