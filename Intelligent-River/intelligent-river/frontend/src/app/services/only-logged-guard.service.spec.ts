import { TestBed, inject } from '@angular/core/testing';

import { OnlyLoggedGuardService } from './only-logged-guard.service';

describe('OnlyLoggedGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnlyLoggedGuardService]
    });
  });

  it('should be created', inject([OnlyLoggedGuardService], (service: OnlyLoggedGuardService) => {
    expect(service).toBeTruthy();
  }));
});
