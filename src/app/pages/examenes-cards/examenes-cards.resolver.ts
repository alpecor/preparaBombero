import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RequestService } from '../../services/request.service';

export interface ExamsInitialData {
  community: string | null;
  city: string | null;
  isSubscribed: boolean;
  pdfData: any[];
}

export const examsResolver: ResolveFn<ExamsInitialData> = async (route) => {
  const requestService = inject(RequestService);
  const community = route.paramMap.get('community');
  const city = route.paramMap.get('city');
  const sort = community && !city ? 'city' : city ? 'name' : 'community';

  const [userResult, pdfResult] = await Promise.allSettled([
    requestService.request('GET', '/user', {}, {}, true),
    requestService.request('GET', `/pdf?sort=${sort}`, {}, {}, true),
  ]);

  return {
    community,
    city,
    isSubscribed: userResult.status === 'fulfilled' && userResult.value?.subscribed === true,
    pdfData: pdfResult.status === 'fulfilled' && Array.isArray(pdfResult.value)
      ? pdfResult.value
      : [],
  };
};
