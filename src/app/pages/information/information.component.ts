import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface GuidePage {
  title: string;
  steps: string[];
  note?: string;
  pace?: boolean;
}

interface Guide {
  id: string;
  icon: string;
  title: string;
  summary: string;
  pages: GuidePage[];
}

const GUIDE_ORDER = ['examenes', 'repaso', 'plan-estudio', 'refuerzos', 'guardadas', 'reportes'];

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);
  readonly isAuthenticated = !this.authService.isNotAuth();
  activeGuide: string | null = null;
  activePage = 0;

  readonly guides: Guide[] = [
    {
      id: 'refuerzos', icon: 'fa-layer-group', title: 'Refuerzos',
      summary: 'Amplía los temas con pocas preguntas oficiales mediante packs de contenido propio.',
      pages: [
        {
          title: 'Encuentra tu refuerzo',
          steps: [
            'Los packs están pensados para reforzar los temas que cuentan con pocas preguntas oficiales y ayudarte a afianzar mejor tus conocimientos mediante más práctica.',
            'Entra en Refuerzos y busca el pack que quieres comprar.',
            'Consulta su descripción, número de preguntas y precio de pago único.',
            'Pulsa Comprar y completa el pago seguro de Stripe. El pack se asociará a tu cuenta cuando el pago quede confirmado.'
          ],
          note: 'Los packs comprados permanecen asociados a tu cuenta independientemente de tu suscripción.'
        },
        {
          title: 'Preguntas de tus packs',
          steps: [
            'Si eres Premium y tienes un plan de estudio activo, las preguntas de los packs que hayas comprado se combinarán con las preguntas oficiales de esos mismos temas en tus sesiones del plan.',
            'Cuando prepares un examen personalizado con un tema para el que hayas comprado un pack, también se combinarán las preguntas oficiales y las del pack.',
            'Aunque no seas Premium, podrás practicar por separado las preguntas de tus packs comprados siempre que quieras desde Refuerzos.',
            'Los exámenes oficiales mantienen únicamente sus preguntas oficiales.'
          ],
          note: 'Solo se añadirán preguntas de los packs que hayas comprado y que correspondan al temario incluido en la sesión.'
        }
      ]
    },
    {
      "id": "examenes",
      "icon": "fa-list-check",
      "title": "Exámenes",
      "summary": "Convocatorias oficiales y tests con el temario que tú elijas.",
      "pages": [
        {
          "title": "Exámenes oficiales",
          "steps": [
            "Crea una cuenta e inicia sesión para acceder a la carpeta Exámenes del menú.",
            "Busca la convocatoria que te interese por comunidad y provincia y abre su examen.",
            "Responde las preguntas y finaliza el examen para consultar la corrección y revisar tus respuestas."
          ]
        },
        {
          "title": "Exámenes por temario",
          "steps": [
            "En Inicio, selecciona los temas que quieres practicar. Puedes centrarte en uno o combinar varios.",
            "Elige la opción de examen y configura el número de preguntas entre las disponibles para tu selección.",
            "Completa el test y consulta la corrección al finalizar para identificar qué necesitas reforzar."
          ]
        }
      ]
    },
    {
      "id": "repaso",
      "icon": "fa-rotate-left",
      "title": "Repaso",
      "summary": "Aprende pregunta a pregunta y refuerza los temas que necesites.",
      "pages": [
        {
          "title": "Repaso paso a paso",
          "steps": [
            "Desde Inicio, elige el temario que quieres repasar y selecciona la opción de repaso.",
            "Configura las preguntas y empieza: verás una pregunta cada vez.",
            "Selecciona una respuesta y pulsa Corregir. Comprueba la solución antes de pasar a la siguiente pregunta."
          ],
          "note": "No puedes avanzar a la siguiente pregunta hasta haber respondido y corregido la actual."
        },
        {
          "title": "Repaso de un tema concreto",
          "steps": [
            "Selecciona únicamente el tema que quieres reforzar en el temario de Inicio. También puedes combinar varios temas específicos.",
            "Escoge Repaso y el número de preguntas que quieres practicar.",
            "Todas las preguntas de la sesión pertenecerán a tu selección. Responde y corrige cada una para desbloquear la siguiente."
          ]
        }
      ]
    },
    {
      "id": "guardadas",
      "icon": "fa-bookmark",
      "title": "Preguntas guardadas",
      "summary": "Guarda tus favoritas, filtra por tema y repasa en orden aleatorio.",
      "pages": [
        {
          "title": "Guarda tus favoritas",
          "steps": [
            "Cuando encuentres una pregunta que te cueste o quieras recordar, utiliza su botón de guardar.",
            "La pregunta quedará en tu colección de Preguntas guardadas, accesible desde Guardadas en el menú.",
            "Vuelve a esa colección para repasarla después. Puedes quitar de guardadas las preguntas que ya no quieras conservar."
          ],
          "note": "Las preguntas oficiales guardadas requieren Premium. Las preguntas de los packs que hayas comprado también se pueden guardar y consultar sin una suscripción activa."
        },
        {
          "title": "Organiza tus guardadas",
          "steps": [
            "En Guardadas, selecciona un tema en el filtro o elige Todos los temas para ver tu colección completa.",
            "Pulsa Buscar para aplicar la selección.",
            "Pulsa Aleatorio para barajar las preguntas y evitar repasarlas siempre en el mismo orden. Usa Orden original para restaurarlo."
          ]
        }
      ]
    },
    {
      "id": "reportes",
      "icon": "fa-flag",
      "title": "Reportar preguntas",
      "summary": "Comunica tus dudas y los posibles errores que encuentres.",
      "pages": [
        {
          "title": "Reporta una pregunta",
          "steps": [
            "Utiliza el botón de reporte de la pregunta sobre la que tengas una duda o detectes un error.",
            "Explica el problema: puede estar en el enunciado, en las opciones o en la respuesta marcada como correcta. Añade el contexto que ayude a revisarlo.",
            "Envía el reporte para que el equipo pueda revisarlo."
          ]
        }
      ]
    },
    {
      "id": "plan-estudio",
      "icon": "fa-calendar-check",
      "title": "Plan de estudio",
      "summary": "Desde la configuración inicial hasta el sprint final: toda tu planificación.",
      "pages": [
        {
          "title": "Crea tu plan de estudio",
          "steps": [
            "Inicia sesión y entra en Plan de estudio desde el menú.",
            "Selecciona la comunidad autónoma, la provincia y la administración convocante.",
            "Indica el tiempo estimado hasta el examen y pulsa Crear mi plan de estudio. Se organizarán las sesiones con el temario de esa administración.",
            "En tu panel verás la sesión de hoy, las próximas sesiones y el tiempo restante hasta la fecha prevista."
          ],
          "note": "Solo puedes tener una administración activa a la vez."
        },
        {
          "title": "Un ritmo que se adapta",
          "steps": [
            "El plan calcula la carga de temas de cada sesión según los días que falten para el examen.",
            "Con más tiempo, trabajas menos temas por día. A medida que se acerca la fecha, aumenta la cantidad para volver a recorrer el temario."
          ],
          "note": "La cantidad se limita a los temas disponibles en tu plan. Con menos de 14 días se activa el modo sprint.",
          "pace": true
        },
        {
          "title": "Sprint y simulacros",
          "steps": [
            "Cuando quedan menos de 14 días, el modo sprint se activa automáticamente: mezcla el temario y lo reparte en hasta tres bloques para recorrerlo en ciclos de sesiones.",
            "De lunes a viernes tienes sesiones de temas. Los sábados se programa un simulacro con los temas previstos durante esa semana.",
            "Los domingos son de descanso. Consulta las próximas sesiones para saber qué te toca preparar."
          ]
        },
        {
          "title": "Sigue tu progreso",
          "steps": [
            "En tu plan, pulsa Empezar examen de hoy para realizar la sesión programada.",
            "Después de terminar, consulta el porcentaje de acierto y el rendimiento por temas.",
            "En el historial del plan puedes recorrer las semanas y usar Revisar examen en las sesiones realizadas. En Perfil también puedes consultar tus últimos exámenes."
          ]
        },
        {
          "title": "Ajusta tu planificación",
          "steps": [
            "Entra en Ajustes del plan y cambia la estimación del tiempo que falta hasta el examen.",
            "Confirma la nueva fecha: se conservan las sesiones hasta hoy y se recalculan las futuras.",
            "Si vas a preparar otra administración, utiliza la opción de cambiar administración y configura un nuevo plan."
          ],
          "note": "Cambiar de administración elimina el historial y el rendimiento del plan actual. La web te pedirá confirmación porque no se puede deshacer."
        }
      ]
    }
  ].sort((first, second) => GUIDE_ORDER.indexOf(first.id) - GUIDE_ORDER.indexOf(second.id));

  setGuide(id: string | null, focusTarget: HTMLButtonElement): void {
    this.activeGuide = id;
    this.activePage = 0;
    this.changeDetector.detectChanges();
    focusTarget.focus({ preventScroll: true });
  }

  changePage(guide: Guide, direction: number): void {
    if (this.activeGuide !== guide.id) return;
    this.activePage = Math.max(0, Math.min(guide.pages.length - 1, this.activePage + direction));
  }
}
