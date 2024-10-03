// Importing the necessary dependancies
const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");

app.use(express.json());
dotenv.config();

// Ensure environment variables are set
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error("Missing necessary environment variables for database connection");
    process.exit(1);
}

// Create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) {
        return console.log (`Error connecting to the database: ${err.message}`);
    }
    console.log(`Connected to the database`);
})

//ejs templating configuration
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get('/data', (req, res) => {
    db.query(`SELECT * FROM patients`, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(`Error fetching data`);
        } else {
            res.render('data', { results: results });
        }
    });
});

app.get('/patients', (req, res) => {
    const patients = `SELECT * FROM patients`;

    db.query(patients, (err, results) => {
        if (err) {
            return res.status(500).send(`Failed to fetch patients`);
        } else{
            return res.status(200).send(results);
        }
    })
})

app.get('/providers', (req, res) => {
    const providers = `SELECT * FROM providers`;

    db.query(providers, (err, results) => {
        if (err) {
            return res.status(500).send(`Failed to fetch providers`);
        } else {
            return res.status(200).send(results);
        }
    });
})

app.get('/patients/:id', (req, res) => {
    const patient_id = req.params.id;
    const patient = `SELECT * FROM patients WHERE patient_id = ?`;

    db.query(patient, [patient_id], (err, results) => {
        if (err) {
            return res.status(500).send(`Failed to fetch patient ${patient_id}`);
        } else {
            return res.status(200).send(results);
        }
    });
})

app.get('/patients/first_name/:first_name', (req, res) => {
    const first_name = req.params.first_name;
    const patient = `SELECT * FROM patients WHERE first_name = ?`;

    db.query(patient, [first_name], (err, results) => {
        if (err) {
            return res.status(500).send(`Failed to fetch patients with first name ${first_name}`);
        } else {
            return res.status(200).send(results);
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})