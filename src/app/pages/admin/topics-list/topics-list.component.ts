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
  subTopics: SubTopic[];
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
      this.router.navigate(['/error']);
    }
  }


  especifico: Topic[] = [
    {
      title: 'Tema 1: Informática básica',
      subTopics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 2: El explorador de Windows',
      subTopics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 3: Procesadores de texto',
      subTopics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 4: Hojas de cálculo',
      subTopics: []
    }
  ];

  legislacion: Topic[] = [
    {
      title: 'Tema 5: Bases de datos',
      subTopics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 6: Correo electrónico',
      subTopics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    },
    {
      title: 'Tema 7: SQL',
      subTopics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    }
  ];

  otros: Topic[] = [
    {
      title: 'Tema 8: Javascript',
      subTopics: [{ name: 'Introducción a la informática' }, { name: 'Sitting' }]
    }
  ];
}
