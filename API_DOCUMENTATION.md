# AI Grading System - API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Currently no authentication required. For production, implement JWT or API key authentication.

---

## Endpoints

### 1. Grade with Marking Guide
**Endpoint:** `POST /api/grade-with-guide`

**Purpose:** Grade a student's exam paper using a marking guide as reference.

**Request Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `studentName` | string | Yes | Name of the student |
| `subjectName` | string | Yes | Subject/Course name |
| `maxMarks` | number | Yes | Maximum marks for the exam |
| `markingGuide` | file | Yes | PDF or Image of marking guide |
| `studentPaper` | file | Yes | PDF or Image of student's paper |

**Example cURL Request:**
```bash
curl -X POST http://localhost:3000/api/grade-with-guide \
  -F "studentName=John Doe" \
  -F "subjectName=Mathematics" \
  -F "maxMarks=100" \
  -F "markingGuide=@marking_guide.pdf" \
  -F "studentPaper=@student_paper.jpg"
```

**Success Response (200):**
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
      "teacherComment": "Excellent solution with clear working",
      "correctSolution": ""
    },
    {
      "questionNumber": 2,
      "status": "partial",
      "marksObtained": 7,
      "maxMarks": 10,
      "teacherComment": "Correct approach but made calculation error in final step",
      "correctSolution": "The final answer should be 42, not 40"
    },
    {
      "questionNumber": 3,
      "status": "incorrect",
      "marksObtained": 0,
      "maxMarks": 10,
      "teacherComment": "Attempted but concept is not clear",
      "correctSolution": "The correct method is to use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a"
    }
  ],
  "weaknessAnalytics": [
    {
      "topic": "Quadratic Equations",
      "accuracy": 50,
      "issues": [
        "Difficulty applying quadratic formula",
        "Calculation errors in complex problems"
      ]
    },
    {
      "topic": "Trigonometry",
      "accuracy": 70,
      "issues": [
        "Struggles with angle conversions"
      ]
    }
  ],
  "strengths": [
    "Strong understanding of basic algebra",
    "Clear mathematical working and presentation",
    "Good problem-solving methodology"
  ],
  "recommendations": [
    "Practice more quadratic equation problems with step-by-step solutions",
    "Review trigonometric identities and angle conversions",
    "Work on mental arithmetic and calculation accuracy",
    "Study worked examples for complex problem types"
  ],
  "overallFeedback": "John demonstrates a solid foundation in mathematics with clear understanding of basic concepts. The main areas for improvement are advanced algebra topics like quadratic equations and trigonometry. With targeted practice in these areas, significant improvement can be achieved.",
  "processingTime": "5.23s"
}
```

**Error Response (400):**
```json
{
  "error": "Both marking guide and student paper are required"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to grade paper"
}
```

---

### 2. Grade Multiple Papers (Legacy)
**Endpoint:** `POST /api/grade`

**Purpose:** Grade multiple exam papers without marking guide (legacy endpoint).

**Request Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | file[] | Yes | Array of PDF or Image files (max 10) |

**Example cURL Request:**
```bash
curl -X POST http://localhost:3000/api/grade \
  -F "files=@paper1.jpg" \
  -F "files=@paper2.jpg"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "marksObtained": 170,
    "marksMax": 200,
    "timeTaken": "8.45s",
    "timeSaved": "25.35s",
    "performanceAnalytics": {
      "averageScore": 85,
      "examsProcessed": 2,
      "totalCorrectAnswers": 17,
      "totalIncorrectAnswers": 3,
      "averageCorrectPercentage": 85
    },
    "gradingResults": [
      {
        "fileName": "paper1.jpg",
        "studentName": "Unknown",
        "totalMarksObtained": 85,
        "totalMaxMarks": 100,
        "totalPercentage": 85,
        "questions": [
          {
            "questionNumber": 1,
            "status": "correct",
            "marksObtained": 10,
            "maxMarks": 10,
            "teacherComment": "Correct",
            "correctSolution": ""
          }
        ]
      }
    ]
  }
}
```

---

### 3. Health Check
**Endpoint:** `GET /api/health`

**Purpose:** Check if server is running and healthy.

**Request Headers:** None

**Success Response (200):**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Response Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Missing or invalid parameters |
| 500 | Internal Server Error | Server error during processing |

---

## Request/Response Structure

### Question Object
```json
{
  "questionNumber": 1,
  "status": "correct|partial|incorrect",
  "marksObtained": 8,
  "maxMarks": 10,
  "teacherComment": "Feedback from AI teacher",
  "correctSolution": "Explanation of correct answer if needed"
}
```

### Weakness Analytics Object
```json
{
  "topic": "Topic Name",
  "accuracy": 75,
  "issues": [
    "Issue 1",
    "Issue 2"
  ]
}
```

---

## File Format Specifications

### Supported Formats
- **Images**: JPEG, JPG, PNG
- **Documents**: PDF
- **Maximum Size**: 50MB per file
- **Recommended DPI**: 150+ for clarity

### Best Practices
1. Ensure clear, legible scans or images
2. Avoid skewed or rotated documents
3. Make sure text is visible and not too small
4. Keep images well-lit and in focus
5. Compress large files before uploading

---

## Rate Limiting
Currently no rate limiting is implemented. For production deployment:
- Implement rate limiting (e.g., 100 requests per hour per IP)
- Add request throttling
- Monitor API usage

---

## Error Handling

### Common Errors and Solutions

**Error:** "Both marking guide and student paper are required"
- **Solution**: Ensure both files are uploaded

**Error:** "Invalid file type"
- **Solution**: Upload PDF or image files (JPG, PNG)

**Error:** "Failed to parse AI response"
- **Solution**: Try with clearer, higher-quality scan

**Error:** "GOOGLE_API_KEY not found"
- **Solution**: Set up `.env` file with valid API key

---

## Performance Considerations

### Typical Processing Times
- Single paper: 3-8 seconds
- Multiple papers: 2-3 seconds each
- Depends on file size and complexity

### Optimization Tips
1. Compress images to reduce file size
2. Use PNG for text-heavy documents
3. Clear, well-lit scans process faster
4. Batch similar subjects for better context

---

## Security Recommendations

### For Production
1. Add authentication (JWT tokens)
2. Implement rate limiting
3. Add input validation
4. Use HTTPS only
5. Add request logging
6. Implement CORS properly
7. Add request size limits
8. Sanitize file uploads
9. Store files securely
10. Add audit logging

---

## Integration Example (JavaScript/Fetch)

```javascript
async function gradeWithGuide(studentName, subjectName, maxMarks, markingGuideFile, studentPaperFile) {
  const formData = new FormData();
  formData.append('studentName', studentName);
  formData.append('subjectName', subjectName);
  formData.append('maxMarks', maxMarks);
  formData.append('markingGuide', markingGuideFile);
  formData.append('studentPaper', studentPaperFile);

  try {
    const response = await fetch('http://localhost:3000/api/grade-with-guide', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const result = await response.json();
    console.log('Grading result:', result);
    return result;
  } catch (error) {
    console.error('Grading failed:', error);
    throw error;
  }
}

// Usage
const markingGuide = document.getElementById('guideFile').files[0];
const studentPaper = document.getElementById('paperFile').files[0];

gradeWithGuide('John Doe', 'Mathematics', 100, markingGuide, studentPaper)
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

---

## Webhook Support (Future)
Currently not implemented. Planned for future versions to support:
- Async grading with webhook callbacks
- Batch processing with status updates
- Real-time progress notifications

---

## Version History

### v1.0 (Current)
- Initial release
- Grading with marking guide
- Basic analytics
- Gemini 1.5 Flash integration

### v1.1 (Planned)
- Batch processing
- User authentication
- Grading history database
- Custom templates

### v2.0 (Future)
- Mobile app
- Advanced analytics dashboard
- PDF report generation
- Integration with LMS

---

## Support & Contact

For API issues or questions:
1. Check this documentation
2. Review error messages
3. Check Google API status
4. Contact support with:
   - Error message
   - Request details
   - File samples (if possible)
