import { TestBed } from '@angular/core/testing';

import { ProdsService } from './prods.service';

describe('ProdsService', () => {
  let service: ProdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
