// Configuration for the grading system
export const API_CONFIG = {
  // API Base URL
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Endpoints
  ENDPOINTS: {
    GRADE_WITH_GUIDE: '/api/grade-with-guide',
    GRADE_MULTIPLE: '/api/grade',
    HEALTH: '/api/health',
  },
  
  // File upload settings
  UPLOAD: {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  
  // Request settings
  REQUEST: {
    TIMEOUT: 300000, // 5 minutes
    HEADERS: {
      'Accept': 'application/json',
    },
  },
};

// Validation rules
export const VALIDATION = {
  STUDENT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z\s'-]+$/,
  },
  SUBJECT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9\s'-]+$/,
  },
  MAX_MARKS: {
    MIN: 1,
    MAX: 1000,
  },
};

// UI Settings
export const UI_CONFIG = {
  // Animation durations (ms)
  ANIMATION_DURATION: 300,
  LOADER_SPIN_DURATION: 1000,
  
  // Toast/Alert display time (ms)
  ALERT_DISPLAY_TIME: 5000,
  
  // Colors for performance grades
  GRADE_COLORS: {
    'A': '#22c55e', // Green
    'B': '#3b82f6', // Blue
    'C': '#eab308', // Yellow
    'D': '#f97316', // Orange
    'F': '#ef4444', // Red
  },
};

// Grade thresholds
export const GRADE_THRESHOLDS = {
  'A': { min: 90, max: 100 },
  'B': { min: 80, max: 89 },
  'C': { min: 70, max: 79 },
  'D': { min: 60, max: 69 },
  'F': { min: 0, max: 59 },
};

export default API_CONFIG;
