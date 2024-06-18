import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,NgOptimizedImage],
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.css'
})
export class AuthRegisterComponent {

}
