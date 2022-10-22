import { TestBed } from '@angular/core/testing';

import { ArtworkApprovalService } from './artwork-approval.service';

describe('ArtworkApprovalService', () => {
  let service: ArtworkApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtworkApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
