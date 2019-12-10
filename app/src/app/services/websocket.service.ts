import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import * as Rx from 'rxjs'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    public socket: any
    data: any = {}

    constructor() { 
        this.connect()
    }
    
    connect = () => {
        this.socket = io('http://localhost:6016')
    }

    disconnect = () => {
        this.socket.disconnect()
    }

    listen = (event?:string): Rx.Subject<MessageEvent> => {

        let observable = new Observable(observer => {
            
            if (event == undefined) {
                // global socket message
                this.socket.on('message', data => {
                    observer.next(data)
                    console.log('Message from socket:', data)
                })
            } else {
                // custom message
                this.socket.on(event, data => { observer.next(data) })
            }

            return () => {
                this.disconnect()
            }
        })

        let observer = {
            next: (emit) => {
                this.socket.emit(emit.emit, emit.data)
            }
        }

        return Rx.Subject.create(observer, observable)
    }
}
