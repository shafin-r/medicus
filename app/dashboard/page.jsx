"use client";

import React, { useState, useEffect } from "react";
import { account } from "../appwrite";
import { useRouter } from "next/navigation";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPrescription } from "react-icons/fa";
import { LuSyringe } from "react-icons/lu";
import { databases } from "../appwrite";
import { Query } from "appwrite";

const Dashboard = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [vaccinationAppointments, setVaccinationAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [aptLoading, setAptLoading] = useState(true);
  const [vacLoading, setVacLoading] = useState(true);
  const [presLoading, setPresLoading] = useState(true);

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
    // Fetch appointments from Appwrite
    const fetchAppointments = async () => {
      if (!userId) return; // Wait until userId is available

      try {
        const appointmentResponse = await databases.listDocuments(
          "6787fd2600013521f403", // Replace with your database ID
          "6787fd430009a834f6ed", // Replace with your collection ID
          [Query.equal("userId", userId)] // Fetch appointments for the logged-in user
        );
        const vaccineResponse = await databases.listDocuments(
          "6787fd2600013521f403",
          "6788b7a000141e12c10d",
          [Query.equal("userId", userId)]
        );
        const prescriptionResponse = await databases.listDocuments(
          "6787fd2600013521f403", // Database ID
          "6788e143000cf7fc50d8", // Collection ID
          [Query.equal("userId", userId)]
        );
        if (appointmentResponse.documents) {
          setAptLoading(false);
          setAppointments(appointmentResponse.documents);
        }
        if (vaccineResponse.documents) {
          setVacLoading(false);
          setVaccinationAppointments(vaccineResponse.documents);
        }
        if (prescriptionResponse.documents) {
          setPresLoading(false);
          setPrescriptions(prescriptionResponse.documents);
        }
      } catch (error) {
        console.error("Failed to fetch: ", error);
      }
    };

    fetchAppointments();
  }, [userId]);

  return (
    <div className="pl-4">
      {/* <h1 className="text-3xl font-bold mb-6 text-text">
        Welcome, Shafin Rahman
      </h1> */}
      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-2xl font-semibold text-text mb-4">
            Upcoming Appointments
          </h2>
          <div className="bg-secondary p-4 rounded-lg shadow min-h-80 max-h-80 overflow-auto">
            {aptLoading ? (
              <div className="h-80 flex justify-center items-center">
                <p className="dashboard_appointment_loader"></p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-full">
                {appointments.length === 0 ? (
                  <div className="text-text">There are no appointments.</div>
                ) : (
                  appointments.map((appointment, index) => (
                    <li key={index} className="border p-2 rounded text-text">
                      <p className="text-2xl flex items-center gap-2">
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
                      </p>
                      <p className="text-md">
                        {formatDateToLongFormat(appointment.date)} -{" "}
                        {convertTo12HourTime(appointment.time)}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Vaccination Status */}
        <div className="">
          <h2 className="text-2xl font-semibold text-text mb-4">
            Vaccination Status
          </h2>
          <div className="bg-secondary p-4 rounded-lg shadow min-h-80 max-h-80 overflow-auto">
            {vacLoading ? (
              <div className="h-80 flex justify-center items-center">
                <p className="dashboard_appointment_loader"></p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-full">
                {vaccinationAppointments.length === 0 ? (
                  <div className="text-text">There are no vaccinations.</div>
                ) : (
                  vaccinationAppointments.map((appointment, index) => (
                    <li key={index} className="border p-2 rounded text-text">
                      <p className="text-2xl flex items-center gap-2">
                        {appointment.vaccineName}
                        <span
                          className={`inline-block h-2 w-2 text-sm rounded-full text-white ${
                            appointment.status === "Completed"
                              ? "bg-green-500"
                              : appointment.status === "Today"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                      </p>
                      <p>
                        {formatDateToLongFormat(appointment.date)} -{" "}
                        {convertTo12HourTime(appointment.time)}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div>
          <h2 className="text-2xl font-semibold text-text mb-4">
            Recent Prescriptions
          </h2>
          <div className="bg-secondary p-4 rounded-2xl shadow min-h-80 max-h-80 overflow-auto">
            {presLoading ? (
              <div className="h-80 flex justify-center items-center">
                <p className="dashboard_appointment_loader"></p>
              </div>
            ) : (
              <ul className="space-y-2 ">
                {prescriptions.length === 0 ? (
                  <p className="text-text">There are no prescriptions.</p>
                ) : (
                  prescriptions.map((prescription, index) => (
                    <li key={index}>
                      <h2 className="text-2xl font-semibold text-text mb-4">
                        {prescription.doctor}
                      </h2>
                      {/* Medication Grid */}
                      <div className="flex flex-col gap-3">
                        {JSON.parse(prescription.medications).map(
                          (medication, idx) => (
                            <div
                              key={idx}
                              className="border p-2 rounded text-text space-y-2"
                            >
                              <h3 className="text-2xl font-medium text-text">
                                {medication.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-3 py-1 text-sm rounded-full text-white border border-background ${
                                    medication.schedule.morning > 0
                                      ? "bg-red-500"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  Morning: {medication.schedule.morning}
                                </span>
                                <span
                                  className={`px-3 py-1 text-sm rounded-full text-background border border-background ${
                                    medication.schedule.noon > 0
                                      ? "bg-yellow-500"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  Noon: {medication.schedule.noon}
                                </span>
                                <span
                                  className={`px-3 py-1 text-sm rounded-full text-white border border-background ${
                                    medication.schedule.night > 0
                                      ? "bg-blue-500"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  Night: {medication.schedule.night}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-h-80 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold text-text mb-4">
            Quick Actions
          </h2>
          <div className="flex justify-between gap-4 h-full">
            <button
              onClick={() => router.push("/dashboard/appointment")}
              className="w-full h-full gap-4 flex flex-col items-center justify-center bg-[#517AB3] text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              <IoMdAddCircleOutline size={60} />
              Book Appointment
            </button>
            <button
              onClick={() => router.push("/dashboard/prescription")}
              className="w-full h-full gap-4 flex flex-col items-center justify-center bg-[#47A947] text-white py-2 px-4 rounded hover:bg-green-600"
            >
              <FaPrescription size={60} />
              View Prescription
            </button>
            <button
              onClick={() => router.push("/dashboard/vaccination")}
              className="w-full h-full gap-4 flex flex-col items-center justify-center bg-[#E5F5F5] text-background py-2 px-4 rounded hover:bg-slate-200"
            >
              <LuSyringe size={60} />
              Get Vaccinated
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
