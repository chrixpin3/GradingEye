import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import 'dotenv/config';
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./db.js";
import Response from "./models/Response.js";
import authRoutes from "./routes/auth.js";

const ai = new GoogleGenAI({ apiKey: process.env.G4 });
const app = express();
const upload = multer({ dest: "uploads/" }); // temp folder

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173"],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key_grading_app',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/grading-app",
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: false,
  }
}));
app.use("/api/auth", authRoutes);

console.time("total marking time")
app.post("/api/grade",
  upload.fields([
    { name: "student_doc", maxCount: 1 },
    { name: "marking_guide_doc", maxCount: 1 },
  ]),

  async (req, res) => {
    try {
      const studentFile = req.files["student_doc"]?.[0];
      const guideFile = req.files["marking_guide_doc"]?.[0];


      if (!studentFile || !guideFile) {
        return res.status(400).json({ error: "Both files required" });
      }




      console.time("student answer");
      console.log(`📤 Uploading student doc: ${studentFile.originalname} (${studentFile.mimetype})`);
      const uploadedStudent = await ai.files.upload({
        file: studentFile.path,
        config: { mimeType: studentFile.mimetype || "application/pdf" },
      });
      console.timeEnd("student answer");

      console.time("marking guide");
      console.log(`📤 Uploading marking guide: ${guideFile.originalname} (${guideFile.mimetype})`);
      const uploadedGuide = await ai.files.upload({
        file: guideFile.path,
        config: { mimeType: guideFile.mimetype || "application/pdf" },
      });
      console.timeEnd("marking guide");
      // test.js (TOP of file, after imports)
      // 🔁 Retry wrapper for Gemini overloads
      async function callGeminiWithRetry(fn, retries = 5) {
        for (let i = 0; i < retries; i++) {
          try {
            return await fn();
          } catch (err) {
            if (err?.status === 503) {
              const delay = 1000 * (i + 1);
              console.log(`⏳ Gemini overloaded. Retrying in ${delay}ms...`);
              await new Promise(r => setTimeout(r, delay));
            } else {
              throw err;
            }
          }
        }
        throw new Error("Gemini unavailable after retries");
      }
      console.time("generation");
      const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: createUserContent([
          createPartFromUri(
            uploadedGuide.uri,
            uploadedGuide.mimeType
          ),
          `
THIS DOCUMENT IS THE OFFICIAL MARKING GUIDE.

STRICT RULES (VERY IMPORTANT):
- You MUST copy question text EXACTLY as written.
- For MCQs: YOU MUST INCLUDE THE QUESTION AND ALL OPTIONS in the "question_text" field.
- DO NOT summarize, rephrase, rename, or shorten questions.
- If text is unclear, copy it verbatim anyway.

This document defines:
- Exact question_text (including options and sub questions as given in the marking guide)
- Exact question_number
- Max marks per question
- Correct answers
- Allowed alternatives

This document is the PRIMARY and AUTHORITATIVE source of truth.

For reasoning or explanation-based questions:
- The student answer does NOT need to match word-for-word.
- Evaluate logical alignment with the marking guide concepts.
- Award partial marks ONLY if reasoning matches guide intent.
- NEVER accept answers that contradict the marking guide.
- NEVER invent new acceptable answers.

`,
          createPartFromUri(
            uploadedStudent.uri,
            uploadedStudent.mimeType
          ),
          `
THIS DOCUMENT IS THE STUDENT ANSWER SHEET.

STRICT INSTRUCTIONS:
- Extract student answers ONLY from this document.
- If a question has no answer, return "No answer provided".
- DO NOT infer or guess student answers.

COUNTING RULES (CRITICAL):
- Count ALL questions listed in the MARKING GUIDE.
- Include unanswered questions.
- Do NOT merge sub-questions.
- number_of_questions MUST equal the total number of questions in the marking guide.

CORRECT ANSWER RULES:
- For MCQs: return ONLY the correct option (e.g. "b")
- For True/False: return ONLY "True" or "False"
- For fill-in-the-blank: return ONLY the missing word/phrase
- For reasoning questions: return a SHORT model answer (1–2 lines max)
- DO NOT list all options
- DO NOT explain the answer

GRADING TASKS:
1. Match each question strictly using question_number.
2. Assign marks per marking guide.
3. Calculate total_marks and overall_percentage.
4. Determine ONE overall_performance label internally.

GRADING SCALE (INTERNAL USE ONLY):
- 90–100 → Excellent
- 80–89 → Very Good
- 70–79 → Good
- 60–69 → Satisfactory
- 50–59 → Sufficient
- 40–49 → Poor
- 0–39 → Failed

ANTI-CHEAT & INTEGRITY CHECKS (VISUAL ANALYSIS):
- Scan the document for VISUAL ANOMALIES that might indicate cheating.
- Look for:
  1. Erasures or White-out: faint marks of previous answers.
  2. Handwriting Differences: "Two different handwriting styles" (e.g. one messy, one neat) suggesting two people wrote it.
  3. Digital Edits: Text that looks superimposed/typed over handwriting.
  4. Crossed-out answers: If a student wrote a wrong answer, crossed it out, and wrote the correct one (suspicious if frequent).
- Determine a "clean" status.
- Provide "flags" (list of specific suspicious finds).
- Provide "evidence" (short description of *where* and *what* looks wrong).


OUTPUT RULES:
- Output VALID JSON ONLY.
- No extra text.
- No explanations outside JSON.
- Do NOT add or remove questions.
- question_text MUST be copied verbatim from marking guide.

CRITICAL JSON RULE:
- DO NOT include line breaks inside string values.
- All text values MUST be single-line.
- Replace line breaks with spaces.


IMPORTANT:
- Return ONLY the matched performance label.
- Do NOT return multiple labels.
- Do NOT explain the grading scale.
- Output MUST be valid JSON.

OUTPUT FORMAT:
{
  "course_name": "",
  "student_name": "",
  "number_of_questions": 0,
  "student_answers": [
    {
      "question_number": 1,
      "question_text": "",
      "correct_answer": "",
      "student_answer": "",
      "graded_marks": 0,
      "max_marks": 0,
      "status": "correct | partial | wrong"
    }
  ],
  "total_marks": 0,
  "max_total_marks": 0,
  "overall_percentage": 0,
  "overall_performance": "Excellent | Very Good | Good | Satisfactory | Sufficient | Poor | Failed",
  "teacher_feedback": "",
  "integrity_analysis": {
    "is_clean": true,
    "flags": [],
    "evidence": "No visual anomalies detected.",
    "confidence": "High"
  }
} 
`
        ]),
      }));
      console.timeEnd("generation");

      fs.unlinkSync(studentFile.path);
      fs.unlinkSync(guideFile.path);
      console.log("📌 GEMINI RAW OUTPUT:\n", response.text);

      let parsed;

      try {

        let raw = response.text.trim();

        /* ✅ Remove markdown safely */
        if (raw.startsWith("```")) {
          raw = raw.replace(/^```json\s*/, "")
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
        }

        /* ✅ Extract JSON object even if model adds text */
        const firstBrace = raw.indexOf("{");
        const lastBrace = raw.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
          raw = raw.substring(firstBrace, lastBrace + 1);
        }

        parsed = JSON.parse(raw);

      } catch (err) {

        console.error("❌ RAW GEMINI RESPONSE:\n", response.text);

        return res.status(500).json({
          success: false,
          error: "AI returned malformed JSON",
        });
      }

      try {
        const savedResponse = await Response.create(parsed);
        console.log(`✅ Response saved to DB with ID: ${savedResponse._id}`);
      } catch (dbErr) {
        console.error("❌ Error saving to DB:", dbErr);
        // Continue to send response even if DB save fails
      }



      return res.status(200).json({
        success: true,
        result: parsed
      }); // send real JSON, not a string

    }
    catch (err) {
      console.error("❌ GRADING ERROR:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Grading failed",
      });
    }
  });

// GET /api/history - Fetch all grading records
app.get("/api/history", async (req, res) => {
  try {
    const history = await Response.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (err) {
    console.error("❌ ERROR FETCHING HISTORY:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch grading history"
    });
  }
});

// DELETE /api/history/:id - Delete a specific grading record
app.delete("/api/history/:id", async (req, res) => {
  try {
    const deletedRecord = await Response.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }
    res.status(200).json({
      success: true,
      message: "Record deleted successfully"
    });
  } catch (err) {
    console.error("❌ ERROR DELETING RECORD:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete grading record"
    });
  }
});

// POST /api/chat-result - Context-aware chatbot for specific results
app.post("/api/chat-result", async (req, res) => {
  try {
    const { resultData, message, history = [] } = req.body;

    if (!resultData || !message) {
      return res.status(400).json({ error: "Missing result data or message" });
    }

    const systemInstruction = `
You are an AI assistant named "Grading Eye AI".

Rules:
- If the user asks who you are, respond exactly: "I am Grading Eye AI."
- You help with grading, reviewing answers, and giving academic feedback.
- Never mention Gemini, Google, or large language models.
- You are currently helping with a specific grading result for ${resultData.student_name}.
`;

    const contextPrompt = `
IDENTITY: ${systemInstruction}

STUDENT INFO:
- Name: ${resultData.student_name}
- Course: ${resultData.course_name}
- Total Score: ${resultData.total_marks}/${resultData.max_total_marks} (${resultData.overall_percentage}%)
- Performance Level: ${resultData.overall_performance}
- Teacher Feedback: ${resultData.teacher_feedback}

DETAILED EVALUATION:
${JSON.stringify(resultData.student_answers.map(q => ({
      q_num: q.question_number,
      q_text: q.question_text,
      student_ans: q.student_answer,
      correct_ans: q.correct_answer,
      marks: `${q.graded_marks}/${q.max_marks}`,
      status: q.status
    })), null, 2)}

User Question: ${message}
`;

    const chatResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: createUserContent([contextPrompt])
    });

    return res.status(200).json({
      success: true,
      reply: chatResponse.text.trim()
    });

  } catch (err) {
    console.error("❌ CHAT ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to process chat message"
    });
  }
});

// POST /api/chat-global - Global context-aware chatbot
app.post("/api/chat-global", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Fetch context for the global chat
    const gradingHistory = await Response.find().sort({ createdAt: -1 });

    // Calculate basic aggregate stats for context
    const totalAssessments = gradingHistory.length;
    const avgScore = totalAssessments > 0
      ? Math.round(gradingHistory.reduce((acc, curr) => acc + (curr.overall_percentage || 0), 0) / totalAssessments)
      : 0;
    const recentStudents = gradingHistory.slice(0, 5).map(r => ({
      name: r.student_name,
      course: r.course_name,
      score: r.overall_percentage
    }));

    const systemInstruction = `
You are an AI assistant named "Grading Eye AI".

Rules:
- If the user asks who you are, respond exactly: "I am Grading Eye AI."
- You help with grading, reviewing answers, and giving academic feedback.
- Never mention Gemini, Google, or large language models.
- You have access to the broad overview of the grading system.
`;

    const globalContext = `
IDENTITY: ${systemInstruction}

SYSTEM CONTEXT:
- Total Assessments Processed: ${totalAssessments}
- Class Average Score: ${avgScore}%
- Recent Student Activity: ${JSON.stringify(recentStudents, null, 2)}

INSTRUCTIONS:
- Answer questions about overall performance, trends, or system settings.
- Be insightful and data-driven.
- Provide suggestions for institutional improvement based on averages.

User Question: ${message}
`;

    const chatResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: createUserContent([globalContext])
    });

    return res.status(200).json({
      success: true,
      reply: chatResponse.text.trim()
    });

  } catch (err) {
    console.error("❌ GLOBAL CHAT ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to process global chat message"
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");

});
console.timeEnd("total marking time");
