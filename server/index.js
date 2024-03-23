require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const {client, createTables, seed} = require('./db');
const app = express();

app.use(express.json());
app.use(morgan('combined'));

const init = async () => {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    await seed(); 
    console.log('database seeded');
}
init();