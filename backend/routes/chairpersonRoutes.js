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
const router = express.Router()

//following router is for registering the chairperson

router.post(
  '/register',
  //the protect used here is used for getting the id of the admin who registered the chairperson

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
    // const chairperson_info =
    const chairperson_info =
      (await Chairperson.find()) &&
      (await Chairperson.findOne().sort({ chairpersonId: -1 }).limit(1))
    console.log('chairperson info', chairperson_info)
    if (chairperson_info) {
      var chairpersonId = chairperson_info.chairpersonId + 1
    } else {
      var chairpersonId = 1
    }

    console.log(req.body)
    const registered_by = req.user.name

    console.log(registered_by)

    console.log('chairperson id is-', chairpersonId)
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
    console.log(new_chairperson)
    if (new_chairperson) {
      const total_chairpersons = (await Chairperson.find()).length
      await Dashboard.findOneAndUpdate(
        { title: 'Chairpersons' },
        { number: total_chairpersons }
      )
      console.log('done')
      console.log('total number of committeeMembers', total_chairpersons)
      res.status(201).json({
        message: 'Chairperson registered successfully',
      })
      console.log('registered successfully')
    } else {
      res.status(400)
      console.log(error)
      throw new Error('Unable to register the chairperson')
    }
  })
)
//router for getting all the chairpersons
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

//following route is for deleting the chairperson

router.delete(
  '/delete/:id',
  asyncHandler(async (req, res) => {
    const chairperson = await Chairperson.findOne({ chairpersonId: req.params.id })
    if (chairperson) {
      await chairperson.remove()
      const total_chairpersons = (await Chairperson.find()).length
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

//following route is for paying the fees of chairpersons

router.post(
  '/fees/:name/:id',
  //the protect used here is used for getting the id of the admin who registered the chairperson

  protect,
  asyncHandler(async (req, res) => {
    const { salaryForTheYear, salaryForTheMonth, salaryAmount } = req.body
    console.log(req.body)
    // const chairperson_info =
    const chairperson_info = await Chairperson.findOne({
      chairperson_name: capitalize(req.params.name),
      chairpersonId: req.params.id,
    })
    console.log(capitalize(req.params.name + ' ' + req.params.id))

    console.log('chairperson info', chairperson_info)
    if (chairperson_info) {
      const admin = req.user.name

      // console.log(admin)

      // console.log('chairperson id is-', chairpersonId)
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
      console.log(new_chairperson)
      if (new_chairperson) {
        const Fees = await ChairpersonSalary.find()
          .select('salaryAmount')
          .select('-_id')
        console.log('Fees', Fees)
        var total_Fees = 0

        var total_Fees = 0
        Fees.map((fee) => (total_Fees = total_Fees + fee.salaryAmount))
        const Fees1 = await NonTeachingHodSalary.find()
          .select('salaryAmount')
          .select('-_id')

        var total_Fees1 = 0
        Fees1.map(
          (fee) => (total_Fees1 = total_Fees1 + fee.salaryAmount)
          // return total_Fees
        )
        await Dashboard.findOneAndUpdate(
          { title: 'Salary Expenses' },
          { number: total_Fees + total_Fees1 }
        )
        res.status(201).json({
          message: 'Chairperson salary paid successfully',
        })
        console.log('paid successfully')
      } else {
        res.status(400)
        console.log(error)
        throw new Error('Unable to pay the salary')
      }
    } else {
      res.status(400)
      throw new Error('Chairperson not found')
    }
  })
)

//for getting information regarding income

//all income generated till now
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

//particular year

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

//paritcular month of particular year
router.get(
  '/allincome/:year/:month',
  asyncHandler(async (req, res) => {
    const income = await CommitteeMemberFees.find({
      year: req.params.year,
      month_name: capitalize(req.params.month),
    })
    console.log('hello')
    console.log(req.params.year + req.params.month)
    if (income.length > 0) {
      // res.status(201)
      res.json(income)
    } else {
      res.status(500)
      throw new Error(
        `No Income made for month ${req.params.month} of year ${req.params.year}`
      )
    }
  })
)

//the following is for the salary given to the hods and the  chairpersons

router.get(
  '/allsalaries',
  asyncHandler(async (req, res) => {
    const salary = await ChairpersonSalary.find({})
    const hod_salary = await NonTeachingHodSalary.find({})
    if (salary.length > 0 || hod_salary.length > 0) {
      var new_salary = salary.concat(hod_salary)
      res.json(new_salary)
    } else {
      res.status(500)
      throw new Error('No salary given till date')
    }
  })
)

//particular year

router.get(
  '/allsalary/:year',
  asyncHandler(async (req, res) => {
    const salary = await ChairpersonSalary.find({
      salaryForTheYear: req.params.year,
    })
    const hod_salary = await NonTeachingHodSalary.find({
      salaryForTheYear: req.params.year,
    })
    console.log(salary)
    console.log('hodsalary', hod_salary)
    if (salary.length > 0 || hod_salary.length > 0) {
      var new_salary = salary.concat(hod_salary)
      res.json(new_salary)
    } else {
      res.status(500)
      throw new Error(`No salary made for year ${req.params.year}`)
    }
  })
)

//paritcular month of particular year
router.get(
  '/allsalary/:year/:month',
  asyncHandler(async (req, res) => {
    const salary = await ChairpersonSalary.find({
      salaryForTheYear: req.params.year,
      salaryForTheMonth: capitalize(req.params.month),
    })
    console.log('hello')
    const hod_salary = await NonTeachingHodSalary.find({
      salaryForTheYear: req.params.year,
      salaryForTheMonth: capitalize(req.params.month),
    })
    if (salary.length > 0 || hod_salary.length > 0) {
      var new_salary = salary.concat(hod_salary)
      res.json(new_salary)
    } else {
      res.status(500)
      throw new Error(
        `No salary made for month ${req.params.month} of year ${req.params.year}`
      )
    }
  })
)

export default router
