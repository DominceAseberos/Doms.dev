# Research Case Study: Banana Leaf Disease Detector

## 1. Statement of the Problem
Agricultural diseases, particularly those affecting banana plants, can devastate crop yields if not identified and managed early. Detecting these diseases visually requires agricultural expertise that is not always immediately available to farmers. Traditional diagnostic methods are manual, time-consuming, and prone to human error.

## 2. The Goal
The objective is to engineer an accessible, web-based Machine Learning application capable of accurately classifying images into three categories: **Healthy Leaf**, **Unhealthy Leaf**, and **Non-Leaf**. Furthermore, the system must not be static; it requires an **Active Learning** feedback loop that allows the model to continuously learn and improve its accuracy based on real-time user corrections.

## 3. Data Pipeline & Preprocessing
The model does not simply analyze raw pixels. A robust Computer Vision pipeline extracts **59 unique mathematical features** from each uploaded image to ensure high-dimensional accuracy:

*   **Color Analysis (HSV, LAB, Grayscale):** Means, standard deviations, and hue histograms are calculated to mathematically detect discoloration and necrosis.
*   **Texture Analysis (GLCM, LBP):** Gray-Level Co-occurrence Matrices and Local Binary Patterns measure contrast and homogeneity to spot fungal growth textures.
*   **Shape Metrics:** Area, perimeter, and circularity constraints distinguish actual leaves from background noise or unrelated objects.
*   **HOG (Histogram of Oriented Gradients):** Captures edge structures and structural integrity.

*Data Balancing:* To prevent model bias, the dataset is dynamically balanced during training by downsampling the majority `Non-Leaf` class to match the minority classes using `sklearn.utils.resample`.

## 4. The Solution & Model Architecture
The core classification engine utilizes a **K-Nearest Neighbors (KNN)** algorithm (`KNeighborsClassifier`).

*   **Why KNN?** KNN was selected for its non-parametric nature, making it highly effective for complex, non-linear biological data boundaries. It is also computationally lightweight enough to allow for rapid, on-the-fly retraining during Active Learning.
*   **Hyperparameter Tuning:** The model is optimized using `GridSearchCV` across a 5-fold cross-validation split, testing multiple configurations:
    *   `n_neighbors`: [5, 7, 9, 11]
    *   `weights`: ['uniform', 'distance']
    *   `p`: [1 (Manhattan), 2 (Euclidean)]
*   **Normalization:** All 59 features are scaled using `MinMaxScaler` to prevent high-variance features (like area) from dominating the distance calculations.

## 5. Engineering Challenges: Active Learning Implementation
The most significant engineering bottleneck was implementing the **Active Learning Loop**. 
Standard models are trained once and deployed. This system required a persistent architecture:
1.  When an image is processed, the 59 extracted features are temporarily held in state.
2.  If the user flags the prediction as incorrect (Thumbs Down), they select the true label.
3.  The Flask backend interfaces with **Firebase Firestore** to securely log the feature array and the corrected label.
4.  This newly validated data is immediately appended to the training dataset, and the model is seamlessly retrained in the background, instantly improving future inference.

## 6. Performance Metrics
The system is rigorously evaluated using an 80/20 train-test split (`test_size=0.2`). 

*   **Validation:** Performance is verified using `accuracy_score` and a detailed `classification_report` to track precision, recall, and f1-score across all three classes.
*   **Confusion Matrix:** A Seaborn/Matplotlib confusion matrix is automatically generated during every training cycle to monitor false positives (e.g., classifying a healthy leaf as unhealthy).

## 7. Conclusion
The Banana Leaf Disease Detector successfully bridges the gap between agricultural needs and machine learning. By utilizing a highly specific 59-feature extraction pipeline combined with a scalable KNN architecture and Firebase-backed Active Learning, the system provides a robust, continuously improving diagnostic tool.
