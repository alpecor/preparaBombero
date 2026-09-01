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
  templateUrl: './examenes-cards.component.html'
})
export class ExamenesCardsComponent {

  //************************* VARIABLES ****************************//
  community:string | null = null; //para almacenar la comunidad que viene por URL
  communities:string[] = []; //para almacenar las diferentes comunidades
  city:string | null = null; //para almacenar la ciudad que viene por URL
  selectedCities:string[] = []; //para almacenar las diferentes ciudades de una comunidad
  selectedExams:any[] = []; //para almacenar los examenes de la ciudad seleccionada
  pdfData: any[] = []; // Aquí se guardarán los datos recibidos

  // Estado suscripción + toast
  isSubscribed = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'error';
  isLoading = true;


  //************************* CONSTRUCTOR ****************************//
  constructor(private route: ActivatedRoute, private requestService: RequestService, private router: Router, private localStorageService: LocalStorageService) {}


  //************************* ngOnInit ****************************//
  async ngOnInit(): Promise<void> {
    //capturamos la comunidad y la ciudad que se pasa por URL
    this.community = this.route.snapshot.paramMap.get('community');
    this.city = this.route.snapshot.paramMap.get('city');

    //Comprobar suscripción
    try {
      const user = await this.requestService.request('GET', '/user', {}, {}, true);
      this.isSubscribed = user?.subscribed === true;
    } catch {
      this.isSubscribed = false;
    }

    //obtener las comunidades
    try {
      // Obtener los datos del servidor
      if (!this.community) {
        this.pdfData = await this.requestService.request('GET', `/pdf?sort=community`, {}, {}, true);
      }else if (this.community && this.city){
        this.pdfData = await this.requestService.request('GET', `/pdf?sort=name`, {}, {}, true);
      }
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
    } finally {
      this.isLoading = false;
    }
  }

  getPageKicker(): string {
    if (this.community && this.city) {
      return 'Convocatorias disponibles';
    }

    if (this.community) {
      return 'Elige tu provincia';
    }

    return 'Biblioteca oficial';
  }

  getPageTitle(): string {
    if (this.community && this.city) {
      return `Exámenes de ${this.city}`;
    }

    if (this.community) {
      return `Provincias de ${this.community}`;
    }

    return 'Encuentra tu próximo examen';
  }

  getPageDescription(): string {
    if (this.community && this.city) {
      return 'Selecciona una convocatoria y empieza a practicar con preguntas oficiales.';
    }

    if (this.community) {
      return 'Selecciona una provincia para consultar sus convocatorias disponibles.';
    }

    return 'Explora las convocatorias por comunidad autónoma y encuentra el temario que necesitas.';
  }

  getCurrentCount(): number {
    if (this.community && this.city) {
      return this.selectedExams.length;
    }

    if (this.community) {
      return this.selectedCities.length;
    }

    return this.communities.length;
  }

  getCurrentCountLabel(): string {
    if (this.community && this.city) {
      return this.selectedExams.length === 1 ? 'examen disponible' : 'exámenes disponibles';
    }

    if (this.community) {
      return this.selectedCities.length === 1 ? 'provincia disponible' : 'provincias disponibles';
    }

    return this.communities.length === 1 ? 'comunidad disponible' : 'comunidades disponibles';
  }


  //************************* FUNCION PARA MOSTRAR TOAST ****************************//
  private showToastMsg(msg: string, type: 'success' | 'error' = 'error') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2500);
  }


  //************************* FUNCION PARA MOSTRAR CIUDADES DE UNA COMUNIDAD SELECCIONADA ****************************//
  showCities(community: string): void {
    this.selectedCities =  Array.from(new Set(this.pdfData
      .filter(item => item.community === community)
      .map(item => item.city)));
  }


  //************************* FUNCION PARA MOSTRAR EXAMANES DE UNA CIUDAD SELECCIONADA ****************************//
  showExams(community: string, city: string): void {
    this.selectedExams = this.pdfData
      .filter(item => item.community === community && item.city === city );
  }


  //************************* FUNCION PARA NORMALIZAR NOMBRE DE EXAMEN ****************************//
  private slugify(name: string): string {
    return name
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')// quita acentos
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // espacios/símbolos → guiones
      .replace(/^-+|-+$/g, ''); // trim guiones
  }


  //************************* FUNCION PARA MANEJAR EL CLICK EN EL EXAMEN ****************************//
  async startExam(pdfId: number, examenName: string) {
    try {
      // Realizar petición para generar preguntas solo del tema seleccionado
      const questions = await this.requestService.request('POST', `/quiz/generate`, { pdfId: pdfId }, {});
      if (questions.length === 0) {
        this.showToastMsg('El temario seleccionado no tiene preguntas todavía para realizar un examen.');
        return;
      }

      // Guardar las preguntas limitadas y nombre de examen en localStorage
      this.localStorageService.setItem("examQuestions", questions);
      this.localStorageService.setItem('examenName', { pdfId, examenName });

      //normalizar el nombre del examen y navegar a la vista del examen 
      const slug = this.slugify(examenName);
      this.router.navigate(['/examen', `${slug}-examen-bombero`]);

      // Navegar a la vista del examen
      //this.router.navigate(['/test']);
    } catch (error: any) {
      console.log(error);
    }
  }
  

}
