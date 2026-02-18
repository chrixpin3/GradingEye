# 🚀 AI Grading System - Setup & Launch Guide

## ✅ Fixed Issues

- **Fixed backend syntax error**: Removed illegal `continue` statements
- **Fixed import path**: Changed api.js import from `../config` to `./config.js`
- **Cleaned up server.js**: Removed duplicate/corrupted code
- **Created environment files**: Added `.env.local` for frontend

---

## 📋 Prerequisites

Make sure you have:
- ✅ Node.js v18+ installed
- ✅ npm installed
- ✅ Google API key with Gemini access
- ✅ Both frontend and backend folders

---

## 🔑 Google API Key Setup

### 1. Get Your Google API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the API key

### 2. Add to Backend
Create or edit `backend/.env`:
```
GOOGLE_API_KEY=your-actual-api-key-here
PORT=3000
NODE_ENV=development
```

---

## 🏃 Quick Start (5 minutes)

### Terminal 1: Start Backend
```bash
cd backend
npm install
node server.js
```

You should see:
```
🚀 Grading Server running on http://localhost:3000
📌 API endpoints:
   - POST http://localhost:3000/api/grade-with-guide (New - with marking guide)
   - POST http://localhost:3000/api/grade (Legacy - batch processing)
   - GET http://localhost:3000/api/health (Health check)
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 3: Open Browser
Go to: **http://localhost:5173/**

---

## 📝 How to Use

### Step 1: Click "Start Marking"
- Click the button on the dashboard

### Step 2: Fill Form
- **Student Name**: Enter student's name
- **Subject Name**: Enter subject/exam name
- **Max Marks**: Enter total marks for the paper
- **Marking Guide**: Upload the correct answers document (PDF/Image)
- **Student Paper**: Upload the student's submitted work (PDF/Image)

### Step 3: Submit
- Click "Grade Paper"
- Wait for analysis (5-10 seconds)

### Step 4: View Results
- Overall score and grade
- Question breakdown
- Weak areas identified
- Strengths recognized
- Personalized recommendations

---

## 🔧 System Architecture

```
User Browser
    ↓
Frontend (React)
  ├─ Dashboard
  ├─ MarkingForm (file upload)
  └─ GradingResults (display)
    ↓
Backend (Express)
  └─ /api/grade-with-guide
    ↓
Gemini API
  └─ Analyzes & grades
    ↓
Results back to Frontend
  └─ Display to user
```

---

## 📁 Project Structure

```
grading/
├── backend/
│   ├── server.js          ← Main API server
│   ├── package.json       ← Dependencies
│   ├── .env               ← Configuration (create this)
│   ├── .env.example       ← Template
│   └── uploads/           ← Temporary files
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MarkingForm.jsx
│   │   │   ├── GradingResults.jsx
│   │   │   └── ...
│   │   ├── api.js         ← API client
│   │   ├── config.js      ← Settings
│   │   └── main.jsx
│   ├── package.json
│   ├── .env.local         ← Configuration
│   └── vite.config.js
│
└── Documentation files...
```

---

## 🧪 Test the System

### 1. Check Backend Health
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 2. Test in Browser
1. Go to http://localhost:5173/
2. Upload sample PDF files
3. Click "Grade Paper"
4. Wait for results

---

## 🐛 Troubleshooting

### "Cannot find module" error
- Make sure you ran `npm install` in both frontend and backend
- Check node_modules folders exist

### Port 3000 already in use
- Change PORT in `.env`:
  ```
  PORT=3001
  ```
- Update frontend `.env.local`:
  ```
  VITE_API_URL=http://localhost:3001
  ```

### "Failed to resolve import" error
- Check all imports use correct paths (./config.js not ../config)
- Restart the dev server

### Gemini API errors
- Verify GOOGLE_API_KEY is set correctly
- Check API key is active and has Gemini access
- Try generating a test key from Google AI Studio

### Files not uploading
- Check file is PDF or image (JPG/PNG)
- Check file size < 50MB
- Look at browser console for specific error

---

## 📊 API Reference

### Main Endpoint: POST /api/grade-with-guide

**Request:**
```
POST http://localhost:3000/api/grade-with-guide
Content-Type: multipart/form-data

Body:
- markingGuide: File
- studentPaper: File
- studentName: string
- subjectName: string
- maxMarks: number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "studentName": "John Doe",
    "subjectName": "Mathematics",
    "maxMarks": 100,
    "totalMarksObtained": 85,
    "percentage": 85,
    "grade": "B",
    "questions": [
      {
        "questionNumber": 1,
        "topic": "Algebra",
        "status": "correct",
        "marksObtained": 10,
        "maxMarks": 10,
        "feedback": "Excellent solution"
      }
    ],
    "weaknessAnalytics": [
      {
        "topic": "Geometry",
        "accuracy": 60,
        "issues": ["Incorrect angle calculation"]
      }
    ],
    "strengths": [...],
    "recommendations": [...],
    "processingTime": "8.5s"
  }
}
```

---

## 🎯 Key Features

✅ **Accurate Grading** - AI-powered using Google Gemini
✅ **Fair Assessment** - Compares against marking guide
✅ **Detailed Feedback** - Question-by-question analysis
✅ **Analytics** - Weakness and strength identification
✅ **Fast Processing** - 5-10 seconds per paper
✅ **Professional UI** - Modern, responsive design
✅ **Easy Upload** - Drag & drop support
✅ **Secure** - Automatic file cleanup

---

## 🚀 Next Steps

1. ✅ **Setup**: Follow steps above
2. ✅ **Test**: Try with sample papers
3. ✅ **Deploy**: Move to production (see INTEGRATION_GUIDE.md)
4. ✅ **Train**: Teach users how to use
5. ✅ **Monitor**: Check performance

---

## 📞 Support

### Check These Docs
- [README.md](README.md) - Project overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API details
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Production deployment

### Common Questions

**Q: Can I grade multiple papers at once?**
- A: Not in current UI, but the legacy `/api/grade` endpoint supports batch processing

**Q: Can I change the grading criteria?**
- A: Yes, modify the marking guide. The system will use it for comparison.

**Q: How long does grading take?**
- A: Typically 5-10 seconds depending on file size and complexity

**Q: Can I deploy to production?**
- A: Yes! See INTEGRATION_GUIDE.md for deployment instructions

---

## ✨ What's Working

- ✅ Frontend dashboard with professional UI
- ✅ File upload (drag & drop + click)
- ✅ Form validation
- ✅ Backend API endpoint
- ✅ Gemini integration
- ✅ Grading and analysis
- ✅ Results display
- ✅ Charts and analytics

---

## 🎉 You're All Set!

Everything is ready to use. Just:

1. **Set your Google API key** in `backend/.env`
2. **Start the backend**: `cd backend && node server.js`
3. **Start the frontend**: `cd frontend && npm run dev`
4. **Open browser**: http://localhost:5173

**Happy Grading! 📚✨**

