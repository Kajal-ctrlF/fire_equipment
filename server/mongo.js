import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    email: String,
    phone: String,
    projectType: String,
    timeline: String,
    priority: String,
    scope: String
  },
  { timestamps: true }
);

const emergencySchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    company: String,
    message: String
  },
  { timestamps: true }
);

export const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
export const Emergency = mongoose.models.Emergency || mongoose.model('Emergency', emergencySchema);

export async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri || mongoose.connection.readyState === 1) return false;

  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB || 'fireguard'
  });

  return true;
}

export function isMongoReady() {
  return mongoose.connection.readyState === 1;
}
