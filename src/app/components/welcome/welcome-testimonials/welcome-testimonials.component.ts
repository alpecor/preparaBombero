import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-testimonials.component.html',
  styleUrl: './welcome-testimonials.component.css'
})
export class WelcomeTestimonialsComponent {
  testimonials = [
    {
      quote: "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
      name: "Sabo Masties",
      title: "Founder @ Rolex",
      image: "logo.jpg"
    },
    {
      quote: "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
      name: "Musharof Chowdhury",
      title: "Founder @ Arya UI",
      image: "logo.jpg"
    },
    {
      quote: "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
      name: "William Smith",
      title: "Founder @ Trorex",
      image: "logo.jpg"
    }
  ];
}
