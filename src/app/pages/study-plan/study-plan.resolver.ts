import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RequestService } from '../../services/request.service';

export interface StudyPlanInitialData {
  user: any | null;
  sessions: any[];
  configuration: Record<string, Record<string, string[]>>;
  errorMessage: string;
}

export const studyPlanResolver: ResolveFn<StudyPlanInitialData> = async () => {
  const requestService = inject(RequestService);

  try {
    const user = await requestService.request('GET', '/user', {}, {}, true);

    if (user?.subscribed !== true) {
      return { user, sessions: [], configuration: {}, errorMessage: '' };
    }

    const sessionsResponse = await requestService.request('GET', '/study', {}, {}, true);
    const sessions = Array.isArray(sessionsResponse) ? sessionsResponse : [];
    const configuration = sessions.length === 0
      ? await requestService.request('GET', '/study/configuration', {}, {}, true)
      : {};

    return {
      user,
      sessions,
      configuration: configuration ?? {},
      errorMessage: '',
    };
  } catch {
    return {
      user: null,
      sessions: [],
      configuration: {},
      errorMessage: 'No se ha podido cargar tu plan de estudio.',
    };
  }
};
