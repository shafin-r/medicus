"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/sendEmail";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount += 1;
        } else if (appointment.status === "pending") {
          acc.pendingCount += 1;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount += 1;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };
    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    // Extract necessary details from the appointment object
    const patientName = appointment.patientName;
    const patientEmail = appointment.patientEmail;
    const doctorName = appointment.primaryPhysician;
    const appointmentDate = new Date(appointment.schedule).toLocaleDateString();
    const appointmentTime = new Date(appointment.schedule).toLocaleTimeString();
    const cancellationReason = appointment.cancellationReason;

    // Prepare email content based on type
    let emailSubject = "";
    let emailText = "";

    if (type === "cancel") {
      emailSubject = "Appointment Cancelled";
      emailText = `Hi, ${patientName}, your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} has unfortunately been cancelled. Reason: ${cancellationReason}`;
    } else if (type === "schedule") {
      emailSubject = "Appointment Scheduled";
      emailText = `Hi, ${patientName}, your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} has been scheduled.`;
    }

    await sendEmail({
      to: patientEmail,
      subject: emailSubject,
      text: emailText,
    });

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};
