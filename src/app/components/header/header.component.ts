import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  currentRoute: string;

  constructor(private route: ActivatedRoute) {
    this.currentRoute = '';
  }

  ngOnInit(): void {
    // para obtener la ruta actual
    this.route.url.subscribe(url => {
      this.currentRoute = url.join('');
      console.log('Current route:', this.currentRoute); // <-- Aquí imprimimos el valor en consola
    });
  }




}
