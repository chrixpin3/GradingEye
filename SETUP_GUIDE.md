# Professional AI Grading System

A professional, AI-powered exam grading system that uses Google's Gemini API to automatically grade student papers based on marking guides.

## Features

✨ **Professional UI/UX**
- Clean, modern dashboard interface
- Drag-and-drop file uploads
- Real-time processing with loading states
- Comprehensive results visualization

📊 **Advanced Grading**
- Upload marking guide and student paper
- AI acts as experienced teacher
- Analyzes answers against marking guide
- Provides detailed feedback and recommendations

📈 **Detailed Analytics**
- Overall performance score
- Question-by-question breakdown
- Weakness analysis
- Strength identification
- Personalized recommendations
- Grade assignment (A, B, C, D, F)

## Technology Stack

**Frontend:**
- React 19.2
- Tailwind CSS 4.1
- Recharts for data visualization
- Lucide React for icons
- React Router v7

**Backend:**
- Express.js 5.2
- Node.js with ES modules
- Google Generative AI (Gemini 1.5 Flash)
- Multer for file handling
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Google API Key for Gemini API
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
GOOGLE_API_KEY=your-google-api-key-here
```

4. Get your Google API Key:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Click "Get API Key"
   - Create a new API key or use existing one
   - Copy and paste into `.env` file

5. Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will typically run on `http://localhost:5173`

## How to Use

### Step 1: Start the Application
1. Start backend server: `npm start` (from `backend/`)
2. Start frontend server: `npm run dev` (from `frontend/`)

### Step 2: Access Dashboard
Open your browser and go to `http://localhost:5173`

### Step 3: Begin Marking
1. Click "Start Marking" button on Dashboard
2. Fill in student information:
   - **Student Name**: Enter the student's name
   - **Subject Name**: Enter the subject being graded
   - **Maximum Marks**: Total marks for the exam

3. Upload documents:
   - **Marking Guide**: Upload the guide showing correct answers and marks
   - **Student Paper**: Upload the student's exam paper

4. Click "Start AI Grading"

### Step 4: Review Results
The system will process the papers and display:
- Overall performance score
- Answer distribution (correct/incorrect)
- Weakness analysis with specific topics
- Student strengths
- Personalized recommendations
- Question-by-question breakdown with feedback

### Step 5: Grade Another
Click "Grade Another" to start marking a new paper

## API Endpoints

### Main Grading Endpoint
```
POST http://localhost:3000/api/grade-with-guide
```

**Request:**
- Multipart form data with:
  - `markingGuide`: PDF/Image of marking guide
  - `studentPaper`: PDF/Image of student paper
  - `studentName`: Student's name
  - `subjectName`: Subject name
  - `maxMarks`: Maximum marks

**Response:**
```json
{
  "success": true,
  "studentName": "John Doe",
  "subjectName": "Mathematics",
  "totalMarksObtained": 85,
  "maxMarks": 100,
  "percentage": 85,
  "questions": [
    {
      "questionNumber": 1,
      "status": "correct",
      "marksObtained": 10,
      "maxMarks": 10,
      "teacherComment": "Excellent work",
      "correctSolution": ""
    }
  ],
  "weaknessAnalytics": [
    {
      "topic": "Algebra",
      "accuracy": 70,
      "issues": ["Struggling with quadratic equations"]
    }
  ],
  "strengths": ["Strong in geometry", "Good problem-solving skills"],
  "recommendations": ["Practice more algebra problems", "Review quadratic equations"],
  "overallFeedback": "Good overall performance...",
  "processingTime": "5.23s"
}
```

### Health Check
```
GET http://localhost:3000/api/health
```

## File Format Support

- **Images**: JPG, JPEG, PNG
- **Documents**: PDF
- **Maximum file size**: 50MB per file

## How AI Grading Works

1. **Receives Input**: Marking guide and student paper
2. **Context Analysis**: Understands expected answers and grading criteria
3. **Comparison**: Compares student's answers against the guide
4. **Fair Assessment**: Awards marks based on accuracy and partial credit
5. **Feedback Generation**: Provides constructive comments
6. **Analysis**: Identifies weaknesses and strengths
7. **Recommendations**: Suggests areas for improvement

## Environment Variables

Backend `.env` file:
```
GOOGLE_API_KEY=your-key-here
```

## Troubleshooting

### "Failed to grade paper"
- Ensure backend server is running
- Check Google API key is valid
- Verify files are in supported format

### Files not uploading
- Check file size (max 50MB)
- Ensure file format is supported
- Check browser console for errors

### API Key errors
- Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create new API key if needed
- Update `.env` file
- Restart backend server

### CORS errors
- Ensure backend is running on port 3000
- Check frontend URL matches allowed origin
- Verify CORS is enabled in server.js

## Features Roadmap

- [ ] Batch grading multiple papers
- [ ] Grading history and database storage
- [ ] User authentication and accounts
- [ ] Custom grading criteria templates
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Mobile app version

## Performance Tips

1. **Optimize Images**: Compress images before uploading
2. **Clear Scans**: Use clear, well-lit scans for better AI recognition
3. **Complete Guide**: Provide comprehensive marking guide for accurate grading
4. **Batch Processing**: Process similar papers together for efficiency

## Support & Issues

For issues or feature requests:
1. Check the troubleshooting section
2. Review Google API documentation
3. Check browser console for error messages
4. Ensure all dependencies are installed

## License

This project is open-source and available for educational and commercial use.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Made with ❤️ for educators**
