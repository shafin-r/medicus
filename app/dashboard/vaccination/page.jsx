"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Query } from "appwrite";
import { account, databases } from "@/app/appwrite";

const Vaccination = () => {
  const [vaccinationAppointments, setVaccinationAppointments] = useState([]);
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const currentDate = new Date();

  useEffect(() => {
    // Replace with your project ID

    // Fetch the logged-in user
    account.get().then(
      (response) => setUserId(response.$id),
      (error) => console.error("Error fetching user", error)
    );

    // Mock data for available vaccines
    setAvailableVaccines([
      "COVID-19",
      "Hepatitis B",
      "Influenza",
      "Tetanus",
      "HPV",
    ]);

    // Fetch vaccination appointments from Appwrite
    // if (userId) {
    //   databases
    //     .listDocuments("6787fd2600013521f403", "6788b7a000141e12c10d", [
    //       Query.equal("userId", userId),
    //     ])
    //     .then(
    //       (response) => setVaccinationAppointments(response.documents),
    //       (error) => console.error("Error fetching appointments", error)
    //     );
    // }

    async function fetchVaccines() {
      if (!userId) return;

      try {
        const response = await databases.listDocuments(
          "6787fd2600013521f403",
          "6788b7a000141e12c10d",
          [Query.equal("userId", userId)]
        );
        if (response.documents) {
          setLoading(false);
          setVaccinationAppointments(response.documents);
        }
      } catch (error) {
        console.error("Failed to fetch vaccinations: ", error);
      }
    }

    fetchVaccines();
  }, [userId]);

  // Update statuses based on current date
  const updatedAppointments = useMemo(() => {
    return vaccinationAppointments.map((appointment) => {
      const appointmentDate = new Date(
        `${appointment.date}T${appointment.time}`
      );
      return {
        ...appointment,
        status:
          appointmentDate < currentDate
            ? "Taken"
            : appointmentDate.toDateString() === currentDate.toDateString()
            ? "Today"
            : "Upcoming",
      };
    });
  }, [vaccinationAppointments, currentDate]);

  // Handle Booking
  const handleBooking = async (e) => {
    e.preventDefault();

    if (selectedVaccine && appointmentDate && appointmentTime) {
      try {
        const appointment = {
          userId,
          vaccineName: selectedVaccine,
          date: appointmentDate,
          time: appointmentTime,
        };

        // Save the appointment in Appwrite
        const response = await databases.createDocument(
          "6787fd2600013521f403",
          "6788b7a000141e12c10d",
          "unique()", // Auto-generate document ID
          appointment
        );

        // Add to local state
        setVaccinationAppointments([...vaccinationAppointments, response]);

        // Reset form
        setSelectedVaccine("");
        setAppointmentDate("");
        setAppointmentTime("");

        alert("Vaccination appointment booked successfully!");
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("Failed to book appointment. Please try again.");
      }
    } else {
      alert("Please select a vaccine, date, and time.");
    }
  };

  return (
    <div className="bg-background px-6 py-6 flex flex-col min-w-96">
      <h1 className="text-3xl font-bold text-text mb-6">Vaccination</h1>

      {/* Vaccination Booking Form */}
      <div className="flex gap-6">
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Book a Vaccination Appointment
          </h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">
                Select Vaccine:
              </label>
              <select
                value={selectedVaccine}
                onChange={(e) => setSelectedVaccine(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="">-- Select a Vaccine --</option>
                {availableVaccines.map((vaccine, index) => (
                  <option key={index} value={vaccine}>
                    {vaccine}
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

        {/* Vaccination Status */}
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Vaccination Status
          </h2>
          {loading ? (
            <p className="appointment_loader"></p>
          ) : (
            <ul className="space-y-4">
              {vaccinationAppointments.length === 0 ? (
                <p className="text-background">There are no vaccinations.</p>
              ) : (
                vaccinationAppointments.map((appointment, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      {appointment.vaccineName}
                      <span
                        className={`inline-block h-2 w-2 text-sm rounded-full text-white ${
                          appointment.status === "Taken"
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
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vaccination;
