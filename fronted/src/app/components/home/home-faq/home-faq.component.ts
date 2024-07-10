import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-faq.component.html',
  styleUrl: './home-faq.component.css'
})
export class HomeFaqComponent {
  activeIndex: number | null = null;

  faqs = [
    { question: 'Can I use TailGrids Pro for my clients projects?', answer: 'Yes, you can use TailGrids Pro for your clients projects.' },
    { question: 'Which license type is suitable for me?', answer: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything.' },
    { question: 'Is Windy UI Well-documented?', answer: 'Yes, Windy UI is well-documented.' },
    { question: 'Do you provide support?', answer: 'Yes, we provide support.' }
  ];

  toggleAnswer(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
