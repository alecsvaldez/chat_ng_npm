import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import {WebsocketService} from './websocket.service'


@Injectable({
  providedIn: 'root'
})
export class ChatService {
//    socket: Subject<any>
    socket: any
    contacts: any[] = [
        {
            id: 1,
            name: 'Alan',
            chatList: [
                {id:12,cid:2},
                {id:13,cid:3},
                {id:14,cid:4},
                {id:15,cid:5},
            ]
        },{
            id: 2,
            name: 'Serch',
            chatList: [
                {id:12,cid:1},
                {id:23,cid:3},
                {id:24,cid:4},
                {id:25,cid:5},
            ]
        },{
            id: 3,
            name: 'Dany',
            chatList: [
                {id:13,cid:1},
                {id:23,cid:2},
                {id:34,cid:4},
                {id:35,cid:5},
            ]
        },{
            id: 4,
            name: 'Oscar',
            chatList: [
                {id:14,cid:1},
                {id:24,cid:2},
                {id:34,cid:3},
                {id:45,cid:5},
            ]
        }, {
            id: 5,
            name: 'Alex',
            chatList: [
                {id:15,cid:1},
                {id:25,cid:2},
                {id:35,cid:3},
                {id:45,cid:4},
            ]
        }
    ]
    user: any = {}


    constructor(
        private socketService: WebsocketService
    ) { 
        // this.socketService.listen().subscribe(data => {
        //     console.log('received from socket:', data)
        // })
        this.socketService.listen('join').subscribe(data => {
            console.log('received from join', data)
        })
        this.socket = socketService.socket
    }

    getMessages = () => {
        const observable = new Observable<any>(observer => {
            this.socket.on('message_to_chat', data => {
                observer.next(data)
            })
            return () => {
                this.socketService.disconnect()
            }
        })
        return observable
    }


    sendMessage = (message) => {
        // this.socket.next({
        //     emit: 'message_to_chat',
        //     data: message
        // })
        console.log('emit message', message)
        this.socket.emit('message_to_chat', message)
    }
    joinChat = (id_chat) => {
        console.log('emit: join', id_chat)
        this.socket.emit('join', id_chat)
        // this.socket.next({
        //     emit: 'join',
        //     data: id_chat
        // })
    }
    setUser = (uid) => {
        return new Promise((resolve, reject) => {
            this.user = this.contacts.find(u => u.id == uid)
            resolve(this.user)
        })
    }
    getContacts = () => {
        return new Promise((resolve, reject) => {
            for (let c of this.contacts) {
                let chat = this.user.chatList.find(ch => ch.cid == c.id)
                if (chat)
                    this.joinChat(chat.id)
            }
            resolve( this.contacts.filter(c => c.id != this.user.id) )
        })
    }
}
