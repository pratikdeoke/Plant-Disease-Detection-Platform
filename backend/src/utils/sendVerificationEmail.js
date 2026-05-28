import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

console.log(process.env.FRONTEND_URL);

export const sendVerificationEmail =
  async (email, token) => {

    const verifyUrl =
      `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",

      to: email,

      subject: "Verify your email",

      html: `
        <h2>
          Plant Disease Detection System
        </h2>

        <p>
          Click below to verify your account:
        </p>

        <a href="${verifyUrl}">
          Verify Email
        </a>
      `,
    });
};