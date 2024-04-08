"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const JSONstat = require("jsonstat-toolkit");
const app = (0, express_1.default)();
const port = 80;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname)));
// We need our URL to the localhost server we will send the JSON query to
const url = 'https://data.ssb.no/api/v0/no/table/11342';
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header('Access-Control-Allow-Origin', '*');
    inResponse.header('Access-Control-Allow-Methods', 'GET,POST');
    inResponse.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    inNext();
});
app.listen(port, () => {
    console.log(`Server started, listening on port ${port}.`);
});
let dataset = {};
let query = {};
function createDataset(input) {
    return input.Dataset(0);
}
app.post('/apicall', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Got a POST request\n');
    query = JSON.stringify(req.body);
    console.log('Query:', query, "\n");
    // Now we send the query to SSB with the url const in a fetch request
    yield JSONstat(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: query
    })
        .then((response) => {
        dataset = createDataset(response);
        console.log('Dataset:', dataset, "\n");
    })
        .then((dataset) => {
        try {
            console.log('Dataset: ', dataset.Dataset(0));
        }
        catch (error) {
            console.error('Error: ', error);
        }
    });
    return res.status(200).json({ message: 'Great success', dataset: dataset });
}));
