"use client";
import React, { useEffect, useState } from "react";
import { databases, account } from "@/app/appwrite";
import { Query } from "appwrite";

const defaultPrescriptions = [
  {
    userId: "6788dffd00842e4438a7",
    doctor: "Dr. Smith - Cardiologist",
    medications: JSON.stringify([
      {
        name: "Aspirin",
        dosage: "100mg",
        schedule: { morning: 1, noon: 0, night: 0 },
        duration: "30 days",
      },
      {
        name: "Metoprolol",
        dosage: "50mg",
        schedule: { morning: 1, noon: 1, night: 1 },
        duration: "14 days",
      },
    ]),
  },
  {
    userId: "6788dffd00842e4438a7",
    doctor: "Dr. Brown - Dentist",
    medications: JSON.stringify([
      {
        name: "Amoxicillin",
        dosage: "500mg",
        schedule: { morning: 1, noon: 1, night: 1 },
        duration: "7 days",
      },
      {
        name: "Ibuprofen",
        dosage: "200mg",
        schedule: { morning: 0, noon: 1, night: 1 },
        duration: "5 days",
      },
    ]),
  },
];

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // This will run only once when the component mounts

  // Fetch the currently logged-in user and their prescriptions
  useEffect(() => {
    const fetchUserPrescriptions = async () => {
      try {
        const user = await account.get(); // Get the logged-in user
        const userId = user.$id;
        console.log(userId);

        const response = await databases.listDocuments(
          "6787fd2600013521f403", // Database ID
          "6788e143000cf7fc50d8", // Collection ID
          [Query.equal("userId", userId)] // Filter prescriptions by userId
        );

        setPrescriptions(response.documents);
      } catch (err) {
        console.error("Failed to fetch prescriptions:", err);
        setError("Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPrescriptions();
  }, []); // Runs once when the component mounts

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-fit bg-background p-6 flex flex-col">
      <h1 className="text-4xl font-bold text-text mb-6">Prescriptions</h1>
      <div className="w-full bg-secondary p-6 rounded-lg shadow space-y-8">
        {loading ? (
          <p className="dashboard_appointment_loader"></p>
        ) : (
          <ul className="space-y-4">
            {prescriptions.length === 0 ? (
              <p className="text-text">There are no prescriptions.</p>
            ) : (
              prescriptions.map((prescription, index) => (
                <li key={index}>
                  <h2 className="text-3xl font-semibold text-text mb-4">
                    {prescription.doctor}
                  </h2>
                  {/* Medication Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {JSON.parse(prescription.medications).map(
                      (medication, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-green-900 rounded-lg shadow-sm space-y-4"
                        >
                          <h3 className="text-2xl font-medium text-text">
                            {medication.name}
                          </h3>
                          <p className="text-text mb-2">
                            <strong>Dosage:</strong> {medication.dosage}
                          </p>
                          <p className="text-text">
                            <strong>Duration:</strong> {medication.duration}
                          </p>
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
  );
};

export default PrescriptionManagement;
