import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
const JSONstat = require("jsonstat-toolkit");

const app: Express = express();
const port: number = 80;
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// We need our URL to the localhost server we will send the JSON query to
const url = 'https://data.ssb.no/api/v0/no/table/11342';

app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header('Access-Control-Allow-Origin', '*');
    inResponse.header('Access-Control-Allow-Methods', 'GET,POST');
    inResponse.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    inNext();
});


app.listen(port, () => {
    console.log(`Server started, listening on port ${port}.`);
});


let dataset = {} as BodyInit;
let query = {} as BodyInit;

function createDataset(input:any) {
    return input.Dataset(0);
}

app.post('/apicall', async (req: Request, res: Response) => {
    console.log('Got a POST request\n');
    query = JSON.stringify(req.body);
    console.log('Query:', query, "\n");

    // Now we send the query to SSB with the url const in a fetch request
    await JSONstat(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: query
    })
    .then((response:any) => {
        dataset = createDataset(response);
        console.log('Dataset:', dataset, "\n");
    })
    .then((dataset:any) => {
        try {
            console.log('Dataset: ', dataset.Dataset(0))
        } catch (error) {
            console.error('Error: ', error)
        }
    })
    
    return res.status(200).json({ message: 'Great success', dataset: dataset });
});