import express from "express"
import dotenv from 'dotenv'
import connectDB from "./MongoDB/db.js"
import routerPublic from './routes/routerPublic.js'
import routerMenu from "./routes/routerMenu.js"
import routerUser from "./routes/routerUser.js"
import routerCheckout from "./routes/routerCheckout.js"
import webhook from "./stripe/webhook.js"
import routerOrder from './routes/routerOrder.js'
import routerToken from './routes/routerToken.js'
import cors from 'cors'
import { Server } from "http"
import {initializeSocketIO} from './socket/server.js'

const app = express();

dotenv.config();

connectDB();

const domains = [process.env.FRONTEND_URL],

    corsOptions = {
        origin: function(origin, callback){
            if(domains.indexOf(origin) !== -1){
                callback(null, true);
            } else{
                callback(new Error('Not allow for CORS'));
            }
        }
    }

// app.use(cors(corsOptions))
app.use((req, res, next) => {
    if (req.path.startsWith('/api/webhook')) {
        next();
    } else {
        cors(corsOptions)(req, res, next);
    }
})

app.post('/api/webhook', express.raw({type: 'application/json'}), webhook)

app.use(express.json())

app.use('/api/', routerPublic)
app.use('/api/verifyToken/token', routerToken)
app.use('/api/admin', routerMenu)
app.use('/api/admin/login', routerUser)
app.use('/api/create-checkout-session', routerCheckout)
app.use('/api/ubb/orders', routerOrder)

// socket
const httpServer = new Server(app)
initializeSocketIO(httpServer)

// app.listen(process.env.PORT || 4000)
httpServer.listen(process.env.PORT || 4000)