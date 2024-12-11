import { Component, Input, input, Signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-text-sanitizer',
  standalone: true,
  imports: [],
  templateUrl: './text-sanitizer.component.html',
  styleUrl: './text-sanitizer.component.css',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TextSanitizerComponent {

  text = input.required<string>();
}

