// Umgebungsvariablen laden
require('dotenv').config();

// Notwendige Pakete importieren
const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express-App erstellen
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Für das Verarbeiten von JSON-Daten im Request-Body

// Verbindung zu PostgreSQL herstellen
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

client.connect()
  .then(() => console.log("Datenbank erfolgreich verbunden"))
  .catch(err => console.error("Verbindungsfehler:", err));

// Routen definieren

// Route: Alle To-dos abrufen
app.get('/todos', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM todos'); // Tabelle: 'todos'
    res.json(result.rows); // Als JSON zurückgeben
  } catch (error) {
    res.status(500).send('Fehler beim Abrufen von Todos');
  }
});

// Route: Neues To-do hinzufügen
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  try {
    await client.query('INSERT INTO todos (title) VALUES ($1)', [title]);
    res.status(201).send('To-do hinzugefügt!');
  } catch (error) {
    res.status(500).send('Fehler beim Hinzufügen von To-do');
  }
});

// Route: To-do löschen
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM todos WHERE id = $1', [id]);
    res.send('To-do gelöscht!');
  } catch (error) {
    res.status(500).send('Fehler beim Löschen von To-do');
  }
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
