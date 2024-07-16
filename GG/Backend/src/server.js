import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoute from './route/web';
import initAPIRoute from './route/api';
import cors from 'cors';


require('dotenv').config();
const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
const port = process.env.PORT || 8080;

//Take data from users
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);
//init web route


initWebRoute(app);
//init API route
initAPIRoute(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})