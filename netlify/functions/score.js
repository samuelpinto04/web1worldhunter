// netlify/functions/scores.js
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
    try {
        // GET → lista scores
        if (event.httpMethod === "GET") {
            const { rows } = await pool.query(
                "SELECT nome, score, tempo, percent, data FROM scores ORDER BY score DESC LIMIT 50"
            );
            return {
                statusCode: 200,
                body: JSON.stringify(rows)
            };
        }

        // POST → grava score
        if (event.httpMethod === "POST") {
            const body = JSON.parse(event.body);

            await pool.query(
                "INSERT INTO scores (nome, score, tempo, percent, data) VALUES ($1,$2,$3,$4,$5)",
                [body.nome, body.score, body.tempo, body.percent, body.data]
            );

            return {
                statusCode: 200,
                body: JSON.stringify({ ok: true })
            };
        }

        return { statusCode: 405, body: "Method not allowed" };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: "Server error" };
    }
};
