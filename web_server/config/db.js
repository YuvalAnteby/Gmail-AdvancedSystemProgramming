const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 2000, 4000];

function addConnectionListeners() {
  const connection = mongoose.connection;
  connection.on('connected', () => {
    console.log('Mongo connected');
  });
  connection.on('error', (err) => {
    console.error('Mongo connection error:', err && err.message ? err.message : err);
  });
  connection.on('disconnected', () => {
    console.warn('Mongo disconnected');
  });
}

async function connectDB() {
  addConnectionListeners();

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  for (let attemptIndex = 0; attemptIndex < MAX_RETRIES; attemptIndex += 1) {
    try {
      await mongoose.connect(mongoUri);
      return mongoose.connection;
    } catch (error) {
      const isLastAttempt = attemptIndex === MAX_RETRIES - 1;
      if (isLastAttempt) {
        throw error;
      }
      const delay = RETRY_DELAYS_MS[attemptIndex] || 1000;
      console.warn(`Mongo connection attempt ${attemptIndex + 1} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Should never reach here
  throw new Error('Unknown Mongo connection error');
}

module.exports = { connectDB };


