import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import {
  collections,
  industryCollections,
  industryItems,
  industries,
  metrics,
  products,
  serviceCollections,
  serviceItems,
  services,
  testimonials,
  faqs
} from './data.js';
import { connectMongo, Emergency, Quote, isMongoReady } from './mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let quoteRequests = [];
let emergencyRequests = [];

connectMongo().catch((error) => {
  console.warn('MongoDB connection skipped:', error.message);
});

app.get('/api/metrics', (_req, res) => {
  res.json({ metrics, services, industries });
});

app.get('/api/products', (_req, res) => {
  res.json({ products });
});

app.get('/api/catalog', (_req, res) => {
  res.json({ collections, products, serviceCollections, serviceItems, industryCollections, industryItems });
});

app.get('/api/testimonials', (_req, res) => {
  res.json({ testimonials });
});

app.get('/api/faqs', (_req, res) => {
  res.json({ faqs });
});

app.post('/api/assessment', (req, res) => {
  const { buildingType = 'Factory', areaSize = 12000, floors = 4, occupancy = 450, riskCategory = 'Moderate' } = req.body ?? {};
  const riskWeight = { Low: 0.7, Moderate: 1, High: 1.35, Critical: 1.7 }[riskCategory] || 1;
  const typeWeight = {
    Factory: 1.2,
    Hospital: 1.15,
    Warehouse: 1.25,
    Hotel: 1.05,
    School: 0.95,
    'Data Center': 1.45,
    'Commercial Building': 1
  }[buildingType] || 1;

  let score = 18 + (Number(areaSize) / 1800) + (Number(floors) * 5) + (Number(occupancy) / 60);
  score *= riskWeight * typeWeight;
  score = Math.max(8, Math.min(96, score));

  const level = score < 30 ? 'Low' : score < 55 ? 'Moderate' : score < 75 ? 'High' : 'Critical';
  const equipmentMap = {
    Low: ['Extinguishers', 'Exit lights', 'Signage'],
    Moderate: ['Alarm system', 'Smoke detectors', 'Extinguishers', 'Exit lights'],
    High: ['Sprinklers', 'Hydrants', 'Alarm system', 'Emergency lighting'],
    Critical: ['Gas suppression', 'Sprinklers', 'Hydrants', 'Monitoring panel', 'Emergency lighting']
  };
  const standardsMap = {
    Low: ['Local fire code', 'OSHA basics'],
    Moderate: ['NFPA 10', 'NFPA 72', 'Life safety plan'],
    High: ['NFPA 13', 'NFPA 72', 'Compliance audit'],
    Critical: ['NFPA 2001', 'NFPA 13', 'NFPA 101', 'Authority approval']
  };

  res.json({
    score: Math.round(score),
    label: `${level} exposure profile`,
    equipment: equipmentMap[level],
    standards: standardsMap[level],
    note: `For a ${String(buildingType).toLowerCase()} with ${areaSize} sqm and ${floors} floors, prioritize detection, suppression, and evacuation systems.`
  });
});

app.post('/api/quotes', (req, res) => {
  const payload = { id: randomUUID(), ...req.body, createdAt: new Date().toISOString() };

  if (isMongoReady()) {
    Quote.create(req.body)
      .then((saved) => res.json({ ok: true, message: 'Quote request received', entry: saved }))
      .catch((error) => {
        console.warn('Quote save failed, using memory fallback:', error.message);
        quoteRequests.push(payload);
        res.json({ ok: true, message: 'Quote request received', entry: payload });
      });
    return;
  }

  quoteRequests.push(payload);
  res.json({ ok: true, message: 'Quote request received', entry: payload });
});

app.post('/api/emergency', (req, res) => {
  const payload = { id: randomUUID(), ...req.body, createdAt: new Date().toISOString() };

  if (isMongoReady()) {
    Emergency.create(req.body)
      .then((saved) => res.json({ ok: true, message: 'Emergency request received', entry: saved }))
      .catch((error) => {
        console.warn('Emergency save failed, using memory fallback:', error.message);
        emergencyRequests.push(payload);
        res.json({ ok: true, message: 'Emergency request received', entry: payload });
      });
    return;
  }

  emergencyRequests.push(payload);
  res.json({ ok: true, message: 'Emergency request received', entry: payload });
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`API server running on http://${HOST}:${PORT}`);
});
