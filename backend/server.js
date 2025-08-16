const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Foo'],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const committeeRoutes = require('./routes/committeeRoutes');
app.use('/api/committee', committeeRoutes);

const registrationRoutes = require('./routes/registrationRoutes');
app.use('/api/registration', registrationRoutes);

const navbarRoutes = require('./routes/navbarRoutes');
app.use('/api/navbar', navbarRoutes);

const speakerRoutes = require('./routes/speakerRoutes');
app.use('/api/speakers', speakerRoutes);

const heroRoutes = require('./routes/heroRoutes');
app.use('/api/hero', heroRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const meetingRoutes = require('./routes/meetingRoutes');
app.use('/api/meetings', meetingRoutes);

const announcementRoutes = require('./routes/announcementRoutes');
app.use('/api/announcements', announcementRoutes);

const importantDatesRoutes = require('./routes/importantDatesRoutes');
app.use('/api/important-dates', importantDatesRoutes);

const faqRoutes = require('./routes/faqRoutes');
app.use('/api/faqs', faqRoutes);

const footerRoutes = require('./routes/footerRoutes');
app.use('/api/footer', footerRoutes);

const carouselRoutes = require('./routes/carouselRoutes');
app.use('/api/carousel', carouselRoutes);

const headerBrandRoutes = require('./routes/headerBrandRoutes');
app.use('/api/header-brand', headerBrandRoutes);

const aboutRoutes = require('./routes/aboutRoutes');
app.use('/api/about', aboutRoutes);

const paperRoutes = require('./routes/paperRoutes');
app.use('/api/paper', paperRoutes);

app.get('/api/test-cors', (req, res) => {
  console.log('CORS test route hit!');
  res.status(200).json({ message: 'CORS test successful!' });
});

mongoose.set('strictQuery', true);
console.log('Connecting to Mongo URI:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('Please check if your IP address is whitelisted in MongoDB Atlas');
      console.error('Visit: https://www.mongodb.com/docs/atlas/security-whitelist/');
    }
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.get('/', (req, res) => {
  res.send('✅ Backend server running');
});
