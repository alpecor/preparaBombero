import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { TextSanitizerComponent } from '../../components/text-sanitizer/text-sanitizer.component';

@Component({
  selector: 'app-examenes',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,TextSanitizerComponent],
  templateUrl: './examenes.component.html',
  styleUrl: './examenes.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ExamenesComponent {

  //************************* VARIABLES ****************************//
  description: string = "";


  //************************* CONSTRUCTOR ****************************//
  constructor(private requestService: RequestService) {}


  //************************* ngOnInit ****************************//
  ngOnInit(): void {
    this.loadInfo();
  }


  //************************* FUNCION PARA CARGAR LA INFO DESDE EL SERVICIO ****************************//
  async loadInfo(): Promise<void> {
    const data = await this.requestService.request('GET', `/info`, {}, {}, false);
      this.description = data.description;
  }


}
