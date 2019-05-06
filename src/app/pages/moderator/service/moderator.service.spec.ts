import { TestBed } from '@angular/core/testing';

import { ModeratorService } from './moderator.service';

describe('ModeratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created service', () => {
    const service: ModeratorService = TestBed.get(ModeratorService);
    expect(service).toBeTruthy();
  });
});
