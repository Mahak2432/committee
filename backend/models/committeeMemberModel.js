import mongoose from 'mongoose';

const committeeMemberSchema = mongoose.Schema(
  {
    registered_by: {
      type: String,
      required: true,
      ref: 'Admin',
    },
    committeeMember_name: {
      type: String,
      required: true,
    },
    classname: {
      type: [String],
      required: true,
    },
    roll_no: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    parents_name: {
      type: String,
    },
    contact_no: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    previous_dues: {
      type: Number,
    },
    age: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    registration_fees: {
      type: Number,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommitteeMember = mongoose.model('CommitteeMember', committeeMemberSchema);
export default CommitteeMember;
