import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css'
})
export default class AuthLoginComponent {

}
