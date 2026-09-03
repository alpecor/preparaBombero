import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [EditorModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './exams-list.component.html'
})
export class ExamsListComponent implements OnInit{
  title: string = '';
  description: string = '';
  showSaveConfirmation = false;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    // Cargar la información al iniciar el componente
    this.loadInfo();
  }


//************************* FUNCIÓN PARA CARGAR LA INFO ****************************//

  async loadInfo(): Promise<void> {
    const data = await this.requestService.request('GET', `/info`, {}, {}, false);
      this.title = data.title;
      this.description = data.description;
  }


//************************* FUNCIÓN PARA MANEJAR EL CLICK EN GUARDAR ****************************//

  async saveInfo(){
    try{
      await this.requestService.request('PUT', `/info`, {title: this.title, description: this.description}, {}, true);
      this.showSaveConfirmation = true;
    }catch(error){
      console.error('Error actualizando la información:', error);
    };
  }

  dismissSaveConfirmation(): void {
    this.showSaveConfirmation = false;
  }

  finishSaveConfirmation(): void {
    this.showSaveConfirmation = false;
    location.reload();
  }




  
}
