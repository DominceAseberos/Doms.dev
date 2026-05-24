# 🌐 Multilingual Topic & Language Classifier

This project is a specialized Natural Language Processing (NLP) application focused on handling complex multilingual environments—specifically English, Tagalog, and Cebuano. It combines language identification with advanced topic modeling to classify unstructured text accurately.

### 🧠 Concept & Purpose

In environments where multiple dialects and languages are mixed (code-switching), standard NLP models often struggle. The goal of this project was to build a robust pipeline that can detect the primary language of an input string and then intelligently extract its core topics using context-aware embeddings.

### 🛠 Tech Stack

- **Backend / API**: **Python** running on a **FastAPI** server.
- **Machine Learning**: 
  - **BERTopic** for dynamic, transformer-based topic extraction.
  - **BART-Large-MNLI** for zero-shot text classification.
  - **Scikit-Learn** (Logistic Regression & LDA) for lightweight baseline models and language detection.
- **Frontend**: A clean, vanilla HTML/JS interface for testing the model endpoints in real-time.

### ✨ Key Features

- **Multi-Model Topic Extraction**: Users can compare results between a lightweight LDA baseline, an English-only BERTopic model, a bilingual (EN + TL) model, and a full Trilingual (EN + TL + Cebuano) model.
- **Language Detection**: A custom-trained Logistic Regression model that instantly identifies the language of the input text before routing it to the appropriate topic model.
- **Zero-Shot Classification**: Integration of BART-Large to classify text into unseen categories without requiring specific training data.
