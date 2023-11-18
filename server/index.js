import express from 'express';
import cors from 'cors';

import { router as signupRoutes } from './routes/signUpRoute.js';
import { router as loginRoutes } from './routes/loginRoute.js';
import { router as activitiesRoutes } from './routes/activitiesRoute.js'
import { router as userRoutes } from './routes/userRoute.js'
import { router as eventRoutes } from './routes/eventRoute.js'
import { router as swaggerRoutes } from './routes/swaggerRoute.js'
import errorHandler from './midlewares/errorHandler.js';


const app = express();
const PORT = 3000;
const corsOptions = {
    origin: '*',
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        data: {
            message: ("connected to db")
        }, message: 'connected'
    })
})
app.use('/docs', swaggerRoutes);
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/user", userRoutes);
app.use("/activities", activitiesRoutes);
app.use("/events", eventRoutes);
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