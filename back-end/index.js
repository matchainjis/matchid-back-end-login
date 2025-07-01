
// === index.js ===
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import signTransactionRoutes from './routes/signTransaction.js';
import updateMatchidRoutes from './routes/updateMatchid.js';
import signinPayMatchidRoutes from './routes/signinPayMatchid.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use('/api', signTransactionRoutes);
app.use('/api', updateMatchidRoutes);
app.use('/api', signinPayMatchidRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(4000, () => console.log('Server running on port 4000'));
    })
    .catch(err => console.error('MongoDB connection failed:', err));
