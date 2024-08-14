import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ExamsInfoService } from '../../../services/exams-info.service';

@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [EditorModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './exams-list.component.html',
  styleUrl: './exams-list.component.css'
})
export class ExamsListComponent {
  title: string = '';
  description: string = '';

  constructor(private examsInfoService: ExamsInfoService) {}

  // Método para manejar el clic en "Guardar"
  saveInfo(): void {
    const infoData = {
      title: this.title,
      description: this.description
    };

    this.examsInfoService.updateExamsInfo(infoData).subscribe(response => {
      console.log('Información actualizada:', response);
      // Aquí puedes añadir alguna lógica adicional como mostrar una notificación de éxito
    }, error => {
      console.error('Error actualizando la información:', error);
      // Manejo de errores, por ejemplo, mostrar un mensaje de error al usuario
    });
  }
}
