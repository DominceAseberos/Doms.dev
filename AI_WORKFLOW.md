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

## Step 3: Creating the AI Directive (`skills.md`)

For every new project, a specific `skills.md` must be created in the `public/` directory (e.g., `public/<slug>-skills.md`). This document is not a generic article; it is a **Master System Prompt** designed to instruct an AI exactly how to build the project without hallucinating.

It MUST follow this exact XML structure:

```markdown
# AI Directive: [Project Name]

<identity>
Define the AI persona (e.g., "Expert WebGL Developer" or "Component Architect").
</identity>

<objective>
Define the core vibe and aesthetic goal of the project.
</objective>

<architecture>
Define the Framework (React, Vite) and Styling (BEM, Tailwind, Vanilla CSS).
</architecture>

<engineering_standards>
Enforce SOLID principles, 60fps optimization rules (only animating transform/opacity), variable naming consistency, and simplicity over complexity.
</engineering_standards>

<dom_layout_blueprint>
Explicitly map out the exact DOM hierarchy section-by-section to prevent the AI from inventing a generic layout.
</dom_layout_blueprint>

<responsive_adaptations>
Define exact breakpoints and how complex elements (like grids or GSAP pins) must gracefully degrade on mobile.
</responsive_adaptations>

<design_system>
Define precise Color Hex codes, Font Families, and component rules (e.g., "no borders, sharp corners").
</design_system>

<motion_and_interaction>
Detail the specific GSAP/Lenis physics, scroll triggers, and tactile hover states.
</motion_and_interaction>

<execution_strategy>
To prevent token-limit truncation, command the AI to build iteratively. Define 3-4 phases and explicitly state: "Stop and wait for user approval before proceeding to the next phase."
</execution_strategy>

<critical_rules>
List 3 hard boundaries the AI must never cross (e.g., "Never use global CSS", "Always use useGSAP for cleanup").
</critical_rules>
```

After creating this file, ensure the `primaryBtnUrl` in `portfolioData.json` points to it (e.g., `/<slug>-skills.md`).

## Step 4: Verification

1. Start the local dev server: `npm run dev`
2. Navigate to the Home page and ensure the new project card loads the `mainImage` correctly.
3. Open the project's Case Study modal and verify all text, layout columns, and gallery images render seamlessly without console errors.
4. Click the "Skills.md" button in the modal header to verify the AI Directive renders correctly.
