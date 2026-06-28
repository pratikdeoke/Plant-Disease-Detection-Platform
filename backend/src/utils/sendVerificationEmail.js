// import "dotenv/config";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendVerificationEmail = async (email, token) => {
//   const verifyUrl =
//     `https://plant-disease-detection-platform-ba.vercel.app/api/v1/auth/verify/${token}`;

//   console.log("VERIFY URL =", verifyUrl);

//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Verify your email",
//     html: `
//       <h2>Plant Disease Detection System</h2>
//       <p>Click below to verify your account:</p>
//       <a href="${verifyUrl}">Verify Email</a>
//     `,
//   });
// };

import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  try {
    console.log("RESEND KEY EXISTS:", !!process.env.RESEND_API_KEY);

    const verifyUrl =
      `https://plant-disease-detection-platform-ba.vercel.app/api/v1/auth/verify/${token}`;

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Plant Disease Detection System</h2>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });

    console.log("RESEND RESULT:", JSON.stringify(result, null, 2));

  } catch (err) {
    console.error("RESEND ERROR:", err);
    throw err;
  }
};