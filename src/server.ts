import express from 'express';
import mongoose from 'mongoose';
import tacherRouter from './routes/tacher.router';
import studentrouter from './routes/student.router';

require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: false }));

mongoose.set('useCreateIndex', true);
mongoose
  .connect(process.env.DATABASE_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use('/api/tachers', tacherRouter);
app.use('/api/students', studentrouter);

const port = process.env.SERVER_PORT as string;
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
