import { TestBed } from '@angular/core/testing';

import { ReportedQuestionsService } from './reported-questions.service';

describe('ReportedQuestionsService', () => {
  let service: ReportedQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportedQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
