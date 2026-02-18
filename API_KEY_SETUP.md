# 🔑 API Key Setup Guide

## ❌ Problem You Had

```
Error during grading: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/...
API key not valid. Please pass a valid API key.
```

## ✅ Solution

### Step 1: Verify `.env` File Exists
Check that you have this file:
```
backend/.env
```

### Step 2: Copy from `.env.example`
Your `.env` file should contain:
```env
GOOGLE_API_KEY=AIzaSyCpN1gZ087Ckiq884pXz7q7bVFV-qg7knY
PORT=3000
NODE_ENV=development
```

### Step 3: Make Sure `dotenv` is Installed
Run in backend folder:
```bash
npm install dotenv
```

### Step 4: Restart Backend Server
```bash
cd backend
node server.js
```

You should see:
```
🚀 Grading Server running on http://localhost:3000
📌 API endpoints:
   - POST http://localhost:3000/api/grade-with-guide (New - with marking guide)
   - POST http://localhost:3000/api/grade (Legacy - batch processing)
   - GET http://localhost:3000/api/health (Health check)

💡 Set GOOGLE_API_KEY environment variable for Gemini API
⚠️  Currently using: ✓ Set
```

---

## 🎯 How It Works

1. **Node.js reads** `.env` file using `dotenv` package
2. **Environment variables** are set in `process.env`
3. **Backend code** reads from `process.env.GOOGLE_API_KEY`
4. **Gemini API** receives valid key and works correctly

---

## 🔍 Verify It's Working

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Response should be:
```json
{"status":"ok","message":"Server is running"}
```

If you get a connection error, the backend isn't running.
If you get an API error, the API key is wrong.

---

## 🚀 Now Try Grading!

1. Go to http://localhost:5173/
2. Fill the form
3. Upload marking guide and student paper
4. Click "Grade Paper"
5. Wait for results (5-10 seconds)

It should now work! 🎉

---

## 📝 Notes

- ✅ `.env` file is in `.gitignore` (don't commit sensitive keys)
- ✅ `.env.example` is safe to commit (it shows template only)
- ✅ Only you should have the actual `.env` with real API key
- ✅ The API key in `.env.example` is already set for you

---

## 🆘 Still Getting Error?

### Check 1: Is `.env` file created?
```bash
ls backend/.env  # Linux/Mac
dir backend\.env # Windows
```

### Check 2: Does it have the API key?
Open `backend/.env` and verify it has:
```
GOOGLE_API_KEY=AIzaSyCpN1gZ087Ckiq884pXz7q7bVFV-qg7knY
```

### Check 3: Is backend restarted?
Kill the server (Ctrl+C) and restart:
```bash
cd backend
node server.js
```

### Check 4: Look for "✓ Set" message
When server starts, it should show:
```
⚠️  Currently using: ✓ Set
```

If it shows "✗ Not set", the .env file isn't being read.

---

## ✨ All Set!

Your system should now work perfectly. The API key issue is resolved! 🚀

