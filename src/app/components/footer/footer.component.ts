import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  constructor(private authService: AuthService) {}

  get examsLink(): string {
    return this.authService.isNotAuth() ? '/register' : '/examenes';
  }
}
