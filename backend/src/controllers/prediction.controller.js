import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { pool } from "../db.js";
import { config } from "../config.js";
import { generateUUID } from "../utils/id.js";

export const predictImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));

    const mlResponse = await axios.post(
      config.ML_SERVICE_URL,
      formData,
      { headers: formData.getHeaders() }
    );

    const { disease, confidence, model_version } = mlResponse.data;

    const predictionId = generateUUID();
    const imageUrl = `/uploads/${req.file.filename}`;

    await pool.query(
      `INSERT INTO predictions (id, user_id, image_url, disease, confidence, model_version)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [predictionId, userId, imageUrl, disease, confidence, model_version]
    );

    res.json({
      disease,
      confidence,
      model_version,
      image_url: imageUrl
    });

  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ message: "Prediction failed" });
  }
};

export const getMyPredictions = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM predictions 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPredictions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT predictions.*, users.name, users.email
       FROM predictions
       JOIN users ON users.id = predictions.user_id
       ORDER BY predictions.created_at DESC`
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
