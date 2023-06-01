import { Server as SocketIOServer } from "socket.io"
import Order from '../MongoDB/models/Order.js'
import jwt from 'jsonwebtoken'

let io;

export const initializeSocketIO = (httpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token
        
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        socket.decoded = decoded
        next()
    } catch (err) {
        console.log('Authentication error')
        next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`)

    Order.watch().on('change', data => {
        if(data.operationType === 'insert') {
          const newOrder = data.fullDocument

          io.emit('newOrder', newOrder)
        }
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    })
  })
}

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!")
  }
  return io
}