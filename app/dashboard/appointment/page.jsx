"use client";

import React, { useState, useEffect, useMemo } from "react";
import { databases, account } from "@/app/appwrite";
import { Query } from "appwrite"; // Import Appwrite services

const AppointmentBooking = () => {
  const [appointments, setAppointments] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [givenReason, setGivenReason] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // Store logged-in user ID
  const currentDate = new Date();

  function formatDateToLongFormat(dateString) {
    const date = new Date(dateString);

    const day = date.getDate(); // Day of the month (1-31)
    const month = date.toLocaleString("default", { month: "long" }); // Full month name
    const year = date.getFullYear(); // Full year (e.g., 2025)

    return `${day} ${month}, ${year}`;
  }

  function convertTo12HourTime(time24) {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight and handle noon correctly

    return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
  }

  function convertToDateOnly(dateString) {
    try {
      const date = new Date(dateString); // Parse the input date string
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      // Extract year, month, and day, and format as yyyy-MM-dd
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error converting date:", error.message);
      return null; // Return null for invalid input
    }
  }

  // Fetch logged-in user details
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

  // Fetch doctors and appointments
  useEffect(() => {
    // Mock data for available doctors
    setAvailableDoctors([
      "Dr. Smith",
      "Dr. Johnson",
      "Dr. Brown",
      "Dr. Lee",
      "Dr. Adams",
    ]);

    // Fetch appointments from Appwrite
    const fetchAppointments = async () => {
      if (!userId) return; // Wait until userId is available

      try {
        const response = await databases.listDocuments(
          "6787fd2600013521f403", // Replace with your database ID
          "6787fd430009a834f6ed", // Replace with your collection ID
          [Query.equal("userId", userId)] // Fetch appointments for the logged-in user
        );
        if (response.documents) {
          setLoading(false);
          setAppointments(response.documents);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, [userId]);

  // Update statuses based on current date
  const updatedAppointments = useMemo(() => {
    return appointments.map((appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}Z`
      );
      return {
        ...appointment,
        status:
          appointmentDateTime < currentDate
            ? "Completed"
            : appointmentDateTime.toDateString() === currentDate.toDateString()
            ? "Today"
            : "Upcoming",
      };
    });
  }, [appointments, currentDate]);

  // Handle Booking
  const handleBooking = async (e) => {
    e.preventDefault();
    if (selectedDoctor && appointmentDate && appointmentTime && userId) {
      try {
        const appointmentDateTime = new Date(
          `${appointmentDate}T${appointmentTime}`
        );
        const newAppointment = {
          doctor: selectedDoctor,
          date: convertToDateOnly(appointmentDate),
          time: appointmentTime,
          reason: givenReason,
          status:
            appointmentDateTime < currentDate
              ? "Completed"
              : appointmentDateTime.toDateString() ===
                currentDate.toDateString()
              ? "Today"
              : "Upcoming",
          userId, // Add the user ID to the document
        };

        // Save to Appwrite
        const response = await databases.createDocument(
          "6787fd2600013521f403", // Replace with your database ID
          "6787fd430009a834f6ed", // Replace with your collection ID
          "unique()", // Generate a unique document ID
          newAppointment
        );

        // Update local state
        setAppointments([...appointments, response]);

        // Reset form
        setSelectedDoctor("");
        setAppointmentDate("");
        setAppointmentTime("");

        alert(
          `Appointment booked with ${selectedDoctor} on ${appointmentDate} at ${appointmentTime}`
        );
      } catch (error) {
        console.error("Failed to book appointment:", error);
        alert("Failed to book appointment. Please try again.");
      }
    } else {
      alert("Please select a doctor, date, and time.");
    }
  };

  return (
    <div className="bg-background px-6 py-6 flex flex-col">
      {/* Appointment Booking Form */}
      <div className="flex gap-6">
        <div className="w-full max-w-lg max-h-fit bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Book an Appointment
          </h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Select Doctor:</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="">-- Select a Doctor --</option>
                {availableDoctors.map((doctor, index) => (
                  <option key={index} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Select Date:</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Select Time:</label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">
                What's the reason?
              </label>
              <input
                type="text"
                value={givenReason}
                onChange={(e) => setGivenReason(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold"
            >
              Book Appointment
            </button>
          </form>
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Help</h3>
            <div className="flex gap-5">
              <div className="flex gap-4 items-center">
                <span className="inline-block h-4 w-4 text-sm rounded-full text-white bg-green-500"></span>
                <p>Completed</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="inline-block h-4 w-4 text-sm rounded-full text-white bg-yellow-500"></span>
                <p>Today</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="inline-block h-4 w-4 text-sm rounded-full text-white bg-blue-500"></span>
                <p>Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Status */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-text mb-4">
            Appointment Status
          </h2>
          <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow ">
            {loading ? (
              <p className="appointment_loader"></p>
            ) : (
              <ul className="space-y-4 ">
                {appointments.length === 0 ? (
                  <p className="text-background">There are no appointments.</p>
                ) : (
                  appointments.map((appointment, index) => (
                    <li
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                    >
                      <h3 className="text-lg font-medium text-gray-800 flex gap-2 items-center">
                        {appointment.doctor}
                        <span
                          className={`inline-block h-2 w-2 text-sm rounded-full text-white ${
                            appointment.status === "Completed"
                              ? "bg-green-500"
                              : appointment.status === "Today"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                      </h3>
                      <p className="text-gray-600">
                        <strong>Date:</strong>{" "}
                        {formatDateToLongFormat(appointment.date)} <br />
                        <strong>Time:</strong>{" "}
                        {convertTo12HourTime(appointment.time)}
                      </p>

                      <p>
                        <strong>Reason:</strong>
                        {appointment.reason}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
