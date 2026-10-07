import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {provideNgcCookieConsent} from 'ngx-cookieconsent';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: "top",
      })
    ),
    provideHttpClient(withFetch()),
    provideNgcCookieConsent(
      {
        "cookie": {
          "domain": window.location.hostname
        },
        "position": "bottom-left",
        "theme": "classic",
        "layout": "basic-header",
        "type": "opt-out",
        "content": {
          "header": "Tu privacidad importa",
          "message": "Utilizamos cookies para mejorar tu experiencia, analizar el uso de la plataforma y ofrecerte un servicio más personalizado.",
          "allow": "Aceptar todas",
          "deny": "Solo las necesarias",
          "link": "Consultar la política de privacidad",
          "href": "/politica-de-privacidad",
          "target": "_self",
          "policy": "Preferencias de cookies"
        }
      })
  ]

};
