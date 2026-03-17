import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private faqListeners: Array<{ element: Element; handler: EventListener }> = [];

  constructor(
    private el: ElementRef<HTMLElement>,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    const pageTitle = 'PreparaBombero | Exámenes Oficiales para Oposición de Bombero';
    const pageDescription =
      'Prepara tus oposiciones de bombero con más de 300 exámenes oficiales reales. Regístrate gratis y empieza hoy.';
    const canonicalUrl = 'https://preparabombero.com/landing';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: pageDescription });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: pageDescription });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.setCanonicalUrl(canonicalUrl);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    const revealElements =
      this.el.nativeElement.querySelectorAll('.reveal');
    revealElements.forEach((element: Element) => this.observer?.observe(element));

    const faqQuestions =
      this.el.nativeElement.querySelectorAll('.fq');

    faqQuestions.forEach((question: Element) => {
      const handler = () => {
        const faqItem = question.closest('.fi');
        const isOpen = faqItem?.classList.contains('open');

        this.el.nativeElement
          .querySelectorAll('.fi')
          .forEach((item: Element) => item.classList.remove('open'));

        if (!isOpen) {
          faqItem?.classList.add('open');
        }
      };

      question.addEventListener('click', handler);
      this.faqListeners.push({ element: question, handler });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.faqListeners.forEach(({ element, handler }) => {
      element.removeEventListener('click', handler);
    });
    this.faqListeners = [];
  }

  private setCanonicalUrl(url: string): void {
    let canonicalLink = this.document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', url);
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();

    const section = this.document.getElementById(sectionId);
    if (!section) {
      return;
    }

    const navOffset = 78;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth',
    });
  }
}
