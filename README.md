<div align="center">

# 🗣️ DebateAble

### A Multimodal AI Debate Partner for Building Argumentation Skills

*Practise debating by text, voice, or both, against an AI opponent that scales from gentle Socratic coach to relentless Grandmaster.*

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Demo](#-demo)
- [Features](#-features)
- [The Three Levels](#-the-three-levels)
- [Design Process](#-design-process)
- [User Study & Results](#-user-study--results)
- [Ethics, Risks & Mitigations](#%EF%B8%8F-ethics-risks--mitigations)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [LLM-as-a-Judge Evaluation](#-llm-as-a-judge-evaluation)
- [Limitations & Future Work](#-limitations--future-work)
- [References](#-references)

---

## 🎯 Overview

Debating improves critical thinking, writing quality, academic performance and confidence, yet debate clubs are often concentrated in privileged schools, leaving many students without access. Learners also commonly struggle with speaking anxiety, structuring arguments, and responding to counterarguments.

**DebateAble** explores how AI can lower these barriers by offering accessible, unlimited debate practice, while taking seriously the risks that a poorly designed system could introduce: bias, misinformation, eroded critical thinking, and reduced confidence.

The project was designed and prototyped for the *Designing AI Experiences* course and evaluated through a mixed-methods user study examining how **interaction modality** and **learning approach** shape the user experience, along with the value trade-offs and ethical concerns that emerge.

| | |
|---|---|
| **Primary users** | University students (debating, research defence, argumentative writing) |
| **Secondary stakeholders** | Lecturers, debate societies, debate coaches |
| **Tertiary stakeholders** | AI developers, university IT services |

---

## 🎬 Demo

[DebateAble demo video click here](https://youtu.be/bSeFgr7_yXE)



---

## ✨ Features

- **Three interaction modalities**
  - 💬 **Text only**: type arguments and read AI responses
  - 🎙️ **Voice only**: speak arguments and hear spoken AI rebuttals
  - 🧩 **Multimodal**: mix text, voice and file uploads, with both written and spoken AI replies
- **Three scaffolded difficulty levels** grounded in learning theory (see below)
- **Any topic you like**: from "Should billionaires exist?" to "Is the hippo the best land mammal in a fight?"
- **Character personalisation**: choose abstract avatars (Robot, Earth Person, Owl, Alien), a name, and a voice (Alloy, Shimmer, Echo) for both you and your AI partner
- **🔴 Challenge Mode**: an optional high-intensity dark interface, available only at Level 3, that reflects the high-stakes feel of a real competitive debate
- **Post-debate "flow" analysis** at the Grandmaster level

---

## 🪜 The Three Levels

The level structure is a direct translation of user values (autonomy, control, universal usability, transparency) into design requirements. It follows Vygotsky's **Zone of Proximal Development**, gradually withdrawing support as competence grows, and supports the autonomy and competence needs described by **Self-Determination Theory**.



## 🛠️ Design Process

The project followed a **Human-Centred AI** approach with elements of **participatory co-design** and **Value Sensitive Design**.

Finalised prototype interface showing various screens. Challenge mode is an optional
interface available only in level 3 (see Report for more info.):
![](Appendix:%20Exta%20info/Final%20Prototype_diagram.png)

## 📊 User Study & Results

**Participants:** 9 Cambridge students (5 male, 4 female, aged 21–24), 3 per modality condition.

**Protocol (1.5–2 hours per session)**
1. Pre-study survey and interview
2. Write an argumentative paragraph on a chosen topic (8 minutes, no external resources)
3. Use Levels 1–2 and Level 3 (10 minutes each, counterbalanced), with think-aloud notes and a survey after each
4. Post-study survey and interview
5. Revise or rewrite the original paragraph (8 minutes)

**Measures:** a 25-point argument-quality rubric based on Toulmin's model (scored blind by a human grader and an LLM judge), plus surveys adapted from the Intrinsic Motivation Inventory, NASA-TLX and SUS. Interviews were analysed with reflexive thematic analysis.

### Research Questions

- **RQ1:** How does interaction modality affect argument quality, perceived preparedness and learning, and modality preference?
- **RQ2:** How does scaffolded progression compare with a single advanced level for experience, perceived learning and cognitive demand?
- **RQ3:** What unintended risks and ethical concerns emerge when interacting with an AI debate partner?

### RQ1 · Modality

Argument quality improved after using DebateAble in **every** modality, with the largest gains for multimodal users.

| Modality | Human Pre | Human Post | **Human Δ** | LLM Pre | LLM Post | **LLM Δ** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Text | 19.3 | 22.0 | **+2.7** | 18.0 | 20.3 | **+2.3** |
| Audio | 18.7 | 22.0 | **+3.3** | 21.3 | 24.0 | **+2.7** |
| Multimodal | 16.7 | 20.7 | **+4.0** | 18.7 | 23.3 | **+4.6** |
| **Overall** | 18.2 | 21.6 | **+3.4** | 19.3 | 22.6 | **+3.3** |

<sub>Scores out of 25. With n = 3 per condition, these findings are exploratory rather than conclusive.</sub>

| Survey measure (1–5) | Text | Audio | Multimodal |
|---|:---:|:---:|:---:|
| Essay preparedness | 4.00 | 4.33 | 4.33 |
| Debate preparedness | 4.00 | 4.33 | 4.33 |
| Skills gained | 3.83 | 4.00 | **4.50** |
| Usability | 4.17 | **4.33** | 4.17 |
| Modality naturalness & preference | 3.50 | 4.00 | **4.33** |
| Social presence | 1.00 | 1.67 | 1.67 |

- Users felt better prepared for **both** written and spoken argument, regardless of modality.
- Audio and multimodal users rated their modality as more natural and preferred it more.
- Interestingly, 2 of 3 multimodal users chose **text input** because they felt uncomfortable recording audio, which highlights the value of giving users the choice.

### RQ2 · Scaffolded Levels vs Advanced Level

- Levels 1–2 produced **higher enjoyment and perceived competence**.
- Level 3 produced **higher pressure and cognitive effort**.
- Even so, **7 of 9 participants preferred Level 3**, saying the challenge drove engagement and learning. The other two preferred Level 2 for its space for reflection.
- **No one wanted a single level only**: earlier levels were seen as valuable for unfamiliar topics.

### RQ3 · Risks

- **Emotional attachment** was low, but most participants thought richer, video-based avatars could increase reliance among vulnerable users.
- **Every** participant said the system changed how they form arguments. Most changes were positive (exposure to counterarguments), but a few reconsidered their own positions, raising concerns about **subtle persuasion and belief offloading**.
- **Automation bias:** 7 of 9 reported high trust in the AI despite limited ways to verify it.
- **Privacy:** 6 of 9 raised concerns about voice data and about debate topics revealing sensitive beliefs.

### Key Takeaway

Multimodality emerged as the strongest configuration: it supports autonomy and control through optional audio input, improves accessibility in line with ability-based design, and was linked to the largest learning gains. The tension between learning effectiveness and comfort supports keeping **all three levels** so users control their own difficulty.

---

## ⚖️ Ethics, Risks & Mitigations

**Value trade-offs observed**

| Trade-off | Tension |
|---|---|
| Learning effectiveness ↔ User autonomy | Level 3 increased perceived learning but reduced comfort and control |
| Critical thinking ↔ Persuasion | Realistic counterarguments sharpen thinking but may nudge users' beliefs |
| Immersiveness ↔ Privacy | Voice adds presence and immersion but raises greater privacy concerns than text |

**Risks and proposed mitigations**

| Risk | Mitigation |
|---|---|
| Belief offloading & automation bias | Reflective prompting, multiple perspectives, explicit uncertainty signals |
| Hallucinated or biased arguments | Retrieval-based grounding with cited, linked sources |
| Normative framing (dominant debate styles; disadvantage for non-native English speakers) | Configurable debate styles and accessibility testing |

---

## 🚀 Getting Started

### Prerequisites

- [Conda](https://docs.conda.io/) (or another Python 3.10 environment)
- [Node.js](https://nodejs.org/) and npm
- A **Google Gemini API key**

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Set up the Python environment

```bash
conda create -n debate-app python=3.10
conda activate debate-app
pip install -r backend/requirements.txt
```

### 3. Add your API key

The project ships with an empty `.env` file. Add your Gemini key:

```env
GEMINI_API_KEY=your_api_key_here
```


### 4. Run the backend

```bash
cd backend
python main.py
```

### 5. Run the frontend (in a new terminal)

From the project root:

```bash
npm install
npm run dev
```

Open the local link shown in the terminal (for example, `http://localhost:5173`).

> 💡 Both the backend and frontend servers must be running at the same time. If a port is already in use, stop the other local server first.

---

## 📁 Project Structure

```
.
├── backend/
│   ├── main.py                          # Python backend server
│   ├── requirements.txt                 # Python dependencies
│   ├── LLM a judge.ipynb                # LLM-as-a-Judge scoring notebook
│   └── llm_judge_paragraph_results.json # LLM judge scores + justifications
├── src/
│   ├── app/
│   │   ├── App.tsx                      # Root React component
│   │   ├── routes.ts                    # App routing
│   │   ├── components/                  # Reusable UI components
│   │   ├── context/                     # Shared state (level, modality, characters)
│   │   └── pages/                       # Home, Levels, Setup, Debate, Personalise
│   ├── imports/                         # Imported assets
│   ├── styles/                          # Stylesheets
│   └── main.tsx                         # Frontend entry point
├── docs/                                # Report, rubric, study data, diagrams
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

### Supporting documents (`docs/`)

| File | Contents |
|---|---|
| `Report_DebateAble_App.pdf` | Full project report, including appendices (surveys, interview protocol, prototype iterations, personas) |
| `Final_Prototype_diagram.png` | Screen-flow diagram of the final prototype |
| `argument_quality_rubric_full_final_verision.pdf` | 25-point argument-quality rubric |
| `All_Essay_and_HUMAN_scores.pdf` | All pre/post paragraphs with human grader scores |
| `Paragraph_argument_Quality_Analysis.xlsx` | Human vs LLM score analysis by participant and modality |

---

## 🤖 LLM-as-a-Judge Evaluation

Every paragraph (before and after using the app) was scored blind by a human grader and by an LLM judge (**Gemini 3.0 Flash**) using the same rubric. The notebook `backend/LLM a judge.ipynb` contains the scoring pipeline, and `llm_judge_paragraph_results.json` holds each score with a written justification.

**Rubric dimensions** (each scored 1–5, total 25)

| Dimension | Question asked |
|---|---|
| Claim Clarity | Is there a clear, specific, defensible position? |
| Evidence & Support | Are claims backed by concrete reasoning, examples or data? |
| Warrant & Reasoning | Is the link between evidence and claim explicit and sound? |
| Counterargument Engagement | Is an opposing view acknowledged and meaningfully rebutted? |
| Persuasiveness & Coherence | Does the whole paragraph flow and convince a neutral reader? |

Graders scored each dimension independently, used whole numbers only, and ignored grammar and style unless they obscured the argument.

---

## 🔭 Limitations & Future Work

**Limitations**
- Small sample (n = 9) from a high-achieving academic population limits generalisability.
- LLM judges may reward argument styles that resemble their training distribution rather than stronger reasoning.
- Topic familiarity was not controlled and likely confounded learning gains between conditions.

**Future work**
- Larger samples and multiple expert human raters
- Longitudinal studies to test whether learning gains persist
- Participatory design workshops with educators, debate clubs and law programmes
- Retrieval-grounded citations, uncertainty signalling, and configurable debate styles

---

## 📚 References

Key works informing the design (full list in the report):

- Shneiderman, B. (2020). *Human-centered artificial intelligence: Reliable, safe & trustworthy.*
- Friedman, B., Kahn, P. H., & Borning, A. (2002). *Value sensitive design: Theory and methods.*
- Vygotsky, L. S. (1978). *Mind in Society.*
- Peters, D., Calvo, R. A., & Ryan, R. M. (2018). *Designing for motivation, engagement and wellbeing in digital experience.*
- Graesser, A. C. (2016). *Conversations with AutoTutor help students learn.*
- Toulmin, S. E. (1958). *The Uses of Argument.*
- Amershi, S., et al. (2019). *Guidelines for human-AI interaction.* CHI '19.
- Wobbrock, J. O., et al. (2011). *Ability-based design: Concept, principles and examples.*
- Guingrich, R. E., Mehta, D., & Bhatt, U. (2026). *Belief offloading in human-AI interaction.*

---

<div align="center">

**Thank you to all the participants for their time and thoughtful feedback.** 🙏

</div>
