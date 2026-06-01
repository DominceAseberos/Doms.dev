# AI Workflow: Adding New Projects

This document serves as the standard operating procedure for AI agents (and human developers) when adding a new project to the Doms.dev portfolio.

## Step 1: Automated Asset Capture

We use a custom Puppeteer script to capture responsive screenshots (Desktop, Tablet, Mobile) of the live project.

**Prerequisites:**
Ensure the target project is deployed or running locally. 

**Run the Script:**
Execute the following command from the root of the `Doms.dev` repository:

```bash
node scripts/capture-project.js --url "<LIVE_OR_LOCAL_URL>" --path "<ABSOLUTE_PATH_TO_LOCAL_PROJECT>" --slug "<PROJECT_SLUG>"
```

*Example:*
```bash
node scripts/capture-project.js --url "https://fashion-shop-six-eta.vercel.app" --path "/mnt/datadrive/Project/fashion" --slug "fashion"
```

**What the script does:**
1. Creates the upload directory: `public/assets/uploads/project-<slug>/imgs/`
2. Takes sequential WebP screenshots of various sections across Desktop, Tablet, and Mobile.
3. Parses the local `README.md` and `package.json` (if path provided) to generate initial metadata.
4. Prepends the metadata object into `src/data/portfolioData.json`.

## Step 2: Manual Data Refinement

The automated script provides a solid structural foundation, but the JSON entry in `src/data/portfolioData.json` must be manually refined to match the portfolio's high-end editorial standard.

1. **Locate the Entry**: Find the newly added object at the top of the `projects` array in `portfolioData.json`.
2. **Refine `shortDescription`**: Rewrite the description to be impactful and technical.
3. **Expand `contentSections`**: Ensure the following sections are detailed:
   - **Overview**: A broad summary of the problem/solution.
   - **Architecture**: A breakdown of the Tech Stack (chips) and Engineering Decisions (list).
   - **Design System**: Define the Color Palette and Typography choices.
   - **Features**: Highlight 2-3 core features.
4. **Update Proof Points**: Add 3 core proof points relevant to the project (e.g., Accuracy, Performance, Frameworks).

## Step 3: Creating the Documentation

Every project in the portfolio MUST belong to one of three **Documentation Archetypes**. Choose the archetype that fits the project category and write the corresponding markdown/PDF document.

### Archetype 1: The AI Prototype (Frontend / Visual)
**Categories:** `LANDING PAGE`, `DATA VISUALIZATION`
**Document:** `skills.md` (The AI Directive)

This document is a **Master System Prompt** designed to instruct an AI exactly how to build the UI prototype without hallucinating. It MUST follow this exact XML structure:

<details>
<summary>View skills.md XML Blueprint</summary>

```xml
# AI Directive: [Project Name]

<identity>Define the AI persona (e.g., "Expert WebGL Developer").</identity>
<objective>Define the core vibe and aesthetic goal of the project.</objective>
<architecture>Define the Framework and Styling constraints.</architecture>
<engineering_standards>Enforce SOLID principles, 60fps rules, and variable naming.</engineering_standards>
<dom_layout_blueprint>Explicitly map out the exact DOM hierarchy section-by-section.</dom_layout_blueprint>
<responsive_adaptations>Define exact breakpoints and degradation rules.</responsive_adaptations>
<design_system>Define precise Colors, Fonts, and component rules.</design_system>
<motion_and_interaction>Detail GSAP/Lenis physics and scroll triggers.</motion_and_interaction>
<execution_strategy>Define iterative phases and command the AI to wait for approval between phases.</execution_strategy>
<critical_rules>List 3 hard boundaries the AI must never cross.</critical_rules>
```
</details>

### Archetype 2: The Engineered System (Backend / Full-Stack)
**Categories:** `WEB APPLICATION`, `FULL-STACK APPLICATION`, `MOBILE APPLICATION`
**Document:** `architecture.md` (System Architecture Document)

**Mandatory AI Instruction:** Before writing this document, the AI Agent MUST use its tools to navigate into the project's local directory and read the actual source code (e.g., `package.json`, database schemas, routing logic, and state management files). Do not hallucinate the architecture; extract it directly from the codebase.

This document proves systems-level thinking for Senior Engineers and Tech Leads. Focus on the *why* rather than the *how*.

<details>
<summary>View architecture.md Blueprint</summary>

```markdown
# System Architecture: [Project Name]

## 1. High-Level Architecture
Explain the Client -> Server -> Database flow. Include a mermaid diagram if possible.

## 2. Tech Stack & Trade-offs
List the core technologies and *defend* the choices. (e.g., "Why PostgreSQL over MongoDB for this specific use case?")

## 3. State Management & Security
Explain the authentication flow, JWT handling, and how complex state is managed across the client.

## 4. Core Business Logic
A deep-dive into the most complex feature or algorithm written for the app.

## 5. Deployment & CI/CD
Explain how the system is hosted, scaled, and deployed.
```
</details>

### Archetype 3: The Academic Case Study (Data / Research)
**Categories:** `MACHINE LEARNING`, `CASE STUDY`
**Document:** `case-study.pdf` or `case-study.md` (Research Case Study)

**Mandatory AI Instruction:** Before writing this document, the AI Agent MUST use its tools to read the actual project codebase (e.g., Python scripts, Jupyter notebooks, model evaluation scripts). The AI must extract real metrics, accuracy scores, algorithms used, and engineering bottlenecks directly from the source code. Do not invent metrics.

This document proves analytical and problem-solving skills for Data Scientists and Product Managers. It should be formatted like an academic or professional whitepaper.

<details>
<summary>View case-study.md Blueprint</summary>

```markdown
# Research Case Study: [Project Name]

## 1. Statement of the Problem
What is the real-world issue being solved?

## 2. The Goal
What is the desired outcome or hypothesis?

## 3. Data Pipeline & Preprocessing
Where was the dataset sourced? How was it cleaned and prepared?

## 4. The Solution & Model Architecture
What algorithm/model was chosen (e.g., CNN, Random Forest) and why?

## 5. Engineering Challenges
What bottlenecks occurred during training or inference? (e.g., Overfitting).

## 6. Performance Metrics
A breakdown of the true metrics generated directly from reading the codebase (e.g., Accuracy graphs, F1 Scores, Inference Speed).

## 7. Conclusion
Final explanation of the results.
```
</details>

*Note on PDFs:* If you choose to write Archetype 2 or 3 as a formal `.pdf` or `.docx` file instead of Markdown, simply place the file in `public/assets/docs/` and link it. The portfolio's `DocViewerModal` natively supports rendering PDFs and Word docs inline!

After creating the appropriate document, ensure the `primaryBtnUrl` in `portfolioData.json` points to it (e.g., `/assets/docs/banana-leaf.pdf` or `/vayora-skills.md`).

## Step 4: Verification

1. Start the local dev server: `npm run dev`
2. Navigate to the Home page and ensure the new project card loads the `mainImage` correctly.
3. Open the project's Case Study modal and verify all text, layout columns, and gallery images render seamlessly without console errors.
4. Click the "Skills.md" button in the modal header to verify the AI Directive renders correctly.
