import { TestBed } from '@angular/core/testing';

import { ExamsInfoService } from './exams-info.service';

describe('ExamsInfoService', () => {
  let service: ExamsInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamsInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
