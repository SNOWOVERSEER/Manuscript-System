import React, { useState, useEffect } from "react";
import UserProfileDisplay from "./UserProfileDisplay";
import UserEditProfileForm from "./UserEditProfileForm";
import { update_authors_info_API } from "../../../apis/authorInfo";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  const [userData, setUserData] = useState(null); // Initialize with null to check loading state
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if userInfo is available
    if (userInfo) {
      setUserData(userInfo);
    } else {
      // Fetch user info from an API if not available in the store
      const fetchUserData = async () => {
        try {
          const id = localStorage.getItem("id");
          // Replace with your API call to fetch user data
          const response = await fetch(`/api/users/${id}`);
          const data = await response.json();
          // Dispatch an action to update the user info in the store if necessary
          // dispatch({ type: 'UPDATE_USER_INFO', payload: data });
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          message.error("Failed to fetch user data.");
        }
      };

      fetchUserData();
    }
  }, [userInfo, dispatch]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const id = localStorage.getItem("id");
      const response = await update_authors_info_API({ ...updatedData, id });
      console.log("Update user info response", response);
      message.success("Updated successfully");
      setUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update Error", error);
      message.error("Failed to update");
    }
  };

  // Show a loading state if userData is null
  if (!userData) {
    return <div>Loading...</div>;
  }

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
