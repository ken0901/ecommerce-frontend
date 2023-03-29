import { TestBed } from '@angular/core/testing';

import { KenShopFormService } from './ken-shop-form.service';

describe('KenShopFormService', () => {
  let service: KenShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KenShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
