# ✅ Pre-Launch Checklist

Complete this checklist before starting to use the system.

---

## 🔍 System Requirements Check

### Prerequisites
- [ ] Node.js 18+ installed (`node --version` shows 18+)
- [ ] npm 8+ installed (`npm --version` shows 8+)
- [ ] 50MB+ free disk space
- [ ] Internet connection
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt

### Google Setup
- [ ] Google account created
- [ ] API key obtained from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- [ ] API key copied and saved safely

---

## 📁 Files & Folders Check

### Project Structure
- [ ] `grading/` folder exists
  - [ ] `backend/` subfolder exists
  - [ ] `frontend/` subfolder exists
  - [ ] Documentation files exist

### Backend Files
- [ ] `backend/package.json` exists
- [ ] `backend/server.js` exists
- [ ] `backend/uploads/` folder exists or can be created
- [ ] `.env.example` exists in backend

### Frontend Files
- [ ] `frontend/package.json` exists
- [ ] `frontend/src/` folder exists
- [ ] `frontend/src/components/` has:
  - [ ] Dashboard.jsx
  - [ ] MarkingForm.jsx
  - [ ] GradingResults.jsx
  - [ ] Menu.jsx
- [ ] `frontend/src/api.js` exists
- [ ] `frontend/src/config.js` exists

---

## 🚀 Backend Setup Check

### Installation
- [ ] Navigated to `backend/` folder
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed (check node_modules folder)
- [ ] No errors during installation

### Configuration
- [ ] Created `.env` file in `backend/` folder
- [ ] Added `GOOGLE_API_KEY=your-key-here` to `.env`
- [ ] Saved `.env` file
- [ ] `.env` file is in `.gitignore` (not tracked)

### Testing
- [ ] Backend starts with `npm start`
- [ ] Shows: "🚀 Grading Server running on http://localhost:3000"
- [ ] API responds: `curl http://localhost:3000/api/health`
- [ ] Response shows: `{"status":"ok","message":"Server is running"}`

---

## 🎨 Frontend Setup Check

### Installation
- [ ] Navigated to `frontend/` folder
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed (check node_modules folder)
- [ ] No errors during installation

### Configuration
- [ ] No special config needed (uses default http://localhost:3000)
- [ ] Or verify in `src/config.js` if BASE_URL is correct

### Testing
- [ ] Frontend starts with `npm run dev`
- [ ] Shows: "Local: http://localhost:5173" (or similar)
- [ ] Browser opens automatically or you can navigate to it
- [ ] Dashboard page loads without errors
- [ ] No console errors (open F12 to check)

---

## 🧪 Integration Test

### Both Services Running
- [ ] Backend running on terminal 1 (port 3000)
- [ ] Frontend running on terminal 2 (port 5173)
- [ ] Can open http://localhost:5173 in browser
- [ ] Dashboard shows "Start Marking" button

### API Connection
- [ ] Form loads without errors
- [ ] No network errors in browser console (F12)
- [ ] CORS errors? (should be none)
- [ ] Backend logs show requests (optional)

---

## 📝 Sample File Preparation

### Test Files
- [ ] Have a marking guide file ready (PDF or image)
- [ ] Have a student paper file ready (PDF or image)
- [ ] Files are under 50MB each
- [ ] File quality is good (legible text)
- [ ] Files are in supported format:
  - [ ] PDF files (.pdf)
  - [ ] JPEG images (.jpg, .jpeg)
  - [ ] PNG images (.png)

### Sample Data
- [ ] Student name ready (for testing)
- [ ] Subject name ready (for testing)
- [ ] Max marks number ready (for testing)

---

## 🎯 First Test Run

### Before Testing
- [ ] Both backend and frontend running
- [ ] Sample files prepared
- [ ] Sample data ready

### During Testing
- [ ] Click "Start Marking" button
- [ ] Form loads successfully
- [ ] Can enter student information:
  - [ ] Student name input works
  - [ ] Subject name input works
  - [ ] Max marks input works
- [ ] Can upload files:
  - [ ] Marking guide upload works
  - [ ] Student paper upload works
  - [ ] File previews show (names/sizes)
- [ ] Click "Start AI Grading"
- [ ] Loading spinner appears
- [ ] Processing starts (should take 5-10 seconds)

### After Testing
- [ ] Results page appears
- [ ] Overall score displays
- [ ] Charts render correctly
- [ ] Feedback text displays
- [ ] No errors in console (F12)

---

## 📊 Verification Tests

### Dashboard
- [ ] ✅ Form displays correctly
- [ ] ✅ Input fields work
- [ ] ✅ File uploads work
- [ ] ✅ Validation messages appear (if invalid)
- [ ] ✅ Submit button works

### Results
- [ ] ✅ Overall score displays
- [ ] ✅ Grade (A-F) displays
- [ ] ✅ Percentage shows
- [ ] ✅ Charts render (pie chart, bar chart)
- [ ] ✅ Question breakdown shows
- [ ] ✅ Feedback text displays
- [ ] ✅ Recommendations show
- [ ] ✅ "Grade Another" button works

### Error Handling
- [ ] ✅ Try without Google API key → see error
- [ ] ✅ Try with wrong file type → see error message
- [ ] ✅ Try with very large file → see size error
- [ ] ✅ Try with poor quality image → see grading result (maybe not perfect, but works)

---

## 🔧 Troubleshooting Checks

### If Backend Won't Start
- [ ] Check Node version: `node --version`
- [ ] Check npm install was successful
- [ ] Check if port 3000 is free: `netstat -ano | findstr :3000`
- [ ] Try different port if needed
- [ ] Check .env file has API key
- [ ] Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### If Frontend Won't Start
- [ ] Check Node version: `node --version`
- [ ] Check npm install was successful
- [ ] Check if port 5173 is free: `netstat -ano | findstr :5173`
- [ ] Try `npm run dev` again
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### If Can't Connect
- [ ] Is backend running? (see port 3000 output)
- [ ] Is frontend running? (see port 5173 output)
- [ ] Can you ping backend? `curl http://localhost:3000/api/health`
- [ ] Check browser console (F12) for errors
- [ ] Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### If Grading Fails
- [ ] Check Google API key is valid
- [ ] Check backend console for error messages
- [ ] Check file format (PDF/JPG/PNG only)
- [ ] Check file size (< 50MB)
- [ ] Check file quality (legible text)
- [ ] Check internet connection
- [ ] Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📱 Browser Compatibility

### Recommended Browsers
- [ ] Chrome 90+ (Recommended)
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

### Browser Testing
- [ ] Opens without errors
- [ ] Styling looks correct (colors, layout)
- [ ] Forms work properly
- [ ] Charts display correctly
- [ ] Mobile responsive (if testing on phone/tablet)

---

## 🔐 Security Checks

### Environment
- [ ] .env file is in .gitignore
- [ ] API key is NOT in code (only in .env)
- [ ] API key is NOT shared/public
- [ ] No secrets in version control

### File Upload
- [ ] Uploaded files are temporary (deleted after)
- [ ] No sensitive data stored
- [ ] File validation works
- [ ] Size limits enforced

---

## 📚 Documentation Check

### Available Documentation
- [ ] README.md exists
- [ ] QUICK_START.md exists
- [ ] SETUP_GUIDE.md exists
- [ ] API_DOCUMENTATION.md exists
- [ ] INTEGRATION_GUIDE.md exists
- [ ] TROUBLESHOOTING.md exists
- [ ] ARCHITECTURE_DIAGRAMS.md exists
- [ ] DOCUMENTATION_INDEX.md exists

### Documentation Quality
- [ ] All files are readable
- [ ] All sections are present
- [ ] Examples are clear
- [ ] Instructions are complete

---

## ✨ Feature Verification

### Core Features
- [ ] Upload marking guide works
- [ ] Upload student paper works
- [ ] Enter student info works
- [ ] AI grading works
- [ ] Results display works
- [ ] Charts render correctly
- [ ] Feedback displays properly
- [ ] Recommendations show

### Analytics
- [ ] Overall score calculated
- [ ] Grade assigned correctly
- [ ] Percentage shown
- [ ] Answer distribution shown
- [ ] Weakness analysis shown
- [ ] Strength identification shown

### User Experience
- [ ] Loading spinner displays
- [ ] Error messages clear
- [ ] Form validation works
- [ ] Button feedback clear
- [ ] Results readable
- [ ] Mobile friendly (if tested)

---

## 🚀 Launch Readiness

### Final Checks
- [ ] All items above checked ✓
- [ ] Backend running successfully
- [ ] Frontend running successfully
- [ ] Sample test passed
- [ ] No critical errors
- [ ] Documentation available
- [ ] Ready to use

### Ready to Launch?
- [ ] Yes, everything works! ✅
- [ ] Or, more troubleshooting needed (see TROUBLESHOOTING.md)

---

## 📋 First Use Recommendations

### Before First Real Use
1. [ ] Do one sample test run first
2. [ ] Review results carefully
3. [ ] Verify marks seem correct
4. [ ] Check feedback quality
5. [ ] Read [SETUP_GUIDE.md](SETUP_GUIDE.md) section "How to Use"

### During First Real Use
1. [ ] Start with one easy paper
2. [ ] Verify results make sense
3. [ ] Check AI grading accuracy
4. [ ] Adjust if needed
5. [ ] Continue with more papers

### After First Use
1. [ ] Review system performance
2. [ ] Adjust if needed
3. [ ] Plan for integration if needed
4. [ ] Train others if needed
5. [ ] Enjoy time savings! ⏱️

---

## 🎯 Success Criteria

Your system is working correctly if:

✅ Backend runs without errors
✅ Frontend loads without errors
✅ Forms accept input correctly
✅ Files upload successfully
✅ Grading completes in 5-10 seconds
✅ Results display with all details
✅ Charts render properly
✅ No console errors
✅ Recommendations make sense
✅ Ready for production use

---

## 🎉 You're Ready!

If all checkboxes are checked, your system is:
✅ Properly set up
✅ Fully functional
✅ Ready to grade papers
✅ Ready for production
✅ Ready for integration

**Congratulations! Start grading papers! 📚**

---

## 📞 Need Help?

If any checks failed:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Review error messages carefully
4. Check browser console (F12)
5. Check backend console/terminal

---

**Date Completed**: ________________
**Status**: ☐ Ready to Use ☐ Needs Fixes

---

Good luck! You've got this! 💪📚✨
