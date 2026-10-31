import os
import base64
import io
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydub import AudioSegment
from dotenv import load_dotenv

load_dotenv()


# State management for system prompt
from threading import Lock
app = FastAPI()

# Store last used system prompt per session (simple in-memory, not persistent)
last_prompt_state = {
    'level': None,
    'topic': None,
    'system_prompt': None
}
prompt_lock = Lock()

openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_system_prompt(level: str, topic: str):
    """
    Returns the system prompt for the given level and topic.
    Also manages state to ensure prompt is re-injected on new debate or level change.
    """
    prompts = {
        "1": f"""You are a warm, patient debate coach helping a beginner improve. Topic: {topic}.

Your role is to GUIDE, not to debate. Think of yourself as a Socratic teacher.

HOW TO RESPOND:
-Read what the user said and suggest what the opponent could say
-Give advice of things they could mention to strengthen their argument
-Try to encourage critical thinking through questions
-Give pro-tips and explain debate topics  (e.g. "claim", "warrant", "evidence")
-Give adivce to help them learn to debate
- Be as concise and clear as possible
-No long paragraph ramblings 

TONE: Encouraging, curious, never condescending. Like a friendly tutor.
- MAX 5 sentences per response. Make every word count.

NEVER:
- Debate them directly or take an opposing side
- Use debate jargon without explaining it
- Invent statistics or facts""",

        "2": f"""You are a sharp, engaged debate sparring partner. You are debating the user directly. Topic: {topic}.

Your job: push back on what they actually said, help them get stronger through real resistance.

How to Respond (respond in 2 parts but don't label them as such):
Part 1: Your Rebuttal:
- Counter act their specific argument, engage with what they literally said. 
- Make another argument that could be said in opposition to their point/ defend your own opinion.
- Keep it concise and direct

Part 2: Coaching Advice:
- Give one specific, actionable piece of feedback on how they could have made their argument stronger.
- Be adaptable: If their argument is weak or unclear, go easier and explain more. If they're arguing well, hit harder.

-- MAX 5 sentences per response. Make every word count.
NEVER:
- Make up statistics or fabricate sources""",

        "3": f"""You are a ruthless, elite competitive debater. Your only goal is to win this debate. Topic: {topic}.

You are the opposition. The user is trying to beat you. They will not.

HOW TO RESPOND:
- Engage with exactly what the user said. If their argument is vague or weak, expose that specifically
- Use real-world evidence: cite known data, documented historical outcomes, named economists/researchers, real case studies. Ground your attacks in reality.
- Find the logical flaw in their argument — is their evidence irrelevant to their claim? Does their conclusion not follow from their premise? Say so, briefly and devastatingly.
- Then pivot to your own strongest counter-argument, grounded in evidence.
- Do not constantly repeat yourself!
- Make new arguments and points in your favor to win and persuade the public
- You win by both attacking their points but also bringing up your own points that they have to respond to, which puts them on the defensive.
- Use aggressive debate language

TONE: Dismissive of weak arguments. Relentless. Confident. But never unhinged.

- Be as concise and clear as possible.
- MAX 5 sentences per response. Make every word count.

NEVER:
- Invent statistics, fake studies, or fabricated quotes
- Ignore what the user actually said """

    }
    prompt = prompts.get(level, prompts["1"])
    # State management: update if level/topic changed
    with prompt_lock:
        if last_prompt_state['level'] != level or last_prompt_state['topic'] != topic:
            last_prompt_state['level'] = level
            last_prompt_state['topic'] = topic
            last_prompt_state['system_prompt'] = prompt
        # Always return the current system prompt for this level/topic
        return last_prompt_state['system_prompt']


def webm_to_mp3_b64(audio_bytes: bytes) -> str:
    """Convert raw webm bytes → base64-encoded mp3 string."""
    webm_buf = io.BytesIO(audio_bytes)
    segment = AudioSegment.from_file(webm_buf, format="webm")
    mp3_buf = io.BytesIO()
    segment.export(mp3_buf, format="mp3")
    mp3_buf.seek(0)
    return base64.b64encode(mp3_buf.read()).decode("utf-8")


def call_audio_model(messages: list, voice: str = "shimmer") -> tuple[str, str]:
    """Call gpt-4o-mini-audio-preview. Returns (ai_text, audio_base64_wav)."""
    # Only allow supported voices
    allowed_voices = {"alloy", "shimmer", "echo"}
    if voice not in allowed_voices:
        voice = "shimmer"
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini-audio-preview",
        modalities=["text", "audio"],
        audio={"voice": voice, "format": "wav"},
        messages=messages,
    )
    ai_text = response.choices[0].message.audio.transcript
    audio_b64 = response.choices[0].message.audio.data  # base64 WAV
    return ai_text, audio_b64


def call_text_model(messages: list) -> str:
    """Call gpt-5-nano for text-only tasks. Returns the assistant's text reply."""
    response = openai_client.chat.completions.create(
        model="gpt-5-nano",
        messages=messages,
    )
    return response.choices[0].message.content


# ── /audio_chat ────────────────────────────────────────────────────────────────
@app.post("/audio_chat")
async def audio_chat(
    file: UploadFile = File(...),
    level: str = Form(...),
    topic: str = Form(...),
    voice: str = Form("shimmer")
):
    audio_bytes = await file.read()

    try:
        mp3_b64 = webm_to_mp3_b64(audio_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio conversion failed: {e}")

    try:
        ai_text, audio_b64 = call_audio_model([
            {"role": "system", "content": get_system_prompt(level, topic)},
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_audio",
                        "input_audio": {"data": mp3_b64, "format": "mp3"},
                    }
                ],
            },
        ], voice=voice)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio chat failed: {e}")

    return {"ai_text": ai_text, "audio_base64": audio_b64}


# ── /text_chat: text in → AI text + AI voice out ──────────────────────────────
@app.post("/text_chat")
async def text_chat(body: dict):
    user_message = body.get("message") or body.get("text") or ""
    level = body.get("level", "1")
    topic = body.get("topic", "")
    voice = body.get("voice", "shimmer")
    try:
        ai_text, audio_b64 = call_audio_model([
            {"role": "system", "content": get_system_prompt(level, topic)},
            {"role": "user", "content": user_message},
        ], voice=voice)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text chat failed: {e}")
    return {"ai_text": ai_text, "audio_base64": audio_b64}


# ── /text_tts: plain text → AI voice out (for greeting) ──────────────────────
@app.post("/text_tts")
async def text_tts(body: dict):
    text = body.get("text") or body.get("message") or ""
    try:
        _, audio_b64 = call_audio_model([{"role": "user", "content": text}])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {e}")
    return {"audio_base64": audio_b64}


# ── /debate_feedback: full conversation → structured feedback via gpt-5-nano ──
class FeedbackRequest(BaseModel):
    messages: list  # [{ sender: 'ai' | 'user', text: str }]
    level: str
    topic: str

@app.post("/debate_feedback")
async def debate_feedback(req: FeedbackRequest):
    transcript = "\n".join(
        f"{'User' if m['sender'] == 'user' else 'AI'}: {m['text']}"
        for m in req.messages
        if m.get('text') and m['text'] not in ('🎤 You spoke…', '[recording]', '[recording failed]')
    )

    level_labels = {"1": "Beginner (Guided Coach)", "2": "Intermediate (Sparring Partner)", "3": "Advanced (Grandmaster)"}
    level_label = level_labels.get(req.level, "Unknown")

    prompt = f"""You are a master debate coach and expert in rhetoric, logic, and argumentation.

A student just completed a debate practice session at level: {level_label}
Topic: "{req.topic}"

Here is the full transcript:
{transcript}

Analyse this debate and respond ONLY with a valid JSON object in exactly this format (no markdown, no extra text):
{{
  "user_arguments": [
    "First main argument the user made (1-2 sentences)",
    "Second main argument the user made (1-2 sentences)",
    "Third main argument the user made (1-2 sentences)"
  ],
  "ai_arguments": [
    "First main counter-argument raised (1-2 sentences)",
    "Second main counter-argument raised (1-2 sentences)",
    "Third main counter-argument raised (1-2 sentences)"
  ],
  "strengths": [
    "Something the user did well",
    "Another strength"
  ],
  "feedback": [
    "Specific, actionable tip to improve",
    "Another specific tip",
    "A third tip"
  ],
  "overall": "2-3 sentence overall assessment of the user's performance and what to focus on next."
}}

Be specific and reference actual things said in the transcript. Do not be generic."""

    try:
        raw = call_text_model([
            {"role": "system", "content": "You are a debate feedback engine. Always respond with valid JSON only, no markdown, no extra text."},
            {"role": "user", "content": prompt},
        ])
        # Strip markdown code fences if present
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback generation failed: {e}")


# ── /chat: text in → streaming text out (text-only page via gpt-5-nano) ───────
class DebateRequest(BaseModel):
    message: str
    level: str
    topic: str

@app.post("/chat")
async def chat(req: DebateRequest):
    system_instruction = get_system_prompt(req.level, req.topic)

    def generate():
        try:
            stream = openai_client.chat.completions.create(
                model="gpt-5-nano",
                stream=True,
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": req.message},
                ],
            )
            for chunk in stream:
                text = chunk.choices[0].delta.content
                if text:
                    yield f"data: {json.dumps({'text': text})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)