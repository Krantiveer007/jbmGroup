import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonWebsocketService {

  public mockMessageSpy = new Subject<string>();
  public OverViewWebsocket = new Subject<any>();
  constructor() { }

  public mockConnect(mockData): Observable<string> {
    const messageHandler = this.mockMessageSpy.asObservable();
    console.log('Mock websocket connected');
    return new Observable(observer => {
      messageHandler.subscribe(() => {
        observer.next(mockData);
      });
    });
  }
  sendMockMessage(message: any) {
    this.mockMessageSpy.next(message);
  }
  closeMockMessage() {
    if (this.mockMessageSpy) {
      this.mockMessageSpy.complete();
    }
  }
  public connectWebSockets(socketUrl) {
    // date: Sat Sep 05 2020 00:00:00 GMT+0530 (India Standard Time) {}
    // noOfPerson: 1602
    const overviewWebsocket = new WebSocket(socketUrl);
    overviewWebsocket.onmessage = (evt: any) => {
      if (evt['data']) {
        this.OverViewWebsocket.next(evt['data']);
      }
    };
  }
}
