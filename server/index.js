import express from 'express';
import cors from 'cors';

import { router as signupRoutes } from './routes/signUpRoute.js';
import { router as loginRoutes } from './routes/loginRoute.js';
import errorHandler from './midlewares/errorHandler.js';


const app = express();
const PORT = 3000;
const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        data: {
            user: process.env.DBUSER,
            host: process.env.HOST,
            database: process.env.DB,
            password: process.env.DBPASSWORD,
            port: process.env.DBPORT
        }, message: 'connected'
    })
})

app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.all('*', (req, res, next) => {
    const error = new Error(`can't find ${req.originalUrl} on the server.`);
    error.status = 'wrong url';
    error.statusCode = 404;
    next(error);
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}`);
})