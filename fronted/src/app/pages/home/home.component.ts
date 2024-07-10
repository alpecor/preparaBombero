import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HomeTestimonialsComponent } from '../../components/home/home-testimonials/home-testimonials.component';
import { HomeFaqComponent } from '../../components/home/home-faq/home-faq.component';
import { NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent, HomeTestimonialsComponent, HomeFaqComponent, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
