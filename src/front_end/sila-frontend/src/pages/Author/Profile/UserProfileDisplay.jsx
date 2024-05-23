// UserProfileDisplay.jsx
import React from 'react';
import './UserProfileDisplay.scss';

const UserProfileDisplay = ({ userData, onEdit }) => {
  return (
    <div className="profile-container">
      <div className="profile-header">Account</div>
      <div className="profile-section">
        <div className="profile-section-header">Profile</div>
        
        <div className="profile-detail">{userData.firstName}</div>
      </div>
      <div className="profile-section">
        <div className="profile-detail">
          <span className="profile-detail-label">First Name: </span>
          <span>{userData.firstName}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Last Name: </span>
          <span>{userData.lastName}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Email addresses: </span>
          <span>{userData.email}</span>
          <span className="primary-tag">Primary</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Address: </span>
          <span>{userData.address}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Phone Number: </span>
          <span>{userData.phone}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Gender: </span>
          <span>{userData.gender}</span>
        </div>
        <div className="profile-detail">
          <span className="profile-detail-label">Date of Birth: </span>
          <span>{userData.birthDate}</span>
        </div>
        <div className="profile-detail profile-detail-bio">
          <span className="profile-detail-label">Bio: </span>
          <span>{userData.bio}</span>
        </div>
      </div>
      <button className="edit-button" onClick={onEdit}>Edit</button>
    </div>
  );
};

export default UserProfileDisplay;
