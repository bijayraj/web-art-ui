import { TestBed } from '@angular/core/testing';

import { SuperadminAuthGuard } from './superadmin.auth.guard';

describe('SuperadminAuthGuard', () => {
  let guard: SuperadminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SuperadminAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
