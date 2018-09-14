import { TestBed } from '@angular/core/testing';

import { WowApiService } from './wow-api.service';

describe('WowApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WowApiService = TestBed.get(WowApiService);
    expect(service).toBeTruthy();
  });
});
