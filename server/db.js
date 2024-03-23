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

const createReservation = async ({
    date,
    party_count,
    restaurant_id,
    customer_id,
}) => {
    const SQL = /*SQL*/ `
    INSERT INTO reservation(id, date, party_count, restaurant_id, customer_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
    const response = await client.query(SQL, [uuid.v4(), date, party_count, restaurant_id, customer_id])
    return respose.rows(0);
    `;
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
