# 🍌 Banana Leaf Disease Detector: Active Learning in the Field

A smart machine learning web application that detects **Healthy**, **Unhealthy**, and **Non-Leaf** images. Built to help rural farmers, it features an **Active Learning** system that continuously improves model accuracy in real-time based on user feedback.

---

## 🛑 The Problem

Traditional ML crop diagnostic tools typically rely on heavy Deep Learning models (like Convolutional Neural Networks). While powerful, these models present two major issues for rural deployment:
1. **Infrastructure Costs:** They are expensive to host and run slowly on low-bandwidth rural connections.
2. **Static Knowledge:** When deployed, models are frozen. If a farmer notices the model misclassifies a shadow as a disease, there is no way to correct it on the spot. False positives persist indefinitely until a developer manually retrains the system.

## 💡 The Decision & Engineering

To bypass the need for a heavy CNN, I architected a custom, lightweight pipeline utilizing classic Computer Vision techniques combined with a fast classifier and a closed-loop retraining system.

### Lightweight Feature Engineering
Instead of passing raw pixels to a neural network, I built an extraction engine using **OpenCV** and **Scikit-Image** to pull exactly 59 distinct features from every uploaded leaf:
*   **Color (HSV, LAB):** Hue histograms and standard deviations to detect chlorosis (yellowing).
*   **Texture (GLCM, LBP):** Contrast and Local Binary Patterns to mathematically identify fungal spot textures.
*   **Shape:** Perimeter and circularity to differentiate an actual leaf from a random object.

These 59-dimensional dense vectors are passed into a highly efficient **K-Nearest Neighbors (k=5)** classifier.

### Closed-Loop Active Learning
To solve the static knowledge problem, I built an Active Learning feedback loop:
1. If the model predicts incorrectly, the farmer taps a "Thumbs Down" and selects the correct label.
2. The application instantly appends the 59 extracted features and the corrected label to a **Firebase Firestore** database.
3. This triggers a background process that refits the local scikit-learn KNN model **in under 200ms**, seamlessly updating the prediction weights without ever taking the server offline.

## 📈 The Outcome

The engineered feature matrix allowed the lightweight KNN model to achieve a **95% model accuracy** during testing, rivaling heavier CNNs on this specific task. 

By avoiding deep learning dependencies, the active learning pipeline runs flawlessly on lightweight edge servers. The system essentially becomes a self-healing diagnostic tool—corrected predictions converge into the live model almost instantly, empowering users to teach the system on their own.

---

## 🛠️ Technology Stack

*   **Backend:** Python 3.12, Flask
*   **Database:** Firebase Firestore (Features & Feedback Logging)
*   **Machine Learning:** scikit-learn (KNN), NumPy, Pandas
*   **Computer Vision:** OpenCV, scikit-image
*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Chart.js (Analytics)

---

## 🚀 Installation & Usage

### 1. Clone the Repository
```bash
git clone https://github.com/Domincee/Banana-Leaf-Detector.git
cd Banana-Leaf-Detector
```

### 2. Set Up Environment
```bash
# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
Ensure you have your `firebase_credentials.json` configured, then run:
```bash
python app.py
```
The app will start at `http://127.0.0.1:5000`.

---

## 🪪 License

© 2025 Domince Aseberos. Released under the **MIT License**.
