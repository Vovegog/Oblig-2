import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';

const app: Express = express();
const port: number = 80;
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header('Access-Control-Allow-Origin', '*');
    inResponse.header('Access-Control-Allow-Methods', 'GET,POST');
    inResponse.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    inNext();
});


app.listen(port, () => {
    console.log(`Server started, listening on port ${port}.`);
});
