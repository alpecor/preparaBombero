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
  templateUrl: './exams-list.component.html',
  styleUrl: './exams-list.component.css'
})
export class ExamsListComponent implements OnInit{
  title: string = '';
  description: string = '';

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    // Cargar la información al iniciar el componente
    this.loadInfo();
  }


//************************* FUNCIÓN PARA CARGAR LA INFO ****************************//

  async loadInfo(): Promise<void> {
    const data = await this.requestService.request('GET', `http://localhost:3000/info`, {}, {}, false);
      this.title = data.title;
      this.description = data.description;
  }


//************************* FUNCIÓN PARA MANEJAR EL CLICK EN GUARDAR ****************************//

  async saveInfo(){
    try{
      const data = await this.requestService.request('PUT', `http://localhost:3000/info`, {title: this.title, description: this.description}, {}, true);
      console.log('Información actualizada:', data);
      alert('Se ha guardado la información correctamente');
      location.reload();
    }catch(error){
      console.error('Error actualizando la información:', error);
    };
  }




  
}
