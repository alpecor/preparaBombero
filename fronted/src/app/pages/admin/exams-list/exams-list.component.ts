import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [EditorModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './exams-list.component.html',
  styleUrl: './exams-list.component.css'
})
export class ExamsListComponent {
  @Input() isAdmin: boolean = true; //para cambiar la cabecera si es user o admin
}
