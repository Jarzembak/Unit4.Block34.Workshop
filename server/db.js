require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
const uuid = require("uuid");

const createTables = async () => {
    const SQL = /*SQL*/ `
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS customer;
    DROP TABLE IF EXISTS restaurant;

    CREATE TABLE restaurant(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    CREATE TABLE customer(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    CREATE TABLE reservation(
        id UUID PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
        customer_id UUID REFERENCES customer(id) NOT NULL
    )`;
    await client.query(SQL);
};

const createCustomer = async (name) => {
    const SQL = /*SQL*/ `
    INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *;`;
    return (await client.query(SQL, [uuid.v4(), name])).rows[0];
};

const createRestaurant = async (name) => {
    const SQL = /*SQL*/ `
    INSERT INTO restaurant(id, name) VALUES ($1, $2) RETURNING *;`;
    return (await client.query(SQL, [uuid.v4(), name])).rows[0];
};

const createReservation = async (
    date,
    party_count,
    restaurant_id,
    customer_id
) => {
    const SQL = /*SQL*/ `
    INSERT INTO reservation(id, date, party_count, restaurant_id, customer_id)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const response = await client.query(SQL, [
        uuid.v4(),
        date,
        party_count,
        restaurant_id,
        customer_id,
    ]);
    return response.rows[0];
};

const destroyReservation = async ({ customer_id, id }) => {
    const SQL = /*SQL*/ `DELETE from reservation where customer_id=$1 AND id=$2;`;
    await client.query(SQL, [customer_id, id]);
};

const fetchCustomers = async () => {
    const SQL = /*SQL*/ `SELECT * FROM customer;`;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchRestaurants = async () => {
    const SQL = /*SQL*/ `SELECT * FROM restaurant;`;
    const response = await client.query(SQL);
    return response.rows;
};

const seed = async () => {
    await Promise.all([
        createCustomer("Lee"),
        createCustomer("Brett"),
        createCustomer("Matt"),
        createCustomer("Laura"),
        createCustomer("David"),
        createRestaurant("Terry's Tavern"),
        createRestaurant("Bob's Bistro"),
        createRestaurant("Gill's Grill"),
        createRestaurant("Dee's Diner"),
        createRestaurant("Cora's Cafe"),
    ]);

    const customers = await fetchCustomers();
    console.log("customers seeded", customers);
    const restaurants = await fetchRestaurants();
    console.log("restaurants seeded", restaurants);

//     const makeReservations = [
//             {
//                 date: "2024-03-01",
//                 party_count: 2,
//                 restaurant_id: restaurants[0].id,
//                 customer_id: customers[0].id,
//             },
//             {
//                 date: "2024-03-02",
//                 party_count: 4,
//                 restaurant_id: restaurants[1].id,
//                 customer_id: customers[1].id,
//             },
//             {
//                 date: "2024-03-03",
//                 party_count: 6,
//                 restaurant_id: restaurants[2].id,
//                 customer_id: customers[2].id,
//             },
//             {
//                 date: "2024-03-04",
//                 party_count: 8,
//                 restaurant_id: restaurants[3].id,
//                 customer_id: customers[3].id,
//             },
//             {
//                 date: "2024-03-05",
//                 party_count: 10,
//                 restaurant_id: restaurants[4].id,
//                 customer_id: customers[4].id,
//             }
//         ];
//     makeReservations.map((reservation) =>
//                 createReservation(
//                     reservation.date,
//                     reservation.party_count,
//                     reservation.restaurant_id,
//                     reservation.customer_id
//                 )
//             )
};

module.exports = {
    client,
    createTables,
    seed
};
