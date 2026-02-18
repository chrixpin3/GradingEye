import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    student_name: {
        type: String,
        default: ''
    },
    course_name: {
        type: String,
        default: ''
    },
    number_of_questions: {
        type: Number,
        required: true
    },
    student_answers: [
        {
            question_number: mongoose.Schema.Types.Mixed, // Can be number or string like "17 b"
            question_text: mongoose.Schema.Types.Mixed, // Can be string or array
            correct_answer: mongoose.Schema.Types.Mixed, // Can be string or array
            student_answer: mongoose.Schema.Types.Mixed, // Can be string or array
            graded_marks: Number,
            max_marks: Number,
            status: {
                type: String,
                enum: ['correct', 'partial', 'wrong']
            }
        }
    ],
    total_marks: Number,
    max_total_marks: Number,
    overall_percentage: Number,
    overall_performance: {
        type: String,
        enum: ['Excellent', 'Very Good', 'Good', 'Satisfactory', 'Sufficient', 'Poor', 'Failed']
    },
    teacher_feedback: String,
    integrity_analysis: {
        is_clean: { type: Boolean, default: true },
        flags: [String],
        evidence: String,
        confidence: String
    }
}, {
    timestamps: true
});

const Response = mongoose.model('Response', responseSchema, 'corrected');

export default Response;
