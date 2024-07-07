import { TestBed } from '@angular/core/testing';

import { StoragesService } from './storages.service';

describe('StoragesService', () => {
  let service: StoragesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoragesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
