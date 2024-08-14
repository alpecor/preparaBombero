import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ExamsInfoService } from '../../services/exams-info.service';

@Component({
  selector: 'app-examenes',
  standalone: true,
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './examenes.component.html',
  styleUrl: './examenes.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ExamenesComponent {

  data: any = {};

  constructor(private examsInfoService: ExamsInfoService) {}

  ngOnInit(): void {
    this.getExamsInfo();
  }

  getExamsInfo(){
    this.examsInfoService.getExamsInfo().subscribe( data => {
      this.data = data;
    });
  }
}
