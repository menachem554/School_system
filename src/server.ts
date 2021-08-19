/* eslint-disable prettier/prettier */

import express from 'express';
import mongoose from 'mongoose';
import tachers from './routes/tacher';
import students from './routes/students';

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DATABASE_URL as string, { useNewUrlParser: true });


const db = mongoose.connection;
db.on('error', (error: Error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());
app.use('/tacher', tachers);
app.use('/students', students);
// Server start
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});