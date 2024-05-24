import express from 'express'
import asyncHandler from 'express-async-handler'
import CommitteeMember from '../models/committeeMemberModel.js'
import capitalize from '../config/capitalize.js'
import NepaliDate from 'nepali-date-converter'
import CommitteeMemberFees from '../models/committeeMemberFeesModel.js'
import protect from '../middleware/authMiddleware.js'
import CommitteeMemberAttendance from '../models/committeeMemberAttendanceModel.js'
import Dashboard from '../models/dashboardModel.js'
const router = express.Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const committeeMembers = await CommitteeMember.find({})

    res.json(committeeMembers)
  })
)
router.get(
  '/class/:id',
  asyncHandler(async (req, res) => {
    const committeeMembers = await CommitteeMember.find({ classname: req.params.id })
    if (committeeMembers.length > 0) {
      console.log(committeeMembers)

      res.json(committeeMembers)
    } else {
      res.status(404).json({ message: 'No committeeMembers found.' })
    }
  })
)
// the following route is for loading attendance and committeeMembers info.
router.get(
  '/class/:id/attendance',
  asyncHandler(async (req, res) => {
    const committeeMembers = await CommitteeMemberAttendance.findOne({
      attendance_date: new NepaliDate().format('YYYY-MM-D'),
      classname: req.params.id,
    })
    // console.log("committeeMembers",committeeMembers.length())
    if (committeeMembers) {
      console.log(committeeMembers)

      res.json(committeeMembers)
    } else {
      res.status(404).json({ message: 'No committeeMembers found.' })
    }
  })
)

//following route is for searching the committeeMembers with the given name ,class and roll no
router.get(
  '/search/:name/:class/:roll_no',
  asyncHandler(async (req, res) => {
    console.log(req.params.name, req.params.class, req.params.roll_no)
    const committeeMember = await CommitteeMember.findOne({
      committeeMember_name: capitalize(req.params.name),
      classname: capitalize(req.params.class),
      roll_no: parseInt(req.params.roll_no),
    })
    console.log(committeeMember)

    if (committeeMember) {
      res.json(committeeMember)
    } else {
      res.status(404)
      res.json({ message: 'No committeeMember found with the given information.' })
    }
  })
)

//following route is for registering the committeeMembers

router.post(
  '/register',
  //the protect used here is used for getting the id of the admin who registered the committeeMember

  protect,
  asyncHandler(async (req, res) => {
    const {
      committeeMember_name,
      classname,

      address,
      parents_name,
      contact_no,
      gender,

      age,
      email,
      registration_fees,
      image,
    } = req.body
    // const committeeMember_info =
    const committeeMember_info =
      (await CommitteeMember.find({
        classname: classname,
      })) &&
      (await CommitteeMember.findOne({ classname: classname })
        .sort({ roll_no: -1 })
        .limit(1))
    if (committeeMember_info) {
      var roll_no = committeeMember_info.roll_no + 1
    } else {
      var roll_no = 1
    }
    // (await CommitteeMember.aggregate({ "$max": '$roll_no', classname: classname }))
    // console.log('committeeMember_info is', committeeMember_info)
    console.log(req.body)
    const registered_by = req.user.name

    console.log(registered_by)
    const previous_dues = 0
    // const roll_no = 3
    console.log('roll no is', roll_no)
    const committeeMembername = capitalize(committeeMember_name)
    const new_committeeMember = await CommitteeMember.create({
      registered_by,
      committeeMember_name: committeeMembername,
      email,
      address,
      gender,
      classname,
      contact_no,
      roll_no,
      parents_name,
      age,
      previous_dues,
      registration_fees,

      image,
    })
    console.log(new_committeeMember)
    if (new_committeeMember) {
      const total_committeeMembers = (await CommitteeMember.find()).length
      await Dashboard.findOneAndUpdate(
        { title: 'CommitteeMembers' },
        { number: total_committeeMembers }
      )
      console.log('done')
      console.log('total number of committeeMembers', total_committeeMembers)
      res.status(201).json({
        message: 'CommitteeMember registered successfully',
      })
      console.log('registered successfully')
    } else {
      res.status(400)
      console.log(error)
      throw new Error('Unable to register committeeMember')
    }
  })
)

//following route is for paying the fees of committeeMembers

//following route is for attendance of committeeMembers
router.post(
  '/attendance/:classname',
  protect,
  asyncHandler(async (req, res) => {
    // const committeeMembers = await CommitteeMember.find({})
    const { committeeMembers } = req.body
    console.log(req.body)
    const class_chairperson = req.user.name
    // console.log(req.params.classname)
    const attendanceFound = await CommitteeMemberAttendance.findOne({
      attendance_date: new NepaliDate().format('YYYY-MM-D'),
      classname: req.params.classname,
    })
    console.log(attendanceFound)
    if (attendanceFound) {
      await CommitteeMemberAttendance.updateOne(
        { _id: attendanceFound._id },
        { $set: { committeeMembers: committeeMembers } }
      )
      console.log('done with re-attendance')
      res.status(201).json({ message: 'Attendance retaken successfully' })
    } else {
      const new_attendance = await CommitteeMemberAttendance.create({
        class_chairperson,
        classname: req.params.classname,
        attendance_date: new NepaliDate().format('YYYY-MM-D'),
        committeeMembers,
      })
      console.log(new_attendance)
      if (new_attendance) {
        res.status(201).json({
          message: 'Attendance taken successfully',
        })
      } else {
        res.status(400)
        console.log(error)
        throw new Error('Unable to take attendance')
      }
    }
  })
)

//following route is for admit card of the committeeMember

//following route is for deleting the committeeMember
router.delete(
  '/delete/:id',
  asyncHandler(async (req, res) => {
    const committeeMember = await CommitteeMember.findById(req.params.id)
    if (committeeMember) {
      await committeeMember.remove()
      const total_committeeMembers = (await CommitteeMember.find()).length
      await Dashboard.findOneAndUpdate(
        { title: 'CommitteeMembers' },
        { number: total_committeeMembers }
      )
      res.json({ message: 'CommitteeMember removed' })
    } else {
      res.status(404)
      throw new Error('committeeMember not found')
    }
  })
)

router.post(
  '/fees/:id',
  protect,
  asyncHandler(async (req, res) => {
    const {
      committeeMember_name,
      classname,
      roll_no,
      month_name,
      year,
      monthly_fees,
      hostel_fees,
      laboratory_fees,
      computer_fees,
      exam_fees,
      miscellaneous,
    } = req.body
    console.log(req.params.id)
    console.log(req.body)
    const committeeMember = await CommitteeMember.findById(req.params.id)
    // console.log('committeeMember is ', committeeMember)
    if (committeeMember) {
      const accountant = req.user.name
      const fees_submitted = await CommitteeMemberFees.create({
        accountant,
        committeeMember_name,
        classname,
        roll_no,
        month_name,
        year,
        monthly_fees,
        hostel_fees,
        laboratory_fees,
        computer_fees,
        exam_fees,
        miscellaneous,
      })
      if (fees_submitted) {
        const total_Fees = await CommitteeMemberFees.find()
          .select(
            'monthly_fees hostel_fees laboratory_fees computer_fees exam_fees miscellaneous '
          )
          .select('-_id')
        var total_Fees1 = 0
        total_Fees.map(
          (fee) =>
            (total_Fees1 =
              total_Fees1 +
              fee.monthly_fees +
              fee.hostel_fees +
              fee.laboratory_fees +
              fee.computer_fees +
              fee.exam_fees +
              fee.miscellaneous)
          // return total_Fees
        )

        // console.log('total fees are-', total_Fees)

        // console.log('total_Fees', total_Fees)
        await Dashboard.findOneAndUpdate(
          { title: 'Income' },
          { number: total_Fees1 }
        )
        res.status(201).json({ message: 'Fees Paid successfully' })
        console.log('fees success')
      } else {
        res.status(400)
        throw new Error('Error occured while paying fees')
      }
    } else {
      res.status(404)
      throw new Error('CommitteeMember not found')
    }
  })
)

//for the fees of committeeMembers

export default router
