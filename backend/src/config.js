import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET,
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || "http://localhost:5000/predict"
};
