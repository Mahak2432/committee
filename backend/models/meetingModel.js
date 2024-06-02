import mongoose from 'mongoose';

const meetingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    committee: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    attendees: {
      type: Number,
      required: true,
    },
    pdf: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
