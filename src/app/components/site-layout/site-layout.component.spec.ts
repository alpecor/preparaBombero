import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SiteLayoutComponent } from './site-layout.component';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';

@Component({ standalone: true, template: '<h1>Contenido de la página</h1>' })
class TestPageComponent {}

describe('Shared site navigation', () => {
  let request: jasmine.Spy;

  beforeEach(() => {
    request = jasmine.createSpy('request').and.resolveTo({ title: 'Novedades', description: 'Actualización' });
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', component: TestPageComponent },
          {
            path: '', component: SiteLayoutComponent, children: [
              { path: '', component: TestPageComponent },
              { path: 'informacion', component: TestPageComponent },
              { path: 'test', component: TestPageComponent, data: { showFooter: false } },
              { path: 'restricted', component: TestPageComponent, canActivate: [() => false] }
            ]
          }
        ]),
        { provide: RequestService, useValue: { request } },
        { provide: AuthService, useValue: { isAdmin: () => false, isUser: () => false, isNotAuth: () => true } }
      ]
    });
  });

  it('preserves the header, announcement and footer when navigating between pages', async () => {
    const harness = await RouterTestingHarness.create('/');
    await harness.fixture.whenStable();
    harness.detectChanges();
    const root = harness.routeNativeElement!;
    const header = root.querySelector('app-header');
    const announcement = root.querySelector('.site-promo-bar');
    const footer = root.querySelector('app-footer');
    expect(announcement).not.toBeNull();
    await harness.navigateByUrl('/informacion');
    expect(harness.routeNativeElement).toBe(root);
    expect(root.querySelector('app-header')).toBe(header);
    expect(root.querySelector('.site-promo-bar')).toBe(announcement);
    expect(root.querySelector('app-footer')).toBe(footer);
    expect(request.calls.allArgs().filter(args => args[1] === '/info').length).toBe(1);
    expect(root.querySelector('a[href="/informacion"]')?.classList.contains('site-nav-item-active')).toBeTrue();
  });

  it('hides the existing footer for quizzes and restores it when returning', async () => {
    const harness = await RouterTestingHarness.create('/');
    const footer = harness.routeNativeElement!.querySelector('app-footer') as HTMLElement;
    await harness.navigateByUrl('/test');
    expect(footer.hidden).toBeTrue();
    await harness.navigateByUrl('/informacion');
    expect(harness.routeNativeElement!.querySelector('app-footer')).toBe(footer);
    expect(footer.hidden).toBeFalse();
  });

  it('retains the current layout when a guard blocks navigation', async () => {
    const harness = await RouterTestingHarness.create('/informacion');
    const root = harness.routeNativeElement;
    await harness.navigateByUrl('/restricted');
    expect(harness.routeNativeElement).toBe(root);
    expect(root!.querySelectorAll('app-header').length).toBe(1);
  });

  it('keeps standalone login outside the shared layout', async () => {
    const harness = await RouterTestingHarness.create('/informacion');
    await harness.navigateByUrl('/login');
    expect(harness.routeNativeElement!.querySelector('app-header')).toBeNull();
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement!.querySelectorAll('app-header').length).toBe(1);
  });
});
