import express from "express";
import { connectionDB } from "./DB/connection.js";
import {config} from "dotenv";
import path from "path";

import * as allRouter from './src/modules/index.routes.js';

config({ path: path.resolve('./config/config.env') });

const app = express();
const PORT = +process.env.PORT;

app.use(express.json());
connectionDB();

app.use('/user', allRouter.userRoutes);
app.use('/task' ,  allRouter.taskRoutes);

app.get('/', (req, res) => {
    res.send('Hello in Task Manager App ^_^');
});

app.all('*', (req, res , next) => {
    res.status(404).json({ message: 'Page not found' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});