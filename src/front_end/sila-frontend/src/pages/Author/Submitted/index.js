// ProfilePage.jsx
import React, { useState } from "react";
import UserProfileDisplay from "./UserProfileDisplay";
import UserEditProfileForm from "./UserEditProfileForm";
import { update_authors_info_API } from "../../../apis/authorInfo";
import { useSelector } from "react-redux";
import { message } from "antd";

const ProfilePage = () => {
  const { firstName, lastName, email, address, phone, gender, birthDate, bio } =
    useSelector((state) => state.user.userInfo);

  const initialProfileData = {
    firstName,
    lastName,
    email,
    address,
    phone,
    gender,
    birthDate,
    bio,
  };

  const [userData, setUserData] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData) => {
    setUserData({ ...userData, ...updatedData });
    try {
      updatedData["id"] = localStorage.getItem("id");
      console.log(updatedData);
      const response = await update_authors_info_API(updatedData);
      console.log("Update user info response", response);
      message.success("Updated successfully");
    } catch (error) {
      console.error("Update Error", error);
      message.error("Failed to update");
    }
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
