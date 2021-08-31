import express from 'express';
import mongoose from 'mongoose';
import tacherRouter from './routes/tacher.router';
import studentrouter from './routes/student.router';

require('dotenv').config();

const app = express();

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE_URL as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error: Error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());
app.use('/api/tachers', tacherRouter);
app.use('/api/students', studentrouter);

const port = process.env.SERVER_PORT as string;
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
