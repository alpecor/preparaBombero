import { Component } from '@angular/core';
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

  currentPage: number = 1; // página actual
  questionsPerPage = 20; // preguntas por página
  totalQuestions = 100; // total de preguntas

  setPage(page: number) {
    this.currentPage = page;
  }

   get progress() {
    return (this.currentPage * this.questionsPerPage) / this.totalQuestions * 100;
  }

  questions = [
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
      enunciado: "¿Cuál es el propósito principal de un sistema operativo?",
      respuestas: [
        "Ejecutar aplicaciones y gestionar los recursos del hardware",
        "Diseñar sitios web",
        "Programar en lenguaje de alto nivel",
        "Realizar copias de seguridad de datos"
      ]
    }
  ];
}
