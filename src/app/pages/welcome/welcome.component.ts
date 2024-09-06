import { Component} from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { WelcomeTestimonialsComponent } from '../../components/welcome/welcome-testimonials/welcome-testimonials.component';
import { WelcomeFaqComponent } from '../../components/welcome/welcome-faq/welcome-faq.component';
import { NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [HeaderComponent,FooterComponent, WelcomeTestimonialsComponent, WelcomeFaqComponent, NgOptimizedImage],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
}
