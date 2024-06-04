import mongoose from 'mongoose';

const roleSchema = mongoose.Schema({
  committee_name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  }
});

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
    committees: {
      type: [roleSchema],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
