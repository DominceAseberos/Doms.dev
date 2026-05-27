## ⚙️ High-Level Engineering Skills

Developing this multilingual NLP classifier demonstrated core competencies in data science, machine learning operations, and API development.

### 1. Natural Language Processing Pipeline
Engineered an end-to-end NLP pipeline capable of handling complex, low-resource languages (Tagalog and Cebuano). This required deep understanding of tokenization, vectorization, and embedding generation to accurately model topics and detect languages in mixed-dialect datasets.

### 2. Transformer Model Integration
Successfully integrated heavy Transformer architectures (BART-Large-MNLI and BERTopic) into a production-like environment. Managed the complexity of loading large pre-trained models into memory, utilizing zero-shot classification techniques to categorize text without the need for extensive manual labeling.

### 3. Machine Learning Operations (MLOps)
Built a system that automatically trains and caches models on startup if serialized files (`.pkl`) are missing. This significantly reduces cold-start times while ensuring the FastAPI backend can serve model predictions via REST endpoints efficiently.
