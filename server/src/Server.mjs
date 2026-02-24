import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb, closeDb } from './db.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.argv[2] || 8080;

// parse JSON bodies
app.use(express.json());

// Serve static files from webapp/dist
const distPath = path.join(__dirname, '../../webapp/dist');
app.use(express.static(distPath));

// halls
app.get('/api/halls', async function (req, res) {
  try {
    const halls = await req.app.locals.db.collection('halls').find({}).toArray();
    res.json(halls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load halls' });
  }
});

app.post('/api/halls', async function (req, res) {
  try {
    const name = req.body.name;
    const rows = Number(req.body.rows);
    const seatsPerRow = Number(req.body.seatsPerRow);

    if (!name || !rows || !seatsPerRow) {
      return res.status(400).json({ error: 'name, rows, seatsPerRow are required' });
    }

    const hall = {
      name,
      rows,
      seatsPerRow
    };

    const result = await req.app.locals.db.collection('halls').insertOne(hall);
    hall._id = result.insertedId;
    res.status(201).json(hall);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create hall' });
  }
});

// shows
app.get('/api/shows', async function (req, res) {
  try {
    const shows = await req.app.locals.db.collection('shows').find({}).toArray();
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load shows' });
  }
});

app.post('/api/shows', async function (req, res) {
  try {
    const movie = req.body.movie;
    const hall = req.body.hall;
    const date = req.body.date;
    const time = req.body.time;

    if (!movie || !hall || !date || !time) {
      return res.status(400).json({ error: 'movie, hall, date, time are required' });
    }

    const show = {
      movie,
      hall,
      date,
      time
    };

    const result = await req.app.locals.db.collection('shows').insertOne(show);
    show._id = result.insertedId;
    res.status(201).json(show);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create show' });
  }
});

// reservations
app.get('/api/reservations', async function (req, res) {
  try {
    const reservations = await req.app.locals.db.collection('reservations').find({}).toArray();
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load reservations' });
  }
});

app.post('/api/reservations', async function (req, res) {
  try {
    const show = req.body.show;
    const showId = req.body.showId;
    const seats = req.body.seats;
    const customerName = req.body.customerName;

    if ((!show && !showId) || !seats || !customerName) {
      return res.status(400).json({ error: 'show/showId, seats, customerName are required' });
    }

    const reservation = {
      show,
      showId,
      seats,
      customerName
    };

    const result = await req.app.locals.db.collection('reservations').insertOne(reservation);
    reservation._id = result.insertedId;
    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create reservation' });
  }
});

const startServer = async () => {
  try {
    const { db } = await connectDb();
    app.locals.db = db;
    console.log(`MongoDB connected: ${db.databaseName}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

process.on('SIGINT', async () => {
  try {
    await closeDb();
  } finally {
    process.exit(0);
  }
});

startServer();
