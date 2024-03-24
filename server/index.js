require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { client, createTables, seed, fetchCustomers, fetchReservations, fetchRestaurants, createReservation, destroyReservation } = require("./db");
const app = express();
const router = require('express').Router();

app.use(express.json());
app.use(morgan("combined"));

const init = async () => {
    await client.connect();
    console.log("connected to database");
    await createTables();
    console.log("tables created");
    await seed();
    console.log("database seeded");
};
init();

// router.get("/customers", async (req, res, next) => {
//     try {
//         const customers = await fetchCustomers();
//         res.status(200).send(customers);
//     } catch (error) {
//         next(error);
//     }
// });