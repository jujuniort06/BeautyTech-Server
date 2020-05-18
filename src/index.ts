import * as express from 'express';
import * as bodyParser from "body-parser";
import { WelcomeController } from './user.controller';

const cors = require('cors');
const app: express.Application = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

app.use('/welcome', WelcomeController);

const port = process.env.PORT || 3000;

app.listen(port, () => {    
    console.log(`Servidor rodando na porta http://localhost:${port}/`);
});

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'beautytech'
});

connection.query(
  'SELECT * FROM USER',
  function(err, results, fields) {
    console.log(results); 
  }
);