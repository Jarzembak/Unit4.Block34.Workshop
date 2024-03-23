const pg = require('pg');
const client = new pg.Client(`postgres://localhost/${process.env.DATABASE_URL}`);
const uuid = require('uuid');

const createTables = async () => {
    const SQL = /*SQL*/ `
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS customer;
    DROP TABLE IF EXISTS restaurant;
    CREATE TABLE restaurant(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );
// create table customer
// create table restaurant
// create table reservation
    `
    await client.query(SQL);
}

const createCustomer = async (name) => {
    const SQL = /*SQL*/ `
    INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *;
    `;
    return (await client.query(SQL, [uuid.v4(), name])).rows[0];
}