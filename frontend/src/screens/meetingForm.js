import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMeeting } from '../actions/meetingActions';
import axios from 'axios';
import './MeetingForm.css';

const MeetingForm = () => {
  const [title, setTitle] = useState('');
  const [committeeName, setCommitteeName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [numberOfAttendees, setNumberOfAttendees] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUD_PRESET);

    setUploading(true);
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
        formData
      );
      console.log(data);
      setPdfUrl(data.secure_url);
    } catch (error) {
      console.error(error);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const meetingData = {
      title,
      committeeName,
      startTime,
      endTime,
      numberOfAttendees,
      pdf: pdfUrl,
    };

    dispatch(createMeeting(meetingData));
  };

  return (
    <div className="form-container">
      <h1>Meeting Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Meeting Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="committeeName">Committee Name</label>
          <input type="text" id="committeeName" value={committeeName} onChange={(e) => setCommitteeName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input type="datetime-local" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input type="datetime-local" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="numberOfAttendees">Number of Attendees</label>
          <input type="number" id="numberOfAttendees" value={numberOfAttendees} onChange={(e) => setNumberOfAttendees(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="pdf">Upload PDF</label>
          <input type="file" id="pdf" onChange={uploadFileHandler} required />
          {uploading && <p className="uploading-message">Uploading...</p>}
        </div>
        <button type="submit">Submit Meeting Details</button>
      </form>
    </div>
  );
};

export default MeetingForm;
