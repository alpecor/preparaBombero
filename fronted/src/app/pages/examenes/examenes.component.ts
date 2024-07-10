import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-examenes',
  standalone: true,
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './examenes.component.html',
  styleUrl: './examenes.component.css'
})
export class ExamenesComponent {

  @Input() isAdmin: boolean = true; //para cambiar la cabecera si es user o admin
}
