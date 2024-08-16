import { Component} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { Router, RouterLink } from '@angular/router';
import { topicsComponent } from '../../components/topics/topics.component';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule, NgOptimizedImage, RouterLink, topicsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router,private requestService: RequestService, private localStorageService: LocalStorageService){}

  topics: any = {};
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }



//FUNCIÓN PARA EL MODAL
openModalTest() {
  const modalTest = document.getElementById('multicuentas');
  if (modalTest) {
    modalTest.classList.remove('hidden');
  }
}

closeModalTest() {
  const modalTest = document.getElementById('multicuentas');
  if (modalTest) {
    modalTest.classList.add('hidden');
  }
}


 async ngOnInit(): Promise<void> {
  const modalShown = localStorage.getItem('modalShown');
  if (!modalShown) {
    this.openModalTest();  // Abre el modal si no se ha mostrado antes
    localStorage.setItem('modalShown', 'true');  // Marca como mostrado
  }
    try{
      // Solicita los temas desde el servidor
      this.topics = await this.requestService.request('GET', `http://localhost:3000/topic`,{},{},true);
      // Después de obtener los temas, carga el estado de los checkbox desde localStorage
      this.loadCheckboxStates();
    }catch(error: any){
      this.router.navigate(['/error']);
    }
  }

  // Método para manejar el cambio de estado del checkbox
  onCheckboxChange(topicId: string, isChecked: boolean): void {
    // Almacenar el estado del checkbox en localStorage
    this.localStorageService.setItem(topicId, isChecked);
  }

  // Método para cargar los estados de los checkbox desde localStorage
  loadCheckboxStates(): void {
    for (const key of this.objectKeys(this.topics)) {
      for (const topic of this.topics[key]) {
        const storedState = this.localStorageService.getItem(topic.id);
        topic.selected = storedState !== null ? storedState : false;
      }
    }
  }

}


