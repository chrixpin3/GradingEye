# Quick Start Guide - AI Grading System

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your Google API Key (1 minute)
1. Open [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"**
3. Create a new API key or use existing one
4. Copy the key - you'll need it

### Step 2: Backend Setup (2 minutes)
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file and add your API key
# Windows: Create file named ".env" with content:
GOOGLE_API_KEY=paste-your-key-here

# Start the server
npm start
```
✅ Backend running on `http://localhost:3000`

### Step 3: Frontend Setup (1.5 minutes)
```bash
# Open new terminal
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
✅ Frontend running on `http://localhost:5173`

### Step 4: Start Grading (0.5 minutes)
1. Open browser and go to `http://localhost:5173`
2. Click **"Start Marking"**
3. Fill in student details
4. Upload marking guide and student paper
5. Click **"Start AI Grading"**
6. Wait for results (~5-10 seconds)

---

## 📋 What You Need

### Files
- ✅ Marking Guide (PDF or Image)
- ✅ Student Paper (PDF or Image)

### Information
- ✅ Student Name
- ✅ Subject Name
- ✅ Maximum Marks

---

## 🎯 Example Workflow

### Scenario: Grade Mathematics Paper

1. **Prepare Files**
   - `marking_guide.pdf` - Shows correct answers and marking scheme
   - `student_paper.jpg` - Scan of student's answers

2. **Enter Information**
   - Student Name: "Alice Johnson"
   - Subject: "Mathematics"
   - Max Marks: 100

3. **Upload & Grade**
   - System analyzes both documents
   - AI grades each answer
   - Compares with marking guide

4. **View Results**
   - Overall: 85/100 (Grade B)
   - Weakness: Quadratic equations (60% accuracy)
   - Strengths: Geometry and algebra
   - Recommendations: Practice more equation problems

---

## ⚠️ Common Issues & Fixes

### **Issue: "Backend not responding"**
- ✅ Check if backend is running: `npm start` in backend folder
- ✅ Verify it's on `http://localhost:3000`

### **Issue: "API Key invalid"**
- ✅ Get new key from Google AI Studio
- ✅ Update `.env` file in backend
- ✅ Restart backend server

### **Issue: "Failed to upload files"**
- ✅ Check file size (max 50MB)
- ✅ Use supported format: PDF, JPG, PNG
- ✅ Clear browser cache and try again

### **Issue: "Poor grading quality"**
- ✅ Use clear, high-resolution scans
- ✅ Ensure text is legible
- ✅ Provide detailed marking guide
- ✅ Check lighting in photos

---

## 📊 What Gets Graded

✅ Question-by-question analysis
✅ Marks obtained vs maximum
✅ Percentage score
✅ Weakness areas with accuracy %
✅ Student strengths
✅ Personalized recommendations
✅ Detailed feedback for each answer
✅ Grade assignment (A-F)

---

## 💡 Pro Tips

### For Better Results
1. **Use Clear Scans** - Good lighting, high resolution
2. **Detailed Guide** - Include marking criteria and partial credit rules
3. **Same Format** - Both files should be same type (PDF or images)
4. **Complete Guide** - Don't skip any marking criteria

### Performance
- First grade: ~8-10 seconds (includes startup time)
- Subsequent grades: ~5-7 seconds
- Faster with lower resolution images (but less accurate)

---

## 🔑 Important Notes

### API Key Safety
🔐 **NEVER** share your API key publicly
- Don't commit `.env` to git
- Keep `.env` file private
- Regenerate if accidentally exposed

### File Handling
📁 Files are:
- Uploaded temporarily
- Deleted after processing
- Not stored on server
- Sent to Google only for processing

### Privacy
🛡️ Your grading data:
- Is processed by Google's API
- May be logged for debugging
- Review Google's privacy policy

---

## 📞 Troubleshooting

### **Can't access frontend?**
```bash
# Make sure frontend is running
cd frontend
npm run dev
# Should show: Local: http://localhost:5173
```

### **Backend keeps crashing?**
```bash
# Check Node.js version
node --version  # Should be 18+

# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### **API key not working?**
```
1. Go to https://aistudio.google.com/app/apikey
2. Create a NEW API key
3. Update .env file
4. Restart backend: npm start
```

---

## 🎓 Next Steps

### After First Grade
1. Try grading different subjects
2. Experiment with different marking guides
3. Review the analytics dashboard
4. Check recommendations

### Advanced Features
- Batch grade multiple papers
- Generate PDF reports (coming soon)
- Export grading history (coming soon)
- Custom grading templates (coming soon)

---

## 📚 Learn More

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **API Documentation**: See `API_DOCUMENTATION.md`
- **Troubleshooting**: See `SETUP_GUIDE.md` → Troubleshooting
- **GitHub**: Check project repository

---

## ✨ You're All Set!

Your AI Grading System is ready to use. 🎉

**Happy Grading!** 📝
