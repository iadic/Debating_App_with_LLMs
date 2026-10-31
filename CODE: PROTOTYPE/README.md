This project implements a multimodal AI debate application with a Python backend and a REACT frontend. Follow the steps below to run the system locally.

SETUP INSTRUCTIONS:

1) Create a Conda Virtual Environment

Run:

conda create -n debate-app python=3.10

2) Activate the Virtual Environment

Run:

conda activate debate-app

3) Install Python Dependencies

From the root project directory, run:

pip install -r requirements.txt

4) RUNNING THE BACKEND

Navigate to the Backend Folder: 1) cd backend 2) python main.py

The backend server should now be running locally.

RUNNING THE FRONTEND

5) Open a New Terminal Window

In a separate terminal, navigate to the root directory (if needed) and run:

npm install
npm run dev

Open the Application

After running "npm run dev", a local development link will appear in the terminal (for example: http://localhost:5173
).

Open this link in your browser to access the application.

ENVIRONMENT VARIABLES

The project includes a .env file which is currently empty.

You must add your own API keys before running the system.

Note: This project uses a Gemini API key. Ensure it is added to the .env file.

ADDITIONAL FILES

llm_judge_paragraph_results.json
Contains the LLM-as-a-judge evaluation results and paragraph scores used in the analysis.

NOTES: ensure both backend and frontend servers are running at the same time.

If ports are already in use, you may need to stop other local servers.

Recommended Python version: 3.10.