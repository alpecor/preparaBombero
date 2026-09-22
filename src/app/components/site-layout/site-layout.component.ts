import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <div class="site-content">
      <router-outlet (activate)="updateFooter()" />
    </div>
    <app-footer [hidden]="!showFooter" />
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; background: #f7f8fa; }
    .site-content { flex: 1 0 auto; min-width: 0; }
    app-footer { margin-top: auto; }
    app-footer[hidden] { display: none; }
  `
})
export class SiteLayoutComponent {
  private readonly route = inject(ActivatedRoute);
  showFooter = true;

  updateFooter(): void {
    this.showFooter = this.route.firstChild?.snapshot.data['showFooter'] !== false;
  }
}
