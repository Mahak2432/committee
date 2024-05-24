import mongoose from 'mongoose'
const nonTeachingHodSalarySchema = mongoose.Schema(
  {
    admin: {
      type: String,
      required: true,
    },
    hod_name: {
      type: String,
      required: true,
    },
    hodId: {
      type: String,
      required: true,
    },
    salaryForTheYear: {
      type: String,
      required: true,
    },
    salaryForTheMonth: {
      type: String,
      required: true,
    },
    salaryAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const NonTeachingHodSalary = mongoose.model(
  'NonTeachingHodSalary',
  nonTeachingHodSalarySchema
)
export default NonTeachingHodSalary
