import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-review-result',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './review-result.component.html',
  styleUrl: './review-result.component.css'
})
export class ReviewResultComponent {
  summary = this.localStorageService.getItem('reviewSummary');

  total = this.summary?.total ?? 0;
  answered = this.summary?.answered ?? 0;
  correct = this.summary?.correct ?? 0;
  wrong = this.summary?.wrong ?? 0;

  // % sobre respondidas
  accuracy = this.answered > 0 ? Math.round((this.correct / this.answered) * 100) : 0;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
