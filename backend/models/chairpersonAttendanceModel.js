import mongoose from 'mongoose'
const chairpersonAttendanceSchema = mongoose.Schema({
  admin: {
    type: String,
    required: true,
  },
  attendance_date: {
    type: Date,
    default: Date.now(),
  },

  chairpersons: [
    {
      chairperson_name: {
        type: String,
        required: true,
      },

      chairpersonId: {
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

const ChairpersonAttendance = mongoose.model(
  'ChairpersonAttendance',
  chairpersonAttendanceSchema
)
export default ChairpersonAttendance
