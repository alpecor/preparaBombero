import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';


@Component({
  selector: 'app-temas-user',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule],
  templateUrl: './temas-user.component.html',
  styleUrl: './temas-user.component.css'
})
export class TemasUserComponent {
  @Input() isAdmin: boolean = true; //para cambiar la cabecera si es user o admin

  examinarme(subtema: any) {
    // Lógica para manejar el examen del subtema
    console.log('Examinando el subtema:', subtema);
    // Aquí puedes añadir la navegación a otra página, abrir un modal, etc.
  }

    temasEspecificos = [
      {
        nombre: 'Tema 1: Informática básica',
        preguntas: 90,
        expanded: false,
        subtemas: [
          {nombre: 'Introducción a la informática', preguntas: 40 },
          {nombre: 'String', preguntas: 50 },
        ] },

      {
        nombre: 'Tema 2: Introducción al sistema operativo',
        preguntas: 48,
        expanded: false,
        subtemas: []
      },
      {
        nombre: 'Tema 3: El explorador de Windows',
        preguntas: 50,
        expanded: false,
        subtemas: []
      },
      {
        nombre: 'Tema 4: Procesadores de texto',
        preguntas: 60,
        expanded: false,
        subtemas: []
      }
    ];

    temasLegislacion = [
      {
        nombre: 'Tema 5: Hojas de cálculo',
        preguntas: 90,
        expanded: false,
        subtemas: [
          {nombre: 'Introducción a la informática', preguntas: 40 },
        ]
      },
      {
        nombre: 'Tema 6: Bases de datos',
        preguntas: 48,
        expanded: false,
        subtemas: []
      },
      {
        nombre: 'Tema 7: Correo electrónico',
        preguntas: 50,
        expanded: false,
        subtemas: []
      }
    ];

    temasOtros = [
      {
        nombre: 'Tema 8: SQL',
        preguntas: 90,
        expanded: false,
        subtemas: []
      },
      {
        nombre: 'Tema 9: Javascript',
        preguntas: 48,
        expanded: false,
        subtemas: [
          {nombre: 'Introducción a la informática', preguntas: 40 },
        ]
      }
    ];




}


