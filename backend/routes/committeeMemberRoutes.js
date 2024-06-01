import express from 'express';
import asyncHandler from 'express-async-handler';
import CommitteeMember from '../models/committeeMemberModel.js';
import capitalize from '../config/capitalize.js';
import NepaliDate from 'nepali-date-converter';
import CommitteeMemberFees from '../models/committeeMemberFeesModel.js';
import protect from '../middleware/authMiddleware.js';
import CommitteeMemberAttendance from '../models/committeeMemberAttendanceModel.js';
import Dashboard from '../models/dashboardModel.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const committeeMembers = await CommitteeMember.find({});
    res.json(committeeMembers);
  })
);

router.get(
  '/class/:id',
  asyncHandler(async (req, res) => {
    const committeeMembers = await CommitteeMember.find({ classname: req.params.id });
    if (committeeMembers.length > 0) {
      res.json(committeeMembers);
    } else {
      res.status(404).json({ message: 'No committee members found.' });
    }
  })
);

router.get(
  '/class/:id/attendance',
  asyncHandler(async (req, res) => {
    const committeeMembers = await CommitteeMemberAttendance.findOne({
      attendance_date: new NepaliDate().format('YYYY-MM-D'),
      classname: req.params.id,
    });
    if (committeeMembers) {
      res.json(committeeMembers);
    } else {
      res.status(404).json({ message: 'No committee members found.' });
    }
  })
);

router.get(
  '/search/:name/:class/:roll_no',
  asyncHandler(async (req, res) => {
    const committeeMember = await CommitteeMember.findOne({
      committeeMember_name: capitalize(req.params.name),
      classname: capitalize(req.params.class),
      roll_no: parseInt(req.params.roll_no),
    });

    if (committeeMember) {
      res.json(committeeMember);
    } else {
      res.status(404).json({ message: 'No committee member found with the given information.' });
    }
  })
);

router.post(
  '/register',
  protect,
  asyncHandler(async (req, res) => {
    const {
      committeeMember_name,
      classname,
      address,
      parents_name,
      contact_no,
      gender,
      age,
      email,
      registration_fees,
      image,
    } = req.body;

    let committeeMember = await CommitteeMember.findOne({ email: email });

    if (committeeMember) {
      classname.forEach(cls => {
        if (!committeeMember.classname.includes(cls)) {
          committeeMember.classname.push(cls);
        }
      });

      await committeeMember.save();
      res.status(200).json({ message: 'CommitteeMember updated successfully with new classes' });
    } else {
      const registered_by = req.user.name;
      const previous_dues = 0;
      const committeeMembername = capitalize(committeeMember_name);

      const new_committeeMember = await CommitteeMember.create({
        registered_by,
        committeeMember_name: committeeMembername,
        email,
        address,
        gender,
        classname,
        contact_no,
        roll_no: 1,
        parents_name,
        age,
        previous_dues,
        registration_fees,
        image,
      });

      if (new_committeeMember) {
        const total_committeeMembers = await CommitteeMember.countDocuments();
        await Dashboard.findOneAndUpdate({ title: 'CommitteeMembers' }, { number: total_committeeMembers });

        res.status(201).json({ message: 'CommitteeMember registered successfully' });
      } else {
        res.status(400);
        throw new Error('Unable to register committee member');
      }
    }
  })
);

router.post(
  '/attendance/:classname',
  protect,
  asyncHandler(async (req, res) => {
    const { committeeMembers } = req.body;
    const class_chairperson = req.user.name;

    const attendanceFound = await CommitteeMemberAttendance.findOne({
      attendance_date: new NepaliDate().format('YYYY-MM-D'),
      classname: req.params.classname,
    });

    if (attendanceFound) {
      await CommitteeMemberAttendance.updateOne(
        { _id: attendanceFound._id },
        { $set: { committeeMembers: committeeMembers } }
      );
      res.status(201).json({ message: 'Attendance retaken successfully' });
    } else {
      const new_attendance = await CommitteeMemberAttendance.create({
        class_chairperson,
        classname: req.params.classname,
        attendance_date: new NepaliDate().format('YYYY-MM-D'),
        committeeMembers,
      });

      if (new_attendance) {
        res.status(201).json({ message: 'Attendance taken successfully' });
      } else {
        res.status(400);
        throw new Error('Unable to take attendance');
      }
    }
  })
);

router.delete(
  '/delete/:id',
  asyncHandler(async (req, res) => {
    const committeeMember = await CommitteeMember.findById(req.params.id);
    if (committeeMember) {
      await committeeMember.remove();
      const total_committeeMembers = await CommitteeMember.countDocuments();
      await Dashboard.findOneAndUpdate({ title: 'CommitteeMembers' }, { number: total_committeeMembers });
      res.json({ message: 'CommitteeMember removed' });
    } else {
      res.status(404);
      throw new Error('Committee member not found');
    }
  })
);

router.post(
  '/fees/:id',
  protect,
  asyncHandler(async (req, res) => {
    const {
      committeeMember_name,
      classname,
      roll_no,
      month_name,
      year,
      monthly_fees,
      hostel_fees,
      laboratory_fees,
      computer_fees,
      exam_fees,
      miscellaneous,
    } = req.body;

    const committeeMember = await CommitteeMember.findById(req.params.id);

    if (committeeMember) {
      const accountant = req.user.name;
      const fees_submitted = await CommitteeMemberFees.create({
        accountant,
        committeeMember_name,
        classname,
        roll_no,
        month_name,
        year,
        monthly_fees,
        hostel_fees,
        laboratory_fees,
        computer_fees,
        exam_fees,
        miscellaneous,
      });

      if (fees_submitted) {
        const total_Fees = await CommitteeMemberFees.find()
          .select('monthly_fees hostel_fees laboratory_fees computer_fees exam_fees miscellaneous')
          .select('-_id');
        let total_Fees1 = 0;
        total_Fees.forEach((fee) => {
          total_Fees1 += fee.monthly_fees + fee.hostel_fees + fee.laboratory_fees + fee.computer_fees + fee.exam_fees + fee.miscellaneous;
        });

        await Dashboard.findOneAndUpdate({ title: 'Income' }, { number: total_Fees1 });
        res.status(201).json({ message: 'Fees Paid successfully' });
      } else {
        res.status(400);
        throw new Error('Error occurred while paying fees');
      }
    } else {
      res.status(404);
      throw new Error('Committee member not found');
    }
  })
);

export default router;
