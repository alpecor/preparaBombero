import { Component} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { Router, RouterLink } from '@angular/router';
import { topicsComponent } from '../../components/topics/topics.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule, NgOptimizedImage, RouterLink, topicsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router,private requestService: RequestService){}

  topics: any;
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

 async ngOnInit(): Promise<void> {
    try{
      this.topics = await this.requestService.request('GET', `http://localhost:3000/topic`,{},{},true);
    }catch(error: any){
      this.router.navigate(['/error']);
    }
  }

  expanded(){

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


