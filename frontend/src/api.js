import { API_CONFIG } from './config.js';

class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Make an API call
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<object>} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.REQUEST.HEADERS,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Grade a paper with marking guide
   * @param {object} data - Grading data
   * @returns {Promise<object>} Grading results
   */
  async gradeWithGuide(data) {
    const formData = new FormData();
    formData.append('studentName', data.studentName);
    formData.append('subjectName', data.subjectName);
    formData.append('maxMarks', data.maxMarks);
    formData.append('markingGuide', data.markingGuide);
    formData.append('studentPaper', data.studentPaper);

    return this.request(API_CONFIG.ENDPOINTS.GRADE_WITH_GUIDE, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Grade multiple papers (legacy)
   * @param {File[]} files - Array of paper files
   * @returns {Promise<object>} Grading results
   */
  async gradeMultiple(files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.request(API_CONFIG.ENDPOINTS.GRADE_MULTIPLE, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Check API health
   * @returns {Promise<object>} Health status
   */
  async checkHealth() {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH);
  }

  /**
   * Generate AI content
   * @param {string} prompt - The prompt to send to Gemini
   * @returns {Promise<object>} Generated content
   */
  async generateAIContent(prompt) {
    return this.request('/api/generate-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
  }
}

export default new APIClient();
