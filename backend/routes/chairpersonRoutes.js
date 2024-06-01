import express from 'express'
import asyncHandler from 'express-async-handler'
import protect from '../middleware/authMiddleware.js'
import Chairperson from '../models/chairpersonModel.js'
import capitalize from '../config/capitalize.js'
import Dashboard from '../models/dashboardModel.js'
import CommitteeMemberFees from '../models/committeeMemberFeesModel.js'
import ChairpersonSalary from '../models/chairpersonSalaryModel.js'
import ChairpersonAttendance from '../models/chairpersonAttendanceModel.js'
import NonTeachingHodSalary from '../models/nonTeachingHodSalary.js'

const   router = express.Router()

// Route for registering the chairperson
// Route for registering the chairperson
router.post(
  '/register',
  protect,
  asyncHandler(async (req, res) => {
    const {
      chairperson_name,
      qualification,
      address,
      contact_no,
      gender,
      previous_school,
      age,
      email,
      estimated_salary,
      image,
      subjectToTeach,
    } = req.body

    const existingChairperson = await Chairperson.findOne({ email })


    if (existingChairperson) {
      // Chairperson with the same email exists, append the new subjects
      const updatedSubjects = [...new Set([...existingChairperson.subjectToTeach, ...subjectToTeach])]
      existingChairperson.subjectToTeach = updatedSubjects
      await existingChairperson.save()

      return res.status(200).json({
        message: 'Chairperson updated with new subjects',
        chairperson: existingChairperson,
      })
    } else {
      const chairperson_info = await Chairperson.findOne().sort({ chairpersonId: -1 }).limit(1)
      const chairpersonId = chairperson_info ? chairperson_info.chairpersonId + 1 : 1

      const registered_by = req.user.name
      const chairpersonname = capitalize(chairperson_name)

      const new_chairperson = await Chairperson.create({
        registered_by,
        chairperson_name: chairpersonname,
        chairpersonId,
        qualification,
        address,
        contact_no,
        gender,
        previous_school,
        age,
        email,
        estimated_salary,
        image,
        subjectToTeach,
      })

      const total_chairpersons = await Chairperson.countDocuments()
      await Dashboard.findOneAndUpdate(
        { title: 'Chairpersons' },
        { number: total_chairpersons }
      )

      res.status(201).json({
        message: 'Chairperson registered successfully',
      })
    }
  })
)


// Route for getting all chairpersons
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const chairpersons = await Chairperson.find({})
    if (chairpersons.length > 0) {
      res.json(chairpersons)
    } else {
      res.status(500)
      throw new Error('No Chairpersons found')
    }
  })
)

// Route for deleting a chairperson
router.delete(
  '/delete/:id',
  asyncHandler(async (req, res) => {
    const chairperson = await Chairperson.findOne({ chairpersonId: req.params.id })
    if (chairperson) {
      await chairperson.remove()
      const total_chairpersons = await Chairperson.countDocuments()
      await Dashboard.findOneAndUpdate(
        { title: 'Chairpersons' },
        { number: total_chairpersons }
      )
      res.json({ message: 'Chairperson Deleted successfully' })
    } else {
      res.status(404)
      throw new Error('Chairperson not found with the given ID')
    }
  })
)

// Route for paying the fees of chairpersons
router.post(
  '/fees/:name/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { salaryForTheYear, salaryForTheMonth, salaryAmount } = req.body

    const chairperson_info = await Chairperson.findOne({
      chairperson_name: capitalize(req.params.name),
      chairpersonId: req.params.id,
    })

    if (chairperson_info) {
      const admin = req.user.name
      const chairpersonname = capitalize(req.params.name)
      const monthname = capitalize(salaryForTheMonth)
      const new_chairperson = await ChairpersonSalary.create({
        admin,
        chairperson_name: chairpersonname,
        chairpersonId: req.params.id,
        salaryForTheYear,
        salaryForTheMonth: monthname,
        salaryAmount,
      })

      const Fees = await ChairpersonSalary.find().select('salaryAmount').select('-_id')
      let total_Fees = Fees.reduce((acc, fee) => acc + fee.salaryAmount, 0)

      const Fees1 = await NonTeachingHodSalary.find().select('salaryAmount').select('-_id')
      let total_Fees1 = Fees1.reduce((acc, fee) => acc + fee.salaryAmount, 0)

      await Dashboard.findOneAndUpdate(
        { title: 'Salary Expenses' },
        { number: total_Fees + total_Fees1 }
      )

      res.status(201).json({
        message: 'Chairperson salary paid successfully',
      })
    } else {
      res.status(400)
      throw new Error('Chairperson not found')
    }
  })
)

// Route for getting all income
router.get(
  '/allincome',
  asyncHandler(async (req, res) => {
    const income = await CommitteeMemberFees.find({})
    if (income.length > 0) {
      res.json(income)
    } else {
      res.status(500)
      throw new Error('No Income made till date')
    }
  })
)

// Route for getting income of a particular year
router.get(
  '/allincome/:year',
  asyncHandler(async (req, res) => {
    const income = await CommitteeMemberFees.find({ year: req.params.year })
    if (income.length > 0) {
      res.json(income)
    } else {
      res.status(500)
      throw new Error(`No Income made for year ${req.params.year}`)
    }
  })
)

// Route for getting income of a particular month of a particular year
router.get(
  '/allincome/:year/:month',
  asyncHandler(async (req, res) => {
    const income = await CommitteeMemberFees.find({
      year: req.params.year,
      month_name: capitalize(req.params.month),
    })
    if (income.length > 0) {
      res.json(income)
    } else {
      res.status(500)
      throw new Error(`No Income made for month ${req.params.month} of year ${req.params.year}`)
    }
  })
)

// Route for getting all salaries
router.get(
  '/allsalaries',
  asyncHandler(async (req, res) => {
    const salary = await ChairpersonSalary.find({})
    const hod_salary = await NonTeachingHodSalary.find({})
    if (salary.length > 0 || hod_salary.length > 0) {
      const new_salary = salary.concat(hod_salary)
      res.json(new_salary)
    } else {
      res.status(500)
      throw new Error('No salary given till date')
    }
  })
)

// Route for getting all salaries of a particular year
router.get(
  '/allsalary/:year',
  asyncHandler(async (req, res) => {
    const salary = await ChairpersonSalary.find({
      salaryForTheYear: req.params.year,
    })
    const hod_salary = await NonTeachingHodSalary.find({
      salaryForTheYear: req.params.year,
    })
    if (salary.length > 0 || hod_salary.length > 0) {
      const new_salary = salary.concat(hod_salary)
      res.json(new_salary)
    } else {
      res.status(500)
      throw new Error(`No salary made for year ${req.params.year}`)
    }
  })
)

// Route for getting all salaries of a particular month of a particular year
router.get(
  '/allsalary/:year/:month',
  asyncHandler(async (req, res) => {
    const salary = await ChairpersonSalary.find({
      salaryForTheYear: req.params.year,
      salaryForTheMonth: capitalize(req.params.month),
    })
    const hod_salary = await NonTeachingHodSalary.find({
      salaryForTheYear: req.params.year,
      salaryForTheMonth: capitalize(req.params.month),
    })
    if (salary.length > 0 || hod_salary.length > 0) {
      const new_salary = salary.concat(hod_salary)
      res.json(new_salary)
    } else {
      res.status(500)
      throw new Error(`No salary made for month ${req.params.month} of year ${req.params.year}`)
    }
  })
)

export default router
