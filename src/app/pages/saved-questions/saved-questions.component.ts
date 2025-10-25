import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-saved-questions',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './saved-questions.component.html',
  styleUrl: './saved-questions.component.css'
})
export class SavedQuestionsComponent {

}
