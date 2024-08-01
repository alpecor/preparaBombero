import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.css'
})
export class topicsComponent {
  @Input() topics:any;
  @Input() margin:number= -1;



}
