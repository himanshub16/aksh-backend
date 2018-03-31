const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var dotenv = require('dotenv');
dotenv.load();

const makeNLPQuery = require('./dialog').makeQuery;
const queryMapping = require('./queryMapping').mapping;
// const geoSpatialQuery = require('./concat_geo').concatGeoJsons;

// makeNLPQuery('suggest a place to build a hospital')

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}))

let dbUrl = process.env.MONGO_URL;
let dbName = process.env.MONGO_DB;

app.get('/nlp', async (req, res) => {
    let q = req.query.q;
    let d = await makeNLPQuery(q);
    console.log(d);
  
    let r = await queryMapping[d.metadata](d.parameters);
    console.log(r)
    // let r = await geoSpatialQuery(dbUrl, dbName);
    res.json(r);
});

app.get('/', (req, res) => {
    res.send('api in nlp');
})
	
app.listen(process.env.PORT);
console.log(`Running on port ${process.env.PORT}...`);
