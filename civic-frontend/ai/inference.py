import sys
import os
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

print("🔥 inference.py started", file=sys.stderr)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "civic_issue_classifier.h5")

try:
    model = load_model(MODEL_PATH)
    class_names = ['garbage', 'pothole']  # Replace with your actual classes

    def predict(img_path):
        print(f"📸 Received image path: {img_path}", file=sys.stderr)
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        prediction = model.predict(img_array)
        predicted_index = np.argmax(prediction)
        predicted_class = class_names[predicted_index]
        confidence = float(np.max(prediction))
        return predicted_class, confidence

    if __name__ == "__main__":
        if len(sys.argv) < 2:
            print("❌ No image path provided", file=sys.stderr)
            sys.exit(1)

        image_path = sys.argv[1]
        issue_type, confidence = predict(image_path)
        print(f"{issue_type},{confidence}")  # This is captured by Node.js

except Exception as e:
    print(f"🔥 Python Exception: {e}", file=sys.stderr)
    sys.exit(1)
