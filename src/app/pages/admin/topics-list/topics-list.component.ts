import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RequestService } from '../../../services/request.service';
import { Router } from '@angular/router';

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

  constructor(private router: Router,private requestService: RequestService){}

  topics: any;

 async ngOnInit(): Promise<void> {
    try{
      this.topics = await this.requestService.request('GET', `http://localhost:3000/topics`,{},{},true);
    }catch(error: any){
      // this.router.navigate(['/error']);
      // TODO descomentar lineas de arriba
    }
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
