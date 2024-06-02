import express from 'express';
import Meeting from '../models/meetingModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('in');
    console.log(req.body);
    const { title, committee, startTime, endTime, attendees, pdf } = req.body;

    const meeting = new Meeting({
      title:req.body.title,
      committee:req.body.committeeName,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      attendees: req.body.numberOfAttendees,
      pdf:req.body.pdf,
    });
    console.log(meeting);

    const createdMeeting = await meeting.save();
    res.status(201).json(createdMeeting);
  } catch (error) {
    res.status(400).json({ message: 'Error creating meeting' });
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
