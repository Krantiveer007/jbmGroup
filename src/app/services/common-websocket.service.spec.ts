import { TestBed } from '@angular/core/testing';

import { CommonWebsocketService } from './common-websocket.service';

describe('CommonWebsocketService', () => {
  let service: CommonWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
