require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { client, createTables, seed, fetchCustomers, fetchReservations, fetchRestaurants, createReservation, destroyReservation } = require("./db");
const app = express();
const router = require('express').Router();

app.use(express.json());
app.use(morgan("combined"));
app.use('/api', router);

const init = async () => {
    await client.connect();
    console.log("connected to database");
    await createTables();
    console.log("tables created");
    await seed();
    console.log("database seeded");
    app.listen(process.env.PORT, () => {
        console.log(`server is listening on port ${process.env.PORT}`);
    });
};
init();

router.get("/customers", async (req, res, next) => {
    try {
        const customers = await fetchCustomers();
        res.status(200).send(customers);
    } catch (error) {
        next(error);
    }
});

router.get("/restaurants", async (req, res, next) => {
    try {
        const restaurants = await fetchRestaurants();
        res.status(200).send(restaurants);
    } catch (error) {
        next(error);
    }
});

router.get("/reservations", async (req, res, next) => {
    try {
        const reservations = await fetchReservations();
        res.status(200).send(reservations);
    } catch (error) {
        next(error);
    }
});

router.post("/customers/:id/reservations", async (req, res, next) => {
    try {
        const { date, party_count, restaurant_id } = req.body;
        const reservation = await createReservation(date, party_count, restaurant_id, req.params.id);
        res.status(201).send(reservation);
    } catch (error) {
        next(error);
    }
});

router.delete("/customers/:customer_id/reservations/:id", async (req, res, next) => {
    try {
        await destroyReservation(req.params.customer_id, req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
})