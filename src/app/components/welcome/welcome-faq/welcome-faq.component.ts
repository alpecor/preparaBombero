import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-faq.component.html',
  styleUrl: './welcome-faq.component.css'
})
export class WelcomeFaqComponent {
  activeIndex: number | null = null;

  faqs = [
    { question: '¿Cómo puedo crear una cuenta?', answer: 'Para crear una cuenta, debes registrarte en la página web con tu nombre, correo electrónico y contraseña.' },
    { question: '¿Cuánto cuesta el acceso a la página web?', answer: 'El acceso a la página web se realiza a través de un plan de pago mensual de 30€.' },
    { question: '¿En qué dispositivos puedo utilizar la página web?', answer: 'La página web se puede utilizar en cualquier dispositivo con conexión a internet, como ordenadores, tablets y smartphones.' },
    { question: '¿Tengo algún problema técnico o tengo dudas, con quién puedo contactar?', answer: 'Si tienes algún problema técnico o alguna duda, puedes contactar con el equipo de soporte de la página web a través del correo electrónico (preparabombero2024@gmail.com).' }
  ];

  toggleAnswer(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
