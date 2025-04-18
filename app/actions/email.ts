'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, 'Ime mora imati najmanje 2 znaka'),
  lastName: z.string().min(2, 'Prezime mora imati najmanje 2 znaka'),
  email: z.string().email('Unesite valjanu email adresu'),
  subject: z.string().min(2, 'Naslov mora imati najmanje 2 znaka'),
  message: z.string().min(10, 'Poruka mora imati najmanje 10 znakova'),
  date: z.string().optional(),
  time: z.string().optional(),
});

// Email configuration from environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

type FormData = z.infer<typeof formSchema>;

export async function sendContactEmail(formData: FormData) {
  try {
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      return {
        success: false,
        message: 'Validacija forme nije uspjela',
        errors: result.error.format(),
      };
    }

    const data = result.data;

    // Format date and time if provided
    let dateTimeInfo = '';
    if (data.date && data.time) {
      dateTimeInfo = `\nŽeljeni termin: ${data.date} u ${data.time}`;
    }

    // Configure email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: `Kontakt forma: ${data.subject}`,
      text: `Ime: ${data.firstName} ${data.lastName}
Email: ${data.email}${dateTimeInfo}

Poruka:
${data.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #b45309; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Nova poruka s kontakt forme</h2>
          <p><strong>Ime i prezime:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${dateTimeInfo ? `<p><strong>Željeni termin:</strong> ${data.date} u ${data.time}</p>` : ''}
          <p><strong>Naslov:</strong> ${data.subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #4b5563;">Poruka:</h3>
            <p style="white-space: pre-line;">${data.message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center;">
            Poruka poslana putem web stranice Zlatarna Popović na ${new Date().toLocaleString('hr-HR')}
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Poruka je uspješno poslana! Hvala na kontaktu.',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Došlo je do pogreške prilikom slanja poruke. Molimo pokušajte kasnije.',
    };
  }
}
