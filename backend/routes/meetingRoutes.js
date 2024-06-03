import express from 'express';
import multer from 'multer';
import path from 'path';
import Meeting from '../models/meetingModel.js';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');  // Make sure the 'uploads' directory exists
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { title, committee, startTime, endTime, attendees } = req.body;
    const pdf = req.file.path;
    console.log(req.body,title);
    const meeting = new Meeting({
      title:req.body.title,
      committee:req.body.committeeName,
      startTime: req.body.startTime,
      endTime:req.body.endTime,
      attendees:req.body.numberOfAttendees,
      pdf,
    });

    const createdMeeting = await meeting.save();
    res.status(201).json(createdMeeting);
  } catch (error) {
    res.status(400).json({ message: 'Error creating meeting', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find({});
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meetings' });
  }
});

export default router;
