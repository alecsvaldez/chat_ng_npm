'use strict'

const debug = require('debug')('API:server')
const http = require('http')
const express = require('express')
const app = express()

const socketIO = require('socket.io')

const port = process.env.PORT || 6016

const server = http.createServer(app)

const io = socketIO(server)

app.io = io

const startTime = new Date()
app.get('/', (req, res, next ) => {
    const uptime = Math.round(new Date().getTime()/1000 - (startTime.getTime() / 1000));
    res.send({
        status: 'online',
        startTime: startTime,
        uptime: uptime + 's'
    })
})

io.on('connection', socket => {
    debug('New socket connection ')
    let previousId
    socket.emit('message', 'Welcome to the jungle!')
    const safeJoin = currentId => {
        //socket.leave(previousId)
        socket.join( parseInt(currentId))
        //if (io.sockets.adapter.sids[socket.id][currentId])
        // previousId = currentId
    }

    socket.on('join', chatId => {
        debug(`User joined to room ${chatId}`)
        io.in(chatId).emit('join', `User joined to room ${chatId}` )
        safeJoin(chatId)
    })

    socket.on('message_to_chat', async data => {
        debug(data)

        let roomId = parseInt(data.cid)
        
        // Guardamos el mensaje en la BDD
        //  app.db.Chat.create(message) // TODO: this function
        // Enviamos el mensaje a chat
        let message = {
            event: 'message_to_chat',
            data: {
                from: data.name,
                message: data.message
            }
        }
        // socket.to(roomId).emit('chat', message)
        socket.to(roomId).emit('message_to_chat', message.data)
        debug(`sending message to ${roomId}`)
    })
    
    socket.on('zumbido', chatId => {
        let roomId = chatId.replace(/['"']+/g, '')
        debug(`Buzz received at ${roomId}`)
        socket.to(roomId).emit('message', 'zumbido')
    })
})


if (!module.parent) {
    server.listen(port, () => {
        debug('Serving on :', port)
    })
}

module.exports = server