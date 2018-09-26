import { TestBed } from '@angular/core/testing';

import { DbApiService } from './db-api.service';

describe('DbApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbApiService = TestBed.get(DbApiService);
    expect(service).toBeTruthy();
  });
});
