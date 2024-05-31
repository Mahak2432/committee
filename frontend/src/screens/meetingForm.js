import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMeeting } from '../actions/meetingActions';

const MeetingForm = () => {
  const [title, setTitle] = useState('');
  const [committeeName, setCommitteeName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [numberOfAttendees, setNumberOfAttendees] = useState('');
  const [pdf, setPdf] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('committeeName', committeeName);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('numberOfAttendees', numberOfAttendees);
    formData.append('pdf', pdf);

    dispatch(createMeeting(formData));
  };

  return (
    <div className="form-container">
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
          <input type="file" id="pdf" onChange={(e) => setPdf(e.target.files[0])} required />
        </div>
        <button type="submit">Create Meeting</button>
      </form>
    </div>
  );
};

export default MeetingForm;
