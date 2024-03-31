import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';

const app: Express = express();
const port = 80;
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});