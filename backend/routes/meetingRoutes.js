import express from 'express';
import multer from 'multer';
import path from 'path';
import Meeting from '../models/meetingModel.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/uploads', upload.single('pdf'), async (req, res) => {
  try {
    console.log('in');
    const { title, committee, startTime, endTime, attendees } = req.body;
    const pdf = req.file.path;


    const meeting = new Meeting({
      title,
      committee,
      startTime,
      endTime,
      attendees,
      pdf,
    });

    const createdMeeting = await meeting.save();
    res.status(201).json(createdMeeting);
  } catch (error) {
    res.status(400).json({ message: 'Error creating meeting' });
  }
});

router.get('/api/meetings', async (req, res) => {
  try {
    const meetings = await Meeting.find({});
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meetings' });
  }
});

export default router;
