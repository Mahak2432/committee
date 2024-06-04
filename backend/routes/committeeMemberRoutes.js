import express from 'express';
import asyncHandler from 'express-async-handler';
import CommitteeMember from '../models/committeeMemberModel.js';
import capitalize from '../config/capitalize.js';
import protect from '../middleware/authMiddleware.js';
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
  '/committee/:id',
  asyncHandler(async (req, res) => {
    const committeeMembers = await CommitteeMember.find({ 'committees.committee_name': req.params.id });
    if (committeeMembers.length > 0) {
      res.json(committeeMembers);
    } else {
      res.status(404).json({ message: 'No committee members found.' });
    }
  })
);

router.post(
  '/register',
  protect,
  asyncHandler(async (req, res) => {
    const {
      committeeMember_name,
      committees,
      address,
      contact_no,
      gender,
      age,
      email,
      image,
    } = req.body;

    let committeeMember = await CommitteeMember.findOne({ email: email });

    if (committeeMember) {
      committees.forEach(newCommittee => {
        const existingCommittee = committeeMember.committees.find(c => c.committee_name === newCommittee.committee_name);
        if (existingCommittee) {
          existingCommittee.role = newCommittee.role;
        } else {
          committeeMember.committees.push(newCommittee);
        }
      });

      await committeeMember.save();
      res.status(200).json({ message: 'CommitteeMember updated successfully with new committees and roles' });
    } else {
      const registered_by = req.user ? req.user.name : "chaiperson";
      const committeeMembername = capitalize(committeeMember_name);
      console.log(req.body);
      const new_committeeMember = await CommitteeMember.create({
        registered_by,
        committeeMember_name: committeeMembername,
        email,
        address,
        gender,
        committees,
        contact_no,
        age,
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

export default router;
