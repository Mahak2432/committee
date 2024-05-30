import mongoose from 'mongoose'

const chairpersonSchema = mongoose.Schema(
  {
    registered_by: {
      type: String,
      required: true,
      ref: 'Admin',
    },
    chairperson_name: {
      type: String,
      required: true,
    },
    chairpersonId: {
      type: Number,
    },
    qualification: {
      type: String,
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
    previous_school: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    estimated_salary: {
      type: Number,
    },
    image: {
      type: String,
      required: true,
    },
    subjectToTeach: {
      type: [String], // Array of strings
    },
  },
  {
    timestamps: true,
  }
)

const Chairperson = mongoose.model('Chairperson', chairpersonSchema)
export default Chairperson
