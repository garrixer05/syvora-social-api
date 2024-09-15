import express, { json } from 'express';
import dotenv from 'dotenv'

// Routes
import AuthRoutes from './routes/AuthRoutes.js'
import AppRoutes from './routes/AppRoutes.js'
import PostRoutes from './routes/PostRoutes.js'
import cors from 'cors'

dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(AuthRoutes);
app.use(AppRoutes);
app.use(PostRoutes);

const PORT = process.env.PORT

app.listen(4000, ()=>{
    console.log(`Started listening on ${PORT}`);
})