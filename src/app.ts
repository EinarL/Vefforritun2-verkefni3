import express from 'express';
import { catchErrors } from './lib/catch-errors.js';
import { router, index } from './routes/api.js';
import dotenv from 'dotenv';

dotenv.config();

const { PORT: port = 3000 } = process.env;

const app = express();
app.use(express.json());

app.get('/', catchErrors(index));
app.use(router);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
