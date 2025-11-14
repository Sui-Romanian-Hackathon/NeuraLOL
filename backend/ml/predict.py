from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import sys
import hashlib

# ---------------------------------------------------------
# 1. Functie de predictie
# ---------------------------------------------------------
def predict_image(model, img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    pred = model.predict(img_array)[0][0]
    return "Garbage" if pred > 0.5 else "Clean", float(pred)

# ---------------------------------------------------------
# 2. Functie dummy de blockchain (pentru test)
# ---------------------------------------------------------
def save_to_blockchain(image_hash, result):
    print("=== Blockchain mock ===")
    print(f"Image hash: {image_hash}")
    print(f"Prediction stored: {result}")
    print("=======================")
    # aici vei pune call-ul real către Sui
    return True

# ---------------------------------------------------------
# 3. Load model
# ---------------------------------------------------------
try:
    model = load_model("garbage_detector.h5")
except Exception as e:
    print(f"Eroare la încărcarea modelului: {e}")
    sys.exit(1)

# ---------------------------------------------------------
# 4. Check image exists
# ---------------------------------------------------------
img_path = "test.jpg"
if not os.path.exists(img_path):
    print(f"Imaginea nu există: {img_path}")
    sys.exit(1)

# ---------------------------------------------------------
# 5. Predictie
# ---------------------------------------------------------
label, probability = predict_image(model, img_path)
print(f"Rezultat: {label} (prob={probability:.2f})")

# ---------------------------------------------------------
# 6. Hash imagine
# ---------------------------------------------------------
with open(img_path, "rb") as f:
    image_hash = hashlib.sha256(f.read()).hexdigest()

print(f"SHA256 imagine: {image_hash}")

# ---------------------------------------------------------
# 7. Salvare pe blockchain (mock)
# ---------------------------------------------------------
save_to_blockchain(image_hash, label)
