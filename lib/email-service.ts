import { EmailLog } from "./types";

export interface EmailTemplatePayload {
  recipientName: string;
  patientName: string;
  medicationName?: string;
  dosage?: string;
  scheduledTime?: string;
  doctorName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  clinic?: string;
  notes?: string;
  adherencePercentage?: number;
}

export function generateMissedDoseEmail(payload: EmailTemplatePayload): { subject: string; html: string } {
  const subject = `⚠️ Alert: Missed Medication - ${payload.medicationName} for ${payload.patientName}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; color: #1E293B;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-top: 6px solid #EF4444;">
          <div style="padding: 24px; background: #FEF2F2; border-bottom: 1px solid #FEE2E2;">
            <div style="font-size: 13px; font-weight: 700; color: #DC2626; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">High Priority Caretaker Alert</div>
            <h1 style="margin: 0; font-size: 22px; color: #991B1B;">Missed Medication Dose</h1>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hello ${payload.recipientName},</p>
            <p style="font-size: 15px; line-height: 1.6; color: #334155;">
              This proactive alert is to inform you that <strong>${payload.patientName}</strong> has not logged their scheduled dose of <strong>${payload.medicationName} (${payload.dosage})</strong> scheduled for <strong>${payload.scheduledTime}</strong>.
            </p>
            <div style="background: #F1F5F9; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Medication:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0F172A;">${payload.medicationName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Dosage:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0F172A;">${payload.dosage}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Scheduled Time:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #DC2626;">${payload.scheduledTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Status:</td>
                  <td style="padding: 6px 0; font-weight: 700; color: #DC2626;">Overdue / Unconfirmed</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              <strong>Recommended Action:</strong> Please phone or visit ${payload.patientName} to ensure they take their medication safely with appropriate meals or liquids.
            </p>
          </div>
          <div style="background: #F8FAFC; padding: 16px 24px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8; text-align: center;">
            SilverCare AI Healthcare Ecosystem • Proactive Elderly Care & Medication Assurance
          </div>
        </div>
      </body>
    </html>
  `;
  return { subject, html };
}

export function generateAppointmentEmail(payload: EmailTemplatePayload): { subject: string; html: string } {
  const subject = `🩺 Reminder: Upcoming Doctor Appointment with ${payload.doctorName}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; color: #1E293B;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-top: 6px solid #2563EB;">
          <div style="padding: 24px; background: #EFF6FF; border-bottom: 1px solid #DBEAFE;">
            <div style="font-size: 13px; font-weight: 700; color: #2563EB; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Medical Appointment Schedule</div>
            <h1 style="margin: 0; font-size: 22px; color: #1E40AF;">Upcoming Doctor Visit</h1>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hello ${payload.recipientName},</p>
            <p style="font-size: 15px; line-height: 1.6; color: #334155;">
              This is a reminder for <strong>${payload.patientName}</strong>'s upcoming medical consultation.
            </p>
            <div style="background: #F1F5F9; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Doctor:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0F172A;">${payload.doctorName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Date & Time:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #2563EB;">${payload.appointmentDate} at ${payload.appointmentTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Clinic:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #0F172A;">${payload.clinic}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Clinical Notes:</td>
                  <td style="padding: 6px 0; color: #334155;">${payload.notes || "Standard periodic review"}</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Please make sure transportation is arranged and necessary medical reports or medication lists are brought along.
            </p>
          </div>
          <div style="background: #F8FAFC; padding: 16px 24px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8; text-align: center;">
            SilverCare AI Healthcare Ecosystem • Proactive Elderly Care
          </div>
        </div>
      </body>
    </html>
  `;
  return { subject, html };
}

export function generateDailyDigestEmail(payload: EmailTemplatePayload): { subject: string; html: string } {
  const subject = `📊 Daily Care Digest: ${payload.adherencePercentage}% Medication Adherence for ${payload.patientName}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; color: #1E293B;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-top: 6px solid #10B981;">
          <div style="padding: 24px; background: #ECFDF5; border-bottom: 1px solid #D1FAE5;">
            <div style="font-size: 13px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Family Caregiver Summary</div>
            <h1 style="margin: 0; font-size: 22px; color: #065F46;">Daily Adherence & Wellness Digest</h1>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hello ${payload.recipientName},</p>
            <p style="font-size: 15px; line-height: 1.6; color: #334155;">
              Here is the care summary for <strong>${payload.patientName}</strong> over the past 24 hours.
            </p>
            <div style="text-align: center; margin: 24px 0; padding: 20px; background: #F8FAFC; border-radius: 12px;">
              <div style="font-size: 42px; font-weight: 800; color: #059669;">${payload.adherencePercentage}%</div>
              <div style="font-size: 14px; font-weight: 600; color: #64748B; margin-top: 4px;">Daily Medication Adherence Rate</div>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Routine health tasks and morning/afternoon doses have been verified. Next upcoming doctor appointment is in 5 days.
            </p>
          </div>
          <div style="background: #F8FAFC; padding: 16px 24px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8; text-align: center;">
            SilverCare AI Healthcare Ecosystem • Empowering Care Circles
          </div>
        </div>
      </body>
    </html>
  `;
  return { subject, html };
}
