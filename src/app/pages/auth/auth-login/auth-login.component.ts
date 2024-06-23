import { NgOptimizedImage, NgStyle } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, NgStyle],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css'
})
export default class AuthLoginComponent implements OnInit {
  isMobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 767;
  }
}
