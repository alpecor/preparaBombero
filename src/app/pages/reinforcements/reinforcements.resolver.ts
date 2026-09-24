import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ReinforcementsService } from './reinforcements.service';

export const reinforcementsResolver: ResolveFn<boolean> = async () => {
  await inject(ReinforcementsService).loadPacks();
  return true;
};
