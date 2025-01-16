"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Query } from "appwrite";
import { account, databases } from "@/app/appwrite";

const MedicalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    userId: "", // Ensure userId is part of the profile object
  });
  const [editSavedMessage, setEditSavedMessage] = useState(null);

  const [userId, setUserId] = useState(null);
  const databaseId = "6787fd2600013521f403";
  const collectionId = "6788db2a002f752f28a0";

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get(); // Fetch logged-in user details
        setUserId(user.$id); // Set the user ID
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Please log in to book an appointment.");
      }
    };

    getUser();
  }, []);

  // Fetch the user's profile data from Appwrite
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.equal("userId", userId)]
        );

        if (response.documents.length > 0) {
          const existingProfile = response.documents[0]; // Assuming one profile per user
          setProfile(existingProfile); // Set the existing profile in state, including $id
        } else {
          console.log("No profile found for the user.");
          // Initialize the profile with the userId
          setProfile((prevProfile) => ({ ...prevProfile, userId }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle saving changes to Appwrite
  const handleSaveChanges = async () => {
    try {
      if (profile.$id) {
        // Update the existing document
        await databases.updateDocument(databaseId, collectionId, profile.$id, {
          ...profile,
        });
      } else {
        // Create a new document if one doesn't exist
        const response = await databases.createDocument(
          databaseId,
          collectionId,
          "unique()",
          {
            ...profile,
          }
        );
        setProfile((prevProfile) => ({ ...prevProfile, $id: response.$id })); // Save the new document ID in the state
      }

      setEditSavedMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setEditSavedMessage("Failed to update profile.");
    }
  };

  useEffect(() => {
    if (editSavedMessage) {
      const timer = setTimeout(() => {
        setEditSavedMessage("");
      }, 2000); // Message disappears after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [editSavedMessage]);

  return (
    <div className="bg-background px-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Account Details
        </h2>
        <div className="w-full">
          <label className="block text-gray-600 mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 my-4">
          Personal Information
        </h2>
        <form className="space-y-4">
          <div className="flex gap-6">
            <div className="w-full">
              <label className="block text-gray-600 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-600 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-full">
              <label className="block text-gray-600 mb-2">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-gray-600 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Medical Information
          </h2>
          <div className="flex gap-6">
            <div className="w-full">
              <label className="block text-gray-600 mb-2">Blood Type</label>
              <select
                type="text"
                name="bloodType"
                value={profile.bloodType}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-gray-600 mb-2">Allergies</label>
              <input
                type="text"
                name="allergies"
                value={profile.allergies}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-gray-600 mb-2">
              Medical Conditions
            </label>
            <input
              type="text"
              name="medicalConditions"
              value={profile.medicalConditions}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Emergency Contact
          </h2>
          <div className="flex gap-6">
            <div className="w-full">
              <label className="block text-gray-600 mb-2">Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={profile.emergencyContactName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-600 mb-2">Phone Number</label>
              <input
                type="phone"
                name="emergencyContactNumber"
                value={profile.emergencyContactNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4 items-center">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Save Changes
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Edit Profile
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            )}
            {editSavedMessage && (
              <p className="flex items-center gap-2">
                <FaCheckCircle size={20} color="#0feb37" />
                {editSavedMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalProfile;
