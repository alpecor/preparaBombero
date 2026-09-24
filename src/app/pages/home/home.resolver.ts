import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';

export interface HomeInitialData {
  isAuthenticated: boolean;
  user: any | null;
  topics: Record<string, any[]>;
}

export const homeResolver: ResolveFn<HomeInitialData> = async () => {
  const authService = inject(AuthService);
  const requestService = inject(RequestService);
  const isAuthenticated = !authService.isNotAuth();

  const userRequest = isAuthenticated
    ? requestService.request('GET', '/user', {}, {}, true)
    : Promise.resolve(null);

  const [userResult, topicsResult] = await Promise.allSettled([
    userRequest,
    requestService.request('GET', '/topic', {}, {}, true),
  ]);

  return {
    isAuthenticated,
    user: userResult.status === 'fulfilled' ? userResult.value : null,
    topics: topicsResult.status === 'fulfilled' && topicsResult.value
      ? topicsResult.value
      : {},
  };
};
