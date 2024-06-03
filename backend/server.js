import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import connectDB from './config/db.js';
import committeeMemberRoutes from './routes/committeeMemberRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chairpersonRoutes from './routes/chairpersonRoutes.js';
import hodRoutes from './routes/hodRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import signatureRoute from './routes/signatureRoute.js';
import Dashboard from './models/dashboardModel.js';

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/dashboard', async (req, res) => {
  const items = await Dashboard.find();
  res.json(items);
});

app.use('/api/committeeMembers', committeeMemberRoutes);
app.use('/api/login', adminRoutes);
app.use('/api/chairpersons', chairpersonRoutes);
app.use('/api/hods', hodRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api', signatureRoute);

app.get('/api/config/cloudinary', (req, res) => {
  res.send(process.env.CLOUDINARY_URL);
});

app.get('/api/config/cloudinarypreset', (req, res) => {
  res.send(process.env.CLOUDINARY_UPLOAD_PRESET);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error Handling
app.use((req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
