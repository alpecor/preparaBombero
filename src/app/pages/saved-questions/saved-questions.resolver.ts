import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RequestService } from '../../services/request.service';

export interface SavedQuestionsInitialData {
  isSubscribed: boolean;
  packId: number | null;
  pack: any | null;
  questions: any[];
  favoriteQuestions: any[];
  packLoadError: string;
}

export const savedQuestionsResolver: ResolveFn<SavedQuestionsInitialData> = async (route) => {
  const requestService = inject(RequestService);
  const parsedPackId = Number(route.paramMap.get('packId'));
  const packId = Number.isInteger(parsedPackId) && parsedPackId > 0 ? parsedPackId : null;

  let isSubscribed = false;
  try {
    const user = await requestService.request('GET', '/user', {}, {}, true);
    isSubscribed = user?.subscribed === true;
  } catch {
    isSubscribed = false;
  }

  if (packId) {
    const [packResult, favoritesResult] = await Promise.allSettled([
      requestService.request('GET', `/pack/${packId}/questions`, {}, {}, true),
      requestService.request('GET', '/quiz/favorite', {}, {}, true),
    ]);
    const response = packResult.status === 'fulfilled' ? packResult.value : null;

    return {
      isSubscribed,
      packId,
      pack: response?.pack ?? null,
      questions: Array.isArray(response?.questions) ? response.questions : [],
      favoriteQuestions: favoritesResult.status === 'fulfilled' && Array.isArray(favoritesResult.value)
        ? favoritesResult.value
        : [],
      packLoadError: packResult.status === 'rejected'
        ? 'No se han podido cargar las preguntas de este pack.'
        : '',
    };
  }

  if (!isSubscribed) {
    return {
      isSubscribed,
      packId: null,
      pack: null,
      questions: [],
      favoriteQuestions: [],
      packLoadError: '',
    };
  }

  try {
    const favoriteQuestions = await requestService.request('GET', '/quiz/favorite', {}, {}, true);
    return {
      isSubscribed,
      packId: null,
      pack: null,
      questions: Array.isArray(favoriteQuestions) ? favoriteQuestions : [],
      favoriteQuestions: Array.isArray(favoriteQuestions) ? favoriteQuestions : [],
      packLoadError: '',
    };
  } catch {
    return {
      isSubscribed,
      packId: null,
      pack: null,
      questions: [],
      favoriteQuestions: [],
      packLoadError: '',
    };
  }
};
