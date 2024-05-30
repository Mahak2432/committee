import express from 'express';
import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';
import CommitteeMember from '../models/committeeMemberModel.js';
import NonTeachingHod from '../models/nonTeachingHodModel.js';
import Chairperson from '../models/chairpersonModel.js';
import generateToken from '../utils/generateToken.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

const findUser = async (email, userType) => {
  let user;
  switch (userType) {
    case 'Admin':
      user = await Admin.findOne({ email });
      break;
    case 'CommitteeMember':
      user = await CommitteeMember.findOne({ email });
      break;
    case 'Hod':
      user = await NonTeachingHod.findOne({ email });
      break;
    case 'Chairperson':
      user = await Chairperson.findOne({ email });
      break;
    default:
      throw new Error('Invalid user type');
  }
  return user;
};

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { email, password, userType } = req.body;
    const user = await findUser(email, userType);

    if (user) {
      let isValidPassword;
      if (userType === 'Admin') {
        isValidPassword = await user.matchPassword(password);
      } else {
        isValidPassword = user.contact_no === password;
      }

      if (isValidPassword) {
        res.json({
          ...user.toObject(),
          userType,
          token: generateToken(user._id),
        });
      } else {
        res.status(401);
        throw new Error('Invalid email or password');
      }
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  })
);

router.get(
  '/user',
  protect,
  asyncHandler(async (req, res) => {
    let user;
    switch (req.user.userType) {
      case 'Admin':
        user = await Admin.findById(req.user._id);
        break;
      case 'CommitteeMember':
        user = await CommitteeMember.findById(req.user._id);
        break;
      case 'Hod':
        user = await NonTeachingHod.findById(req.user._id);
        break;
      case 'Chairperson':
        user = await Chairperson.findById(req.user._id);
        break;
      default:
        res.status(404);
        throw new Error('User not found');
    }

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: req.user.userType,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  })
);

export default router;
