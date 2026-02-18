# 🔧 Troubleshooting Guide

Complete troubleshooting guide for the AI Grading System.

---

## 🚨 Common Problems & Solutions

### Backend Issues

#### ❌ Problem: "Backend not responding"
**Symptoms:**
- Frontend shows connection error
- Cannot upload files
- "Failed to connect to server"

**Solutions:**
```bash
# 1. Check if backend is running
cd backend
npm start

# 2. Verify port 3000 is not in use
# Windows
netstat -ano | findstr :3000

# 3. Kill process using port (if needed)
# Windows - Get the PID from above, then:
taskkill /PID [PID] /F

# 4. Try different port (edit server.js if needed)
# Change: const PORT = 3001;
```

#### ❌ Problem: "GOOGLE_API_KEY not found"
**Symptoms:**
- Backend starts but won't grade
- Error message: "GOOGLE_API_KEY not found"

**Solutions:**
```bash
# 1. Create .env file in backend folder
cd backend
touch .env

# 2. Add your API key
# Inside .env file, add:
GOOGLE_API_KEY=sk-proj-your-actual-key-here

# 3. Verify file exists
dir  # On Windows
ls   # On Mac/Linux

# 4. Restart backend
npm start
```

#### ❌ Problem: "API Key invalid or expired"
**Symptoms:**
- Grading fails with API error
- Error message in console

**Solutions:**
```bash
# 1. Get new API key from Google
# Visit: https://aistudio.google.com/app/apikey

# 2. Update .env file
GOOGLE_API_KEY=new-key-here

# 3. Restart backend
npm start

# 4. Test with curl
curl -X GET http://localhost:3000/api/health
```

#### ❌ Problem: "Module not found" errors
**Symptoms:**
- Backend crashes on startup
- "Cannot find module 'express'"

**Solutions:**
```bash
# 1. Reinstall dependencies
cd backend
rm -rf node_modules
rm package-lock.json

# 2. Install fresh
npm install

# 3. Verify Node version (should be 18+)
node --version

# 4. Start again
npm start
```

#### ❌ Problem: Port already in use
**Symptoms:**
- "EADDRINUSE: address already in use :::3000"

**Solutions:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -i :3000
kill -9 [PID]

# Alternative - Use different port
# Edit backend/server.js:
# Change: const PORT = process.env.PORT || 3000;
# To:     const PORT = process.env.PORT || 3001;
```

---

### Frontend Issues

#### ❌ Problem: "Frontend won't start"
**Symptoms:**
- `npm run dev` gives errors
- Cannot open browser

**Solutions:**
```bash
# 1. Check Node version
node --version  # Should be 18+
npm --version   # Should be 8+

# 2. Install dependencies
cd frontend
npm install

# 3. Clear cache
npm cache clean --force

# 4. Try again
npm run dev
```

#### ❌ Problem: "Module not found in frontend"
**Symptoms:**
- "Cannot find module 'react'"
- Blank page with errors

**Solutions:**
```bash
# 1. Reinstall packages
cd frontend
rm -rf node_modules package-lock.json
npm install

# 2. Check package.json is correct
# Should have: react, react-dom, tailwindcss, etc.

# 3. Run dev server
npm run dev
```

#### ❌ Problem: "Styles not loading (Tailwind CSS)"
**Symptoms:**
- No colors or styling
- Looks like plain HTML

**Solutions:**
```bash
# 1. Check tailwind.config.js exists
# Should be in frontend/ directory

# 2. Verify src/index.css has Tailwind directives:
@tailwind base;
@tailwind components;
@tailwind utilities;

# 3. Restart dev server
npm run dev

# 4. Clear browser cache
# Ctrl+Shift+Delete (Chrome/Edge/Firefox)
```

#### ❌ Problem: "Port 5173 already in use"
**Symptoms:**
- "Port 5173 is in use"
- Cannot start dev server

**Solutions:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -i :5173
kill -9 [PID]

# Vite will auto-use next available port
npm run dev
```

---

### File Upload Issues

#### ❌ Problem: "File upload fails silently"
**Symptoms:**
- Click upload but nothing happens
- No error message

**Solutions:**
```javascript
// 1. Open browser console (F12)
// Check for JavaScript errors

// 2. Check file size
// Files must be under 50MB

// 3. Check file format
// Supported: PDF, JPG, JPEG, PNG

// 4. Try smaller file first
// Test with < 5MB file

// 5. Check network tab
// Press F12 → Network → Try upload
// Look for failed requests
```

#### ❌ Problem: "Invalid file type error"
**Symptoms:**
- "Invalid file type" error message
- Won't accept files

**Solutions:**
```bash
# Supported formats:
✅ PDF files (.pdf)
✅ JPEG images (.jpg, .jpeg)
✅ PNG images (.png)

❌ NOT supported:
❌ DOCX, DOC
❌ TIFF
❌ GIF (animated)
❌ BMP

# Solution: Convert file to supported format
# Use online tools or software like:
# - ILovePDF.com (convert DOC to PDF)
# - ImageMagick (convert images)
# - Preview app (Mac) or Paint (Windows)
```

#### ❌ Problem: "File too large"
**Symptoms:**
- "File exceeds maximum size"
- Large PDF or image won't upload

**Solutions:**
```bash
# Max file size: 50MB

# Compress PDF:
# Use: https://www.ilovepdf.com/compress_pdf
# Or use: ghostscript command line tool

# Compress Images:
# Use: https://compressor.io
# Or use: ImageMagick: convert input.jpg -quality 80 output.jpg

# Split large files:
# If PDF > 50MB, split into smaller parts
# Process separately, then combine results
```

#### ❌ Problem: "File quality is poor"
**Symptoms:**
- Grading results are inaccurate
- AI can't read the text
- Lots of errors in output

**Solutions:**
```
1. Ensure good lighting when photographing
2. Use clear, legible scans
3. Avoid shadows or glare
4. Take straight-on photos (not angled)
5. Use high-resolution camera/scanner
6. Make sure text is dark and visible
7. Avoid skewed or rotated documents
8. Clean document before scanning
9. Use scanner instead of phone camera if possible
10. For PDFs, ensure text is selectable (OCR)
```

---

### Grading Issues

#### ❌ Problem: "Grading fails with no error"
**Symptoms:**
- "Processing..." spinning forever
- No results after 30+ seconds
- Button shows error after timeout

**Solutions:**
```bash
# 1. Check backend is running
# Terminal: npm start (in backend folder)

# 2. Check Google API is working
# Terminal in backend:
curl -X GET http://localhost:3000/api/health

# 3. Verify API key is valid
# Check .env file has correct key

# 4. Check browser console (F12)
# Look for error messages

# 5. Try with simpler files
# Start with small, clear scan

# 6. Check network connection
# Internet needed for Gemini API calls
```

#### ❌ Problem: "Grading results are inaccurate"
**Symptoms:**
- Wrong marks assigned
- Answers marked correct when wrong
- AI misunderstood the content

**Solutions:**
```
1. Provide clearer marking guide
   - Include all possible correct answers
   - Specify partial credit rules
   - Show examples

2. Improve image quality
   - Better scan or photograph
   - Higher resolution
   - Better lighting

3. Simplify documents
   - Remove distractions
   - Focus on relevant content
   - One clear image per upload

4. Check marking guide clarity
   - Make sure answers are obvious
   - Include step-by-step solutions
   - Be explicit about partial credit

5. Test with known papers
   - Try with paper you've manually graded
   - Verify AI's assessment
   - Adjust if needed
```

#### ❌ Problem: "Processing takes too long"
**Symptoms:**
- Grading takes 20+ seconds
- "Processing..." shows for a long time

**Solutions:**
```
1. Check internet speed
   - Gemini API needs internet
   - Slow connection = slow grading

2. Use smaller files
   - High-res images = slower processing
   - Compress before uploading

3. Simplify documents
   - Remove unnecessary pages
   - Focus on answer content

4. Check Google API quota
   - May have rate limits
   - Check Google Cloud Console

5. Try at different time
   - API might be slower during peak hours
   - Retry after a few minutes

Typical times:
✅ 5-10 seconds: Normal
⚠️ 10-15 seconds: Acceptable
❌ 15+ seconds: Investigate
```

---

### API/Integration Issues

#### ❌ Problem: "CORS error"
**Symptoms:**
- "Access to XMLHttpRequest blocked by CORS policy"
- Frontend can't reach backend

**Solutions:**
```javascript
// Backend (server.js) - should already have:
import cors from 'cors';
app.use(cors());

// If still having issues:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Restart backend and try again
```

#### ❌ Problem: "API returns 500 error"
**Symptoms:**
- "500 Internal Server Error"
- Grading fails on backend

**Solutions:**
```bash
# 1. Check backend console for errors
# Look at the terminal where npm start is running

# 2. Verify Google API key
echo $GOOGLE_API_KEY  # Check if set

# 3. Check file paths
# Are marking guide and student paper uploaded?

# 4. Verify file formats
# Are they actually PDF/images?

# 5. Check file sizes
# Are they under 50MB?

# 6. Restart backend
npm start

# 7. Check backend logs for details
# Detailed error messages in console
```

#### ❌ Problem: "Timeout error"
**Symptoms:**
- "Request timeout"
- "Connection lost"
- After 5+ minutes

**Solutions:**
```bash
# 1. Check if backend crashed
# Did `npm start` show any errors?

# 2. Check internet connection
# Are you connected to internet?

# 3. Check Google API service status
# Visit: https://status.cloud.google.com/

# 4. Try with smaller files
# Large files may timeout

# 5. Increase timeout (if integrating)
// Frontend request timeout
const TIMEOUT = 300000; // 5 minutes

// Or restart backend
npm start
```

---

### Performance Issues

#### ❌ Problem: "System running slow"
**Symptoms:**
- Everything is sluggish
- Browser feels unresponsive
- CPU usage high

**Solutions:**
```bash
# 1. Check running processes
# Task Manager (Windows) - look for high CPU
# Activity Monitor (Mac)

# 2. Close unnecessary applications
# Stop other Node processes
# Close unused browser tabs

# 3. Free up disk space
# Delete temp files
# Might improve performance

# 4. Restart system
# Sometimes helps clear memory

# 5. Check for multiple instances
# Make sure only one backend running:
netstat -ano | findstr :3000
```

#### ❌ Problem: "High memory usage"
**Symptoms:**
- System uses lots of RAM
- Grading is slow
- System starts to freeze

**Solutions:**
```bash
# 1. Monitor memory in Task Manager
# Processes tab → Memory column

# 2. Restart backend
npm start

# 3. Limit file sizes
# Process smaller files
# Split large batches

# 4. Check for file upload issues
# Old temp files might accumulate
# Check backend/uploads/ directory
# Delete old files manually

# 5. Update Node.js
# Older versions less efficient
# Download from nodejs.org
```

---

## 🆘 Getting Help

### When to Check What

1. **Can't start backend?**
   - Check Node.js installed: `node --version`
   - Check npm installed: `npm --version`
   - Check .env file exists with API key

2. **Can't start frontend?**
   - Check dependencies installed: `npm install`
   - Check port 5173 is free
   - Check Node version

3. **Can't grade papers?**
   - Check backend is running
   - Check Google API key is valid
   - Check file format is PDF/JPG/PNG
   - Check file is under 50MB

4. **Wrong grades?**
   - Check marking guide is clear
   - Improve image quality
   - Verify expected answers
   - Try simpler example

### Debug Checklist

- [ ] Is backend running? (`npm start` in backend/)
- [ ] Is frontend running? (`npm run dev` in frontend/)
- [ ] Is Google API key in .env?
- [ ] Is file format PDF or image?
- [ ] Is file under 50MB?
- [ ] Is file quality good?
- [ ] Is internet connection working?
- [ ] Are ports 3000 and 5173 free?
- [ ] Is Node.js 18+ installed?

### Get More Help

1. **Check Documentation**
   - [README.md](README.md) - Overview
   - [QUICK_START.md](QUICK_START.md) - Setup
   - [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference

2. **Check Logs**
   - Backend console (terminal window)
   - Browser console (F12 in browser)
   - Network tab (F12 → Network)

3. **Contact Support**
   - GitHub Issues
   - Email support
   - Documentation

---

## 📝 Collecting Debug Information

When reporting issues, include:

```
1. Error message (exact text)
2. Screenshots (if possible)
3. Browser console errors (F12)
4. Backend console errors
5. Steps to reproduce
6. System information:
   - OS (Windows/Mac/Linux)
   - Node version: node --version
   - npm version: npm --version
7. Files that caused issue (if possible)
```

---

## ✅ Verification Steps

After setup, verify everything works:

```bash
# 1. Backend check
curl http://localhost:3000/api/health
# Should return: {"status":"ok","message":"Server is running"}

# 2. API key check
# Should be in .env file in backend/

# 3. Frontend loads
# Should show form at http://localhost:5173

# 4. Upload test
# Try uploading a small PDF/image

# 5. Grading test
# Fill form and click "Start AI Grading"
# Should show processing spinner
# Should show results in 5-10 seconds
```

---

## 🎯 Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Backend won't start | `npm install` then `npm start` |
| Backend not found | Check port 3000 is free, `npm start` again |
| API key error | Add to `.env`, restart backend |
| Frontend won't load | `npm install` then `npm run dev` |
| File won't upload | Check format (PDF/JPG/PNG) and size < 50MB |
| Grading fails | Check backend running, internet connected |
| Slow grading | Reduce file size, check internet speed |
| Wrong results | Improve image quality, clarify marking guide |

---

Good luck! 🍀 You've got this! 💪
