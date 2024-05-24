import mongoose from 'mongoose'
const nonTeachingHodAttendanceSchema = mongoose.Schema({
  admin: {
    type: String,
    required: true,
  },
  attendance_date: {
    type: Date,
    default: Date.now(),
  },

  hods: [
    {
      hod_name: {
        type: String,
        required: true,
      },

      hodId: {
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

const nonTeachingHodAttendance = mongoose.model(
  'nonTeachingHodAttendance',
  nonTeachingHodAttendanceSchema
)
export default nonTeachingHodAttendance
