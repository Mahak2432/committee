import express from 'express'
import asyncHandler from 'express-async-handler'
import protect from '../middleware/authMiddleware.js'
import NonTeachingHod from '../models/nonTeachingHodModel.js'
import capitalize from '../config/capitalize.js'
import Dashboard from '../models/dashboardModel.js'
import NonTeachingHodSalary from '../models/nonTeachingHodSalary.js'
import nonTeachingHodAttendance from '../models/nonTeachingHodAttendance.js'
import ChairpersonSalary from '../models/chairpersonSalaryModel.js'
const router = express.Router()

//following router is for registering the chairperson

router.post(
  '/register',
  //the protect used here is used for getting the id of the admin who registered the chairperson

  protect,
  asyncHandler(async (req, res) => {
    const {
      hod_name,

      qualification,

      address,

      contact_no,
      gender,
      previous_school,

      age,
      email,
      estimated_salary,
      image,
      work,
    } = req.body
    // const hod_info =
    const hod_info =
      (await NonTeachingHod.find()) &&
      (await NonTeachingHod.findOne().sort({ hodId: -1 }).limit(1))
    console.log('hod info', hod_info)
    if (hod_info) {
      var hodId = hod_info.hodId + 1
    } else {
      var hodId = 1
    }

    console.log(req.body)
    const registered_by = req.user?req.use.name:"Admin"

    console.log(registered_by)

    console.log('hod id is-', hodId)
    const hodname = capitalize(hod_name)
    const new_hod = await NonTeachingHod.create({
      registered_by,
      hod_name: hodname,
      hodId,

      qualification,

      address,

      contact_no,
      gender,
      previous_school,

      age,
      email,
      estimated_salary,
      image,
      work,
    })
    console.log(new_hod)
    if (new_hod) {
      const total_hods = (await NonTeachingHod.find()).length
      await Dashboard.findOneAndUpdate(
        { title: 'Working Hods' },
        { number: total_hods }
      )
      console.log('done')
      console.log('total number of committeeMembers', total_hods)
      res.status(201).json({
        message: 'Hod registered successfully',
      })
      console.log('registered successfully')
    } else {
      res.status(400)
      console.log(error)
      throw new Error('Unable to register the hod')
    }
  })
)
//router for getting all the hods
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const hods = await NonTeachingHod.find({})
    if (hods.length > 0) {
      res.json(hods)
    } else {
      res.status(500)
      throw new Error('No hods found')
    }
  })
)

//following route is for deleting the chairperson

router.delete(
  '/delete/:id',
  asyncHandler(async (req, res) => {
    const hod = await NonTeachingHod.findOne({ hodId: req.params.id })
    if (hod) {
      await hod.remove()
      const total_hods = (await NonTeachingHod.find()).length
      await Dashboard.findOneAndUpdate(
        { title: 'Working Hods' },
        { number: total_hods }
      )
      res.json({ message: 'Hod Deleted successfully' })
    } else {
      res.status(404)
      throw new Error('Hod not found with the given ID')
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
    const hod_info = await NonTeachingHod.findOne({
      hod_name: capitalize(req.params.name),
      hodId: req.params.id,
    })
    console.log(hod_info)
    console.log(capitalize(req.params.name + ' ' + req.params.id))

    console.log('hod info', hod_info)
    if (hod_info) {
      const admin = req.user.name

      // console.log(admin)

      // console.log('hod id is-', hodId)
      const hodname = capitalize(req.params.name)
      const monthname = capitalize(salaryForTheMonth)
      const new_hod = await NonTeachingHodSalary.create({
        admin,
        hod_name: hodname,
        hodId: req.params.id,

        salaryForTheYear,
        salaryForTheMonth: monthname,
        salaryAmount,
      })
      console.log(new_hod)
      if (new_hod) {
        const Fees = await ChairpersonSalary.find()
          .select('salaryAmount')
          .select('-_id')
        console.log('Fees', Fees)
        var total_Fees = 0
        // for (i = 0; i < Fees.length; i++) {
        //   total_Fees = Fees[i]
        // }
        var total_Fees = 0
        Fees.map(
          (fee) => (total_Fees = total_Fees + fee.salaryAmount)
          // return total_Fees
        )
        const Fees1 = await NonTeachingHodSalary.find()
          .select('salaryAmount')
          .select('-_id')
        // for (i = 0; i < Fees.length; i++) {
        //   total_Fees = Fees[i]
        // }
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
          message: 'hod salary paid successfully',
        })
        console.log('paid successfully')
      } else {
        res.status(400)
        console.log(error)
        throw new Error('Unable to pay the salary')
      }
    } else {
      res.status(400)
      throw new Error('hod not found')
    }
  })
)
//router for getting all the hods
// router.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     const chairpersons = await Chairperson.find({})
//     if (chairpersons.length > 0) {
//       res.json(chairpersons)
//     } else {
//       res.status(500)
//       throw new Error('No Chairpersons found')
//     }
//   })
// )

export default router
