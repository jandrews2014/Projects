import { TestBed, inject } from '@angular/core/testing';

import { IntelligentRiverService } from './intelligent-river.service';

describe('IntelligentRiverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntelligentRiverService]
    });
  });

  it('should be created', inject([IntelligentRiverService], (service: IntelligentRiverService) => {
    expect(service).toBeTruthy();
  }));
});
