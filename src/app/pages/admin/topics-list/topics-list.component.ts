import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RequestService } from '../../../services/request.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface SubTopic {
  name: string;
}

interface Topic {
  title: string;
  topics: SubTopic[];
}

@Component({
  selector: 'app-topics-list',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './topics-list.component.html',
  styleUrl: './topics-list.component.css'
})
export class TopicsListComponent implements OnInit{

  constructor(private router: Router,private requestService: RequestService, private http: HttpClient){}

  topics: any;

 async ngOnInit(): Promise<void> {
    try{
      this.topics = await this.requestService.request('GET', `http://localhost:3000/topics`,{},{},true);
    }catch(error: any){
      // this.router.navigate(['/error']);
      // TODO descomentar lineas de arriba
    }
  }


//FUNCIONES PARA APERTURA, CIERRE y ENVIO DEL MODAL
openModal() {
  const modalReport = document.getElementById('crearTema');
  if (modalReport) {
    modalReport.classList.remove('hidden');
    console.log("se abre el modal de preguntas");
  }
}

closeModal() {
  const modalReport = document.getElementById('crearTema');
  if (modalReport) {
    modalReport.classList.add('hidden');
    console.log("se da en cancelar ahora");
  }
}

createTopic() {
  const modal = document.getElementById('reportModal');
  // Obtener el motivo del reporte desde el textarea
  const reportReason = (document.getElementById('reportReason') as HTMLTextAreaElement).value;
  // Obtener el access_token
  const accessToken = localStorage.getItem('access_token');
  // Crear el cuerpo de la petición
  const reportData = {
    reason: reportReason,
    quizID: 4
  };
  // Configurar los headers con el token
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`  // Incluir el token en los headers
  });
  // Enviar la petición POST usando HttpClient
  this.http.post('http://localhost:4200/report', reportData, { headers }).subscribe({
      next: (response) => {
        console.log('Reporte enviado:', response);
        // Cerrar el modal después de enviar el reporte
        if (modal) {
          modal.classList.add('hidden');
        }
      },
      error: (error) => {
        console.error('Error al enviar el reporte:', error);
      }
    });
}












  especifico: Topic[] = [
    {
      title: 'Tema 1: Informática básica',
      topics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 2: El explorador de Windows',
      topics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 3: Procesadores de texto',
      topics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 4: Hojas de cálculo',
      topics: []
    }
  ];

  legislacion: Topic[] = [
    {
      title: 'Tema 5: Bases de datos',
      topics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 6: Correo electrónico',
      topics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 7: SQL',
      topics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    }
  ];

  otros: Topic[] = [
    {
      title: 'Tema 8: Javascript',
      topics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    }
  ];
}
