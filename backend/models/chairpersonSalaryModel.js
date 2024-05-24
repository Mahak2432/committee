import mongoose from 'mongoose'
const chairpersonSalarySchema = mongoose.Schema(
  {
    admin: {
      type: String,
      required: true,
    },
    chairperson_name: {
      type: String,
      required: true,
    },
    chairpersonId: {
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

const ChairpersonSalary = mongoose.model('ChairpersonSalary', chairpersonSalarySchema)
export default ChairpersonSalary
