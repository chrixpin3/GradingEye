# Integration Guide - AI Grading System

This guide helps you integrate the AI Grading System into your existing applications or workflows.

---

## 📦 Installation Options

### Option 1: Direct Integration (Recommended)
Use the pre-built frontend and backend as-is.

### Option 2: API-Only Integration
Use just the backend API in your own application.

### Option 3: Component Integration
Extract and use individual React components.

---

## 🔌 API-Only Integration

### Setup
```bash
# Start only the backend
cd backend
npm install
npm start
```

### Basic API Usage
```javascript
// Example: Grade a paper using your own frontend
async function gradeStudentPaper() {
  const formData = new FormData();
  formData.append('studentName', 'John Doe');
  formData.append('subjectName', 'Mathematics');
  formData.append('maxMarks', 100);
  formData.append('markingGuide', guideFile); // File object
  formData.append('studentPaper', paperFile); // File object

  try {
    const response = await fetch('http://localhost:3000/api/grade-with-guide', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Grading results:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Response Format
```json
{
  "studentName": "John Doe",
  "subjectName": "Mathematics",
  "totalMarksObtained": 85,
  "maxMarks": 100,
  "percentage": 85,
  "questions": [...],
  "weaknessAnalytics": [...],
  "strengths": [...],
  "recommendations": [...],
  "overallFeedback": "..."
}
```

---

## ⚛️ React Component Integration

### Import Dashboard Component
```javascript
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
```

### Import Individual Components
```javascript
import MarkingForm from './components/MarkingForm';
import GradingResults from './components/GradingResults';

// Use components separately
function MyGradingApp() {
  const [results, setResults] = useState(null);
  
  return (
    <div>
      <MarkingForm onSubmit={(data) => setResults(data)} />
      {results && <GradingResults data={results} />}
    </div>
  );
}
```

---

## 🎓 LMS Integration Examples

### Moodle Integration
```php
// Moodle activity module integration
function submit_to_ai_grader($student_id, $marking_guide, $student_paper) {
  $curl = curl_init();
  
  $post_data = array(
    'studentName' => get_student_name($student_id),
    'subjectName' => get_course_name(),
    'maxMarks' => 100,
    'markingGuide' => new CURLFile($marking_guide),
    'studentPaper' => new CURLFile($student_paper)
  );
  
  curl_setopt($curl, CURLOPT_URL, 'http://localhost:3000/api/grade-with-guide');
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
  
  $result = curl_exec($curl);
  curl_close($curl);
  
  return json_decode($result);
}
```

### Canvas Integration
```javascript
// Canvas API integration
async function submitToAIGrader(assignmentId, studentId, submissionFile, rubric) {
  // Get marking guide from Canvas rubric
  const markingGuide = generateGuideFromRubric(rubric);
  
  const formData = new FormData();
  formData.append('studentName', studentId);
  formData.append('subjectName', assignmentId);
  formData.append('maxMarks', rubric.pointsPossible);
  formData.append('markingGuide', markingGuide);
  formData.append('studentPaper', submissionFile);
  
  const response = await fetch('http://localhost:3000/api/grade-with-guide', {
    method: 'POST',
    body: formData
  });
  
  const gradingResult = await response.json();
  
  // Post grade back to Canvas
  await postGradeToCanvas(assignmentId, studentId, gradingResult);
}
```

### Blackboard Integration
```javascript
// Blackboard integration example
async function integrateBoardWithAIGrader(courseId, assignmentId) {
  // Fetch submissions from Blackboard
  const submissions = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}/submissions`);
  const data = await submissions.json();
  
  // Grade each submission
  for (const submission of data.results) {
    const gradingResult = await gradeWithAI(
      submission.body.files[0],
      getCourseMarkingGuide(courseId)
    );
    
    // Update grade in Blackboard
    await updateBBGrade(submission.id, gradingResult.percentage);
  }
}
```

---

## 🔄 Workflow Integration

### School Management System Integration
```javascript
// Example: School Management System workflow
class GradingWorkflow {
  async processClassExams(classId, subject, examDate) {
    // 1. Get exam papers from system
    const papers = await this.getExamPapers(classId, subject, examDate);
    
    // 2. Get marking guide for subject/exam
    const markingGuide = await this.getMarkingGuide(subject, examDate);
    
    // 3. Grade each paper
    const results = [];
    for (const paper of papers) {
      const grading = await this.gradeWithAI(markingGuide, paper);
      results.push({
        studentId: paper.studentId,
        grading: grading
      });
    }
    
    // 4. Store results in system
    await this.saveGradingResults(results);
    
    // 5. Generate reports
    const report = this.generateAnalyticsReport(results);
    return report;
  }
  
  async gradeWithAI(markingGuide, paper) {
    const formData = new FormData();
    formData.append('studentName', paper.studentName);
    formData.append('subjectName', paper.subject);
    formData.append('maxMarks', paper.maxMarks);
    formData.append('markingGuide', markingGuide);
    formData.append('studentPaper', paper.file);
    
    return await fetch('http://localhost:3000/api/grade-with-guide', {
      method: 'POST',
      body: formData
    }).then(r => r.json());
  }
}
```

---

## 🌐 Web Application Integration

### Express.js Integration
```javascript
const express = require('express');
const app = express();

// Proxy endpoint
app.post('/grade', async (req, res) => {
  try {
    const { studentName, subjectName, maxMarks, files } = req.body;
    
    const formData = new FormData();
    formData.append('studentName', studentName);
    formData.append('subjectName', subjectName);
    formData.append('maxMarks', maxMarks);
    formData.append('markingGuide', files.guide);
    formData.append('studentPaper', files.paper);
    
    const response = await fetch('http://localhost:3000/api/grade-with-guide', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001);
```

### Django Integration
```python
# Django views.py
from django.shortcuts import render
from django.http import JsonResponse
import requests

def grade_exam(request):
    if request.method == 'POST':
        marking_guide = request.FILES['marking_guide']
        student_paper = request.FILES['student_paper']
        student_name = request.POST['student_name']
        subject = request.POST['subject']
        max_marks = request.POST['max_marks']
        
        # Prepare request
        files = {
            'markingGuide': marking_guide,
            'studentPaper': student_paper
        }
        data = {
            'studentName': student_name,
            'subjectName': subject,
            'maxMarks': max_marks
        }
        
        # Call AI Grader API
        response = requests.post(
            'http://localhost:3000/api/grade-with-guide',
            files=files,
            data=data
        )
        
        return JsonResponse(response.json())
```

### Laravel Integration
```php
// Laravel controller
namespace App\Http\Controllers;

class GradingController extends Controller
{
    public function gradeExam(Request $request)
    {
        $client = new \GuzzleHttp\Client();
        
        $response = $client->post('http://localhost:3000/api/grade-with-guide', [
            'multipart' => [
                [
                    'name' => 'markingGuide',
                    'contents' => fopen($request->file('marking_guide'), 'r')
                ],
                [
                    'name' => 'studentPaper',
                    'contents' => fopen($request->file('student_paper'), 'r')
                ],
                ['name' => 'studentName', 'contents' => $request->student_name],
                ['name' => 'subjectName', 'contents' => $request->subject],
                ['name' => 'maxMarks', 'contents' => $request->max_marks]
            ]
        ]);
        
        return response()->json(json_decode($response->getBody()));
    }
}
```

---

## 🔐 Security Considerations for Integration

### 1. API Authentication
```javascript
// Add API key to protect your endpoint
const API_KEY = process.env.AI_GRADER_KEY;

app.post('/grade', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Process grading...
});
```

### 2. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/grade', limiter, async (req, res) => {
  // Process grading...
});
```

### 3. File Validation
```javascript
const validateFile = (file) => {
  const allowed = ['pdf', 'jpg', 'jpeg', 'png'];
  const ext = file.mimetype.split('/')[1];
  
  if (!allowed.includes(ext)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('File too large');
  }
};
```

### 4. Input Sanitization
```javascript
const validator = require('validator');

const validateInput = (data) => {
  return {
    studentName: validator.trim(validator.escape(data.studentName)),
    subjectName: validator.trim(validator.escape(data.subjectName)),
    maxMarks: validator.toInt(data.maxMarks)
  };
};
```

---

## 📊 Data Integration

### Saving Results to Database
```javascript
// MongoDB integration
const mongoose = require('mongoose');

const gradingSchema = new mongoose.Schema({
  studentName: String,
  subjectName: String,
  maxMarks: Number,
  totalMarksObtained: Number,
  percentage: Number,
  questions: Array,
  weaknessAnalytics: Array,
  strengths: Array,
  recommendations: Array,
  createdAt: { type: Date, default: Date.now }
});

const Grading = mongoose.model('Grading', gradingSchema);

// Save grading result
async function saveGradingResult(gradingData) {
  const grading = new Grading(gradingData);
  await grading.save();
}
```

### Bulk Operations
```javascript
// Batch process multiple exams
async function batchGradeExams(exams) {
  const results = [];
  
  for (const exam of exams) {
    try {
      const result = await gradeWithAI(
        exam.markingGuide,
        exam.studentPaper,
        exam.studentName,
        exam.subject,
        exam.maxMarks
      );
      results.push({ success: true, ...result });
    } catch (error) {
      results.push({ success: false, error: error.message, exam: exam.id });
    }
  }
  
  return results;
}
```

---

## 📱 Mobile App Integration

### React Native Integration
```javascript
// React Native example
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

async function gradeWithMobile() {
  const guideDoc = await DocumentPicker.getDocumentAsync();
  const paperImage = await ImagePicker.launchCameraAsync();
  
  const formData = new FormData();
  formData.append('studentName', studentName);
  formData.append('subjectName', subject);
  formData.append('maxMarks', maxMarks);
  formData.append('markingGuide', {
    uri: guideDoc.uri,
    type: guideDoc.mimeType,
    name: guideDoc.name
  });
  formData.append('studentPaper', {
    uri: paperImage.uri,
    type: 'image/jpeg',
    name: 'student-paper.jpg'
  });
  
  fetch('http://your-api.com/grade', {
    method: 'POST',
    body: formData
  });
}
```

---

## 🚀 Deployment Integration

### Docker Integration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend . .

EXPOSE 3000
CMD ["npm", "start"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-grader
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-grader
  template:
    metadata:
      labels:
        app: ai-grader
    spec:
      containers:
      - name: api
        image: ai-grader:latest
        ports:
        - containerPort: 3000
        env:
        - name: GOOGLE_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: google-key
```

---

## ✅ Integration Checklist

- [ ] Backend API running on correct port
- [ ] Google API key configured
- [ ] File upload paths configured
- [ ] CORS settings verified
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Input validation added
- [ ] API authentication added
- [ ] Logging configured
- [ ] Database connection established
- [ ] Testing completed
- [ ] Documentation updated

---

## 📞 Support

For integration questions or issues:
1. Check API Documentation
2. Review integration examples
3. Check your backend logs
4. Test API endpoints directly

Good luck with your integration! 🚀
