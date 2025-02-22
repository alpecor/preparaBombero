import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-examanes-cards',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './examenes-cards.component.html',
  styleUrl: './examenes-cards.component.css'
})
export class ExamenesCardsComponent {
  community:string | null = null; //para almacenar la comunidad que viene por URL
  communities:string[] = []; //para almacenar las diferentes comunidades
  city:string | null = null; //para almacenar la ciudad que viene por URL
  selectedCities:string[] = []; //para almacenar las diferentes ciudades de una comunidad
  selectedExams:any[] = []; //para almacenar los examenes de la ciudad seleccionada
  pdfData: any[] = []; // Aquí se guardarán los datos recibidos


  constructor(private route: ActivatedRoute, private requestService: RequestService, private router: Router, private localStorageService: LocalStorageService) {}


  async ngOnInit(): Promise<void> {
    //capturamos la comunidad y la ciudad que se pasa por URL
    this.community = this.route.snapshot.paramMap.get('community');
    this.city = this.route.snapshot.paramMap.get('city');

    //obtener las comunidades
    try {
      // Obtener los datos del servidor
      this.pdfData = await this.requestService.request('GET', `/pdf?sort=community`, {}, {}, true);

      // Filtrar comunidades únicas y asignarlas a la variable 'communities'
      this.communities = Array.from(
        new Set(this.pdfData.filter(x=> x.community != null).map(item => item.community))
      );

      // Mostrar ciudades si 'community' está en la URL
      if (this.community && !this.city) {
        this.pdfData = await this.requestService.request('GET', `/pdf?sort=city`, {}, {}, true);
        this.showCities(this.community);
      }

      // Mostrar examanes si 'city' está en la URL
      if (this.community && this.city) {
        this.showExams(this.community, this.city);
      }

    } catch (error) {
      console.error('Error fetching PDF data:', error);
    }
  }

  // Método para mostrar ciudades de una comunidad seleccionada
  showCities(community: string): void {
    this.selectedCities =  Array.from(new Set(this.pdfData
      .filter(item => item.community === community)
      .map(item => item.city)));
  }

  // Método para mostrar examanes de la ciudad seleccionada
  showExams(community: string, city: string): void {
    this.selectedExams = this.pdfData
      .filter(item => item.community === community && item.city === city );
  }

   // función para manejar el clic en el examen
   async startExam(pdfId: number) {
    try {
      // Realizar petición para saber si el usuario está o no subscrito
      const user = await this.requestService.request('GET', `/user`, {}, {});
      const subscribed = user.subscribed == true;
      if(!subscribed){
        alert("Los usuarios no subscritos solo puede realizar exámenes del TÍTULO I: DE LOS DERECHOS Y DEBERES FUNDAMENTALES (Arts. 10-55), del TEMA 1: CONSTITUCIÓN ESPAÑOLA, del bloque legislación.");
        return;
      }

      // Realizar petición para generar preguntas solo del tema seleccionado
      const questions = await this.requestService.request('POST', `/quiz/generate`, { pdfId: pdfId }, {});
      if (questions.length === 0) {
        alert("El temario seleccionado no tiene preguntas todavía para realizar un examen.");
        return;
      }

      // Guardar las preguntas limitadas en localStorage
      this.localStorageService.setItem("examQuestions", questions);

      // Navegar a la vista del examen

      this.router.navigate(['/test']);
    } catch (error: any) {
      console.log(error);
    }
  }

}
