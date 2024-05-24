import mongoose from 'mongoose'
const committeeMemberAttendanceSchema = mongoose.Schema({
  class_chairperson: {
    type: String,
    required: true,
  },
  attendance_date: {
    type: Date,
    default: Date.now(),
  },
  classname: {
    type: String,
    required: true,
  },
  committeeMembers: [
    {
      committeeMember_name: {
        type: String,
        required: true,
      },
      classname: {
        type: String,
        required: true,
      },
      roll_no: {
        type: Number,
        required: true,
      },
      present: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    {
      timestamps: true,
    },
  ],
})

const CommitteeMemberAttendance = mongoose.model(
  'CommitteeMemberAttendance',
  committeeMemberAttendanceSchema
)
export default CommitteeMemberAttendance
