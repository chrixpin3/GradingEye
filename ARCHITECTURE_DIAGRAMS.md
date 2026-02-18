# 📊 System Architecture & Flow Diagrams

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT SIDE                               │
│                 (React.js Frontend)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Dashboard Component                       │  │
│  │  - Main entry point                                  │  │
│  │  - Shows current state                               │  │
│  │  - Manages form/results flow                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          MarkingForm Component                       │  │
│  │  - Student input form                                │  │
│  │  - File uploads (drag & drop)                        │  │
│  │  - Form validation                                   │  │
│  │  - Error display                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           API Client (fetch)                         │  │
│  │  - Sends FormData to backend                         │  │
│  │  - Handles responses                                 │  │
│  │  - Error handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP POST
                           │ /api/grade-with-guide
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  SERVER SIDE                                │
│              (Express.js Backend)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Express Route Handler                        │  │
│  │  POST /api/grade-with-guide                          │  │
│  │  - Receive FormData                                  │  │
│  │  - Extract files and data                            │  │
│  │  - Validate input                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Multer File Processing                       │  │
│  │  - Save uploaded files temporarily                   │  │
│  │  - Convert to base64                                 │  │
│  │  - Get MIME types                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Gemini API Request Preparation                   │  │
│  │  - Create grading prompt                             │  │
│  │  - Embed marking guide as image/PDF                  │  │
│  │  - Embed student paper as image/PDF                  │  │
│  │  - Add student context                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS POST
                           │ generateContent()
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE GEMINI API                        │
│            (AI-Powered Grading Engine)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Gemini AI Model Processing                   │  │
│  │  - Analyze marking guide                             │  │
│  │  - Analyze student paper                             │  │
│  │  - Compare and grade                                 │  │
│  │  - Generate analytics                                │  │
│  │  - Provide recommendations                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         JSON Response Generation                     │  │
│  │  - Question analysis                                 │  │
│  │  - Weakness identification                           │  │
│  │  - Strength recognition                              │  │
│  │  - Recommendations                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ JSON Response
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  SERVER SIDE (Continued)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Response Processing                             │  │
│  │  - Parse JSON from Gemini                            │  │
│  │  - Clean up temporary files                          │  │
│  │  - Format response                                   │  │
│  │  - Send JSON to client                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ JSON Response
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  CLIENT SIDE (Continued)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     GradingResults Component                         │  │
│  │  - Display overall score                             │  │
│  │  - Show grade (A-F)                                  │  │
│  │  - Display charts and graphs                         │  │
│  │  - Show question breakdown                           │  │
│  │  - Display recommendations                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           User Views Results                         │  │
│  │  - Professional dashboard                            │  │
│  │  - Detailed analytics                                │  │
│  │  - Actionable insights                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Diagram

```
START
  ↓
USER UPLOADS FILES
  ├─ Marking Guide (PDF/Image)
  ├─ Student Paper (PDF/Image)
  └─ Student Info (Name, Subject, Max Marks)
  ↓
FRONTEND VALIDATION
  ├─ Check file types
  ├─ Check file sizes
  └─ Check required fields
  ↓
FORMDATA CREATION
  ├─ Append marking guide
  ├─ Append student paper
  └─ Append metadata
  ↓
SEND TO BACKEND
  POST /api/grade-with-guide
  ↓
BACKEND RECEIVES
  ├─ Extract files
  ├─ Save temporarily
  └─ Convert to base64
  ↓
VALIDATE INPUT
  ├─ Check file formats
  ├─ Check file content
  └─ Check parameters
  ↓
PREPARE GEMINI REQUEST
  ├─ Load marking guide
  ├─ Load student paper
  └─ Create prompt
  ↓
SEND TO GEMINI API
  ├─ Teacher prompt
  ├─ Marking guide image
  ├─ Student paper image
  └─ Student context
  ↓
GEMINI PROCESSES
  ├─ Analyze guide
  ├─ Analyze paper
  ├─ Compare answers
  ├─ Grade questions
  ├─ Calculate score
  ├─ Identify weaknesses
  ├─ Recognize strengths
  └─ Generate recommendations
  ↓
GEMINI RETURNS JSON
  ├─ Questions array
  ├─ Marks obtained
  ├─ Percentage
  ├─ Weakness analytics
  ├─ Strengths
  └─ Recommendations
  ↓
BACKEND PROCESSES
  ├─ Parse JSON
  ├─ Validate response
  ├─ Clean temp files
  └─ Format response
  ↓
SEND TO FRONTEND
  JSON Response with all results
  ↓
FRONTEND RECEIVES
  ├─ Parse data
  ├─ Update state
  └─ Trigger re-render
  ↓
DISPLAY RESULTS
  ├─ Show dashboard
  ├─ Display charts
  ├─ Show feedback
  └─ Display recommendations
  ↓
USER REVIEWS
  ├─ Overall score
  ├─ Weakness areas
  ├─ Strengths
  └─ Recommendations
  ↓
END
  (User can grade another or navigate away)
```

---

## 3. Component Interaction Diagram

```
┌──────────────────────────────────┐
│   App.jsx                        │
│   (Router Setup)                 │
└──────────────────────────────────┘
             ↓
┌──────────────────────────────────┐
│   Dashboard                      │
│   (Main State Manager)           │
│                                  │
│   States:                        │
│   - isLoading                    │
│   - gradingData                  │
│   - error                        │
└──────────────────────────────────┘
        ↙        ↓        ↖
       /         |         \
      /          |          \
     ↙           ↓           ↖
┌─────────┐  ┌─────────┐  ┌──────────┐
│ Marking │  │ Loading │  │ Grading  │
│ Form    │  │ Spinner │  │ Results  │
│         │  │         │  │          │
│- Input  │  │- Text   │  │- Score   │
│- Upload │  │- Anim.  │  │- Charts  │
│- Val.   │  │         │  │- Feedback│
└─────────┘  └─────────┘  └──────────┘
     ↓                          ↑
     └──────────┬───────────────┘
                │
           API Call
                │
           ↓ ↑ ↓
        Backend
```

---

## 4. File Upload Flow

```
┌─────────────────────────────────┐
│     User Selects Files          │
│     (Drag & Drop or Click)      │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   JavaScript File Object        │
│   ├─ markingGuide File          │
│   └─ studentPaper File          │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Frontend Validation           │
│   ├─ File type check            │
│   │  ✓ PDF/JPEG/PNG            │
│   ├─ File size check            │
│   │  ✓ < 50MB                  │
│   └─ Display validation errors  │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Create FormData               │
│   ├─ Append file 1              │
│   ├─ Append file 2              │
│   ├─ Append studentName         │
│   ├─ Append subjectName         │
│   └─ Append maxMarks            │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Fetch API Request             │
│   POST /api/grade-with-guide    │
│   Content-Type: multipart/form  │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Network Transmission          │
│   (HTTP POST)                   │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Backend Receives              │
│   Multer processes multipart    │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   File Storage                  │
│   temp location: uploads/       │
│   ├─ marking_guide.pdf          │
│   └─ student_paper.jpg          │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Convert to Base64             │
│   Read file buffer              │
│   Encode as base64 string       │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Send to Gemini API            │
│   as inlineData                 │
└─────────────────────────────────┘
```

---

## 5. Gemini API Request Structure

```
REQUEST STRUCTURE:
{
  model: "gemini-1.5-flash",
  content: [
    {
      role: "user",
      parts: [
        {
          text: "You are a teacher. Grade this paper..."
        },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: "base64encodedmarkingguide..."
          }
        },
        {
          text: "STUDENT PAPER:"
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: "base64encodedstudentpaper..."
          }
        }
      ]
    }
  ]
}

RESPONSE STRUCTURE:
{
  candidates: [
    {
      content: {
        parts: [
          {
            text: "{\"studentName\": \"...\", \"totalMarksObtained\": 85, ...}"
          }
        ]
      }
    }
  ]
}
```

---

## 6. Results Generation Flow

```
GEMINI RESPONSE (JSON)
       ↓
PARSE JSON
  ├─ Extract questions
  ├─ Extract marks
  ├─ Extract weaknesses
  ├─ Extract strengths
  └─ Extract recommendations
       ↓
CALCULATE METRICS
  ├─ Total marks obtained
  ├─ Percentage
  ├─ Grade (A-F)
  ├─ Correct/Incorrect count
  └─ Accuracy percentages
       ↓
STRUCTURE RESPONSE
  {
    studentName,
    subjectName,
    totalMarksObtained,
    maxMarks,
    percentage,
    questions: [
      {
        questionNumber,
        status,
        marksObtained,
        maxMarks,
        teacherComment,
        correctSolution
      }
    ],
    weaknessAnalytics: [
      {
        topic,
        accuracy,
        issues
      }
    ],
    strengths: [...],
    recommendations: [...]
  }
       ↓
SEND TO FRONTEND
       ↓
DISPLAY IN DASHBOARD
```

---

## 7. Error Handling Flow

```
ERROR OCCURS
       ↓
     ↙ ↓ ↖
    /  |  \
   /   |   \
  ↙    ↓    ↖

FILE     REQUEST    GRADING
ERROR    ERROR      ERROR
  ↓        ↓          ↓
  │        │          │
  └────────┼──────────┘
           ↓
    ERROR CAUGHT
           ↓
    IDENTIFY TYPE
    ├─ Validation Error
    ├─ Network Error
    ├─ API Error
    └─ Server Error
           ↓
    FORMAT ERROR MESSAGE
    └─ User-friendly text
           ↓
    DISPLAY TO USER
    ├─ Error banner
    ├─ Suggest fix
    └─ Allow retry
           ↓
    LOG FOR DEBUG
    ├─ Console
    ├─ Server logs
    └─ Error details
           ↓
    CLEANUP
    └─ Delete temp files
           ↓
    RESTORE UI STATE
```

---

## 8. State Management Flow

```
INITIAL STATE
{
  isLoading: false,
  gradingData: null,
  error: null
}
       ↓
USER SUBMITS FORM
  setIsLoading(true)
       ↓
SENDING REQUEST
{
  isLoading: true,
  gradingData: null,
  error: null
}
       ↓
REQUEST PROCESSING
(Wait for response)
       ↓
SUCCESS RESPONSE
  setGradingData(result)
  setIsLoading(false)
       ↓
SUCCESS STATE
{
  isLoading: false,
  gradingData: {...},
  error: null
}
       ↓
DISPLAY RESULTS
       ↓
USER CLICKS "GRADE ANOTHER"
  handleReset()
       ↓
RESET STATE
{
  isLoading: false,
  gradingData: null,
  error: null
}
       ↓
BACK TO FORM


OR


ERROR RESPONSE
  setError(errorMessage)
  setIsLoading(false)
       ↓
ERROR STATE
{
  isLoading: false,
  gradingData: null,
  error: "Error message"
}
       ↓
DISPLAY ERROR
       ↓
USER FIXES & RETRIES
  setError(null)
```

---

## 9. UI State Transitions

```
INITIAL STATE
┌──────────────────────┐
│   Marking Form       │
│   (Ready to submit)  │
└──────────────────────┘
         ↓ (User submits)
PROCESSING STATE
┌──────────────────────┐
│   Loading Spinner    │
│   "AI Teacher is     │
│    Grading..."       │
└──────────────────────┘
    ↙             ↖
   /               \
  ↙                 ↖
SUCCESS           ERROR
   ↓                ↓
┌──────────┐   ┌──────────┐
│ Results  │   │ Error    │
│ Display  │   │ Message  │
└──────────┘   └──────────┘
   ↓                ↓
┌─────────────────────────┐
│  "Grade Another" Button │
└─────────────────────────┘
    ↓ (User clicks)
Back to INITIAL STATE
```

---

## 10. API Response Time Diagram

```
TIMELINE:

T=0s     ├─ User clicks "Start AI Grading"
         │  └─ Form submission begins

T=0.1s   ├─ FormData created
         │  └─ Files appended

T=0.2s   ├─ Network request sent
         │  └─ Files start uploading

T=1s     ├─ Backend receives request
         │  └─ Multer processes files

T=1.5s   ├─ Files saved temporarily
         │  └─ Convert to base64

T=2s     ├─ Gemini API request sent
         │  └─ AI processing begins

T=2-8s   ├─ AI Analysis
         │  ├─ Analyze marking guide
         │  ├─ Analyze student paper
         │  ├─ Compare answers
         │  ├─ Generate analytics
         │  └─ Create recommendations

T=8s     ├─ Gemini API response received
         │  └─ JSON with results

T=8.5s   ├─ Backend processes response
         │  └─ Cleans up temp files

T=8.7s   ├─ Response sent to frontend
         │  └─ Network transmission

T=9s     ├─ Frontend receives response
         │  ├─ Parse JSON
         │  ├─ Update state
         │  └─ Re-render

T=9.2s   └─ Results displayed
            └─ User sees dashboard

TOTAL TIME: ~5-10 seconds average
```

---

These diagrams show the complete flow of the AI Grading System from user input to final results display.
