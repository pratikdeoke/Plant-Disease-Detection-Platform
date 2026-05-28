from flask import Flask, request, jsonify
from PIL import Image, UnidentifiedImageError
import io

from prediction import predict_image

app = Flask(__name__)

# 5MB limit
MAX_FILE_SIZE = 5 * 1024 * 1024

# Allowed MIME types
ALLOWED_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

@app.route("/", methods=["GET"])
def home():
    return {"message": "Plant ML service is running"}


@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}

@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No image selected"}), 400

    if file.mimetype not in ALLOWED_TYPES:
        return jsonify({
            "error": "Only JPG, PNG, and WEBP images are allowed"
        }), 400

    file_bytes = file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({
            "error": "Image size must be less than 5MB"
        }), 400

    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")

    except UnidentifiedImageError:
        return jsonify({
            "error": "Invalid or corrupted image file"
        }), 400

    except Exception:
        return jsonify({
            "error": "Failed to process image"
        }), 500

    result = predict_image(image)

    return jsonify(result)


# if __name__ == "__main__":
#     app.run(debug=True, port=5000)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)