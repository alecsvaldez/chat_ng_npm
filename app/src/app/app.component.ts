import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service'
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    title = 'chat';
    users: any[] = []
    contacts: any = []
    user: any = {}
    chat: any = {}
    message: string
    messages: any[] = []

    constructor(
        private chatService: ChatService
    ) {
        
    }

    ngOnInit() {
        this.users = this.chatService.contacts
        
        // this.chatService.listen.subscribe(event => {
        //     console.log('received from socket:', event)
        //     switch (event.event) {
        //         case 'join': this.messages.push({
        //                 from: 'SERVER',
        //                 message: '--- ' + event.data + ' ---'
        //             })
        //             break;
        //         case 'message_to_chat': this.messages.push({
        //                 from: event.data.name,
        //                 message: '--- ' + event.data.message + ' ---'
        //             })
        //     }
        // })
        this.chatService.getMessages().subscribe(data => {
            console.log(data)
            this.chat.dialog.push(data)
        })
    }

    setUser = (uid) => {
        this.chatService.setUser(uid).then(data => { 
            this.user = data
            this.chatService.getContacts().then(data => {
                this.contacts = data
            })
        })   
    }

    setChat = (u) => {
        let chat = this.user.chatList.find(c => c.cid == u.id)
        this.messages.push({
            from: this.user.name,
            message: '--- CHAT con ' + u.name +  ' (' + chat.id + ') ' + ' ---'
        })
        this.chat = chat
        if (this.chat.dialog == undefined)
            this.chat.dialog = []
        // this.chatService.joinChat(chat.id)
    }

    sendMessage = () => {

        let data = {
            cid: this.chat.id,
            uid: this.user.id,
            name: this.user.name,
            message: this.user.message
        }
        this.chat.dialog.push({
            from: this.user.name,
            message: this.user.message
        })
        this.chatService.sendMessage(data)
        
        this.user.message = ''
    }
}
