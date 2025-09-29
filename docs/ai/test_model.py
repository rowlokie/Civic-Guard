import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# ✅ Load the trained model
model = load_model("model/civic_issue_classifier.h5")

# ✅ Define the class labels (must match training order)
class_names = ['garbage', 'pothole']  # Add more if you trained more classes

# ✅ Load and preprocess an image
img_path = r"C:\Users\Piyush\Desktop\civicguard\ai\dataset\val\Garbage classification\cardboard3.jpg"  # Replace with your own image path
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array /= 255.0  # Normalize pixel values (same as during training)

# ✅ Predict the class
predictions = model.predict(img_array)
predicted_index = np.argmax(predictions)
predicted_class = class_names[predicted_index]

# ✅ Output the result
print(f"🧠 Predicted Class: {predicted_class}")
