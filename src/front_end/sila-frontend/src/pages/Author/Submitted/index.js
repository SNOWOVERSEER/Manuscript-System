// ProfilePage.jsx
import React, { useState } from 'react';
import UserProfileDisplay from './UserProfileDisplay';
import UserEditProfileForm from './UserEditProfileForm';

const ProfilePage = () => {
  const initialProfileData = {
    username: 'JohnDoe',
    Email: '123@gmail.com',
    address: '1234 Sunset Blvd',
    phoneNumber: '123-456-7890',
    gender: 'Female',
    bio: 'This is a short bio....',
  };

  const [userData, setUserData] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedData) => {
    setUserData({ ...userData, ...updatedData });
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <UserEditProfileForm userData={userData} onSave={handleSave} />
      ) : (
        <UserProfileDisplay userData={userData} onEdit={handleEdit} />
      )}
    </div>
  );
};

export default ProfilePage;
