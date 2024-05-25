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
      type: String,
    },
  },
  {
    timestamps: true,
  }
)
//the below is required code for converting the schema to the model
//as per the documentation of mongoose
//any name can be given as a constant in the place of the CommitteeMember
const Chairperson = mongoose.model('Chairperson', chairpersonSchema)
//Chairperson variable is exported as follow is a ES module.
export default Chairperson
