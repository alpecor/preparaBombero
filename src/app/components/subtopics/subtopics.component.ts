import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subtopics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subtopics.component.html',
  styleUrl: './subtopics.component.css'
})
export class SubtopicsComponent {
  @Input() subtopic:any;
  @Input() margin:number= -1;



}
