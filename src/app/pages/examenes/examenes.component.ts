import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-examenes',
  standalone: true,
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './examenes.component.html',
  styleUrl: './examenes.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ExamenesComponent {

  description: string = "";

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadInfo();
  }

   // Método para cargar la información desde el servicio
   async loadInfo(): Promise<void> {
    const data = await this.requestService.request('GET', `/info`, {}, {}, false);
      this.description = data.description;
  }
}
