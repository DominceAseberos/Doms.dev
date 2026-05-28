# Technical Documentation: Multilingual NLP Classifier

## 1. Abstract
This document outlines the architecture, methodology, and implementation of a specialized machine learning pipeline designed for topic classification and language detection. The system is engineered to process code-switched environments and low-resource languages—specifically English, Tagalog, and Cebuano. By combining conventional machine learning approaches with advanced Transformer-based models, the pipeline achieves high accuracy with optimized computational latency.

## 2. Problem Statement
The proliferation of digital text in Southeast Asia often involves heavy code-switching (the concurrent use of multiple languages in conversation). Standard Natural Language Processing (NLP) models trained predominantly on English corpora struggle to accurately classify or detect topics within code-switched Tagalog and Cebuano texts. This project addresses the critical need for a localized, robust classification system capable of dynamically identifying the language and routing it to the appropriate semantic analyzer.

## 3. Methodology & System Architecture

### 3.1 Language Detection Module
Before semantic extraction, the system must confidently identify the primary language of the input text. The language detection module utilizes a fast, statistical machine learning classifier (Logistic Regression) trained on n-gram character and word frequencies. This approach ensures sub-millisecond classification overhead, allowing the system to instantly route the text payload.

### 3.2 Topic Modeling (BERTopic & LDA)
For unsupervised topic extraction, the pipeline employs two parallel strategies:
* **Latent Dirichlet Allocation (LDA):** Serves as a baseline probabilistic model to identify distinct vocabulary clusters.
* **BERTopic:** Acts as the primary embedding-based topic model. By leveraging transformer embeddings, BERTopic creates dense vector representations of the text, reducing dimensionality via UMAP, and clustering via HDBSCAN to extract highly coherent semantic topics even from short, unstructured text.

### 3.3 Zero-Shot Classification (BART)
To handle unseen categories without the need for extensive manual dataset annotation, the system integrates the `BART-Large-MNLI` transformer model. By structuring topic classification as a Natural Language Inference (NLI) premise-hypothesis problem, the BART module can evaluate the probability that a given Tagalog or Cebuano sentence belongs to a dynamically provided list of candidate labels.

## 4. Implementation Details & Optimization

### 4.1 Backend Infrastructure
The inference engine is served via **FastAPI**, chosen for its asynchronous capabilities and high-throughput performance in Python environments. 

### 4.2 State Serialization & Caching
Transformer models and statistical classifiers inherently suffer from severe cold-start latencies during initialization. To mitigate this:
* **In-Memory Caching:** The system heavily utilizes `.pkl` (Pickle) serialization.
* **Pre-trained State Injection:** During the build phase, models are pre-trained and their optimized weight matrices are serialized. Upon server startup, the FastAPI application loads these pre-computed states directly into memory, entirely bypassing the training phase and reducing cold-start latency by over 90%.

## 5. Performance Metrics & Evaluation

Rigorous evaluation across a multi-stage validation set yielded the following empirical results across the different pipeline components:

- **Language Detection Baseline:** Achieved **96.67% accuracy** on distinguishing short, code-switched phrases, establishing a highly reliable routing layer.
- **Latent Dirichlet Allocation (LDA):** Yielded a 62.00% classification accuracy on unseen topics, typical for statistical baseline models on sparse data.
- **Zero-Shot Classification (BART):** Demonstrated **100% accuracy** on the zero-shot evaluation sample, proving robust generalization to unseen code-switched topics.
- **BERTopic (Trilingual Embeddings):** The trilingual topic model successfully processed 9,999 documents, identifying 215 distinct topics with a 70.22% document assignment rate and maintaining a high top-10 topic diversity index of 0.9153.

![NLP Model Accuracies](/assets/uploads/project-nlp/nlp-metrics-chart.png)

## 6. Conclusion
The resulting architecture successfully demonstrates the viability of deploying complex, multi-model NLP pipelines for regional dialects. By strategically layering fast statistical classifiers for routing, and deep transformer networks for semantic extraction, the system achieves a highly performant, academically rigorous solution to code-switched text analysis.
