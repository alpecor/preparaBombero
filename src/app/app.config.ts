import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideNgcCookieConsent} from 'ngx-cookieconsent';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideNgcCookieConsent(
      {
        "cookie": {
          "domain": window.location.hostname
        },
        "position": "bottom-right",
        "theme": "classic",
        "palette": {
          "popup": {
            "background": "#1f2937",
            "text": "#ffffff",
            "link": "#ffffff"
          },
          "button": {
            "background": "var(--primary-color)",
            "text": "#ffffff",
            "border": "transparent"
          }
        },
        "type": "opt-out",
        "content": {
          "message": "Este sitio web utiliza cookies para que usted tenga la mejor experiencia en nuestro sitio web.",
          "allow": "Aceptar cookies",
          "deny": "Rechazar cookies",
          "link": "Saber más",
          "href": "https://cookiesandyou.com",
          "policy": "Política de cookies"
        }
      })
  ]

};
