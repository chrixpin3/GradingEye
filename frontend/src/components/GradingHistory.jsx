import React, { useState, useMemo, useEffect } from "react";
import {
  FiSearch, FiFilter, FiMoreHorizontal, FiTrendingUp, FiUsers, FiAward, FiMessageSquare, FiX, FiCheckCircle, FiActivity, FiTrash2, FiChevronDown, FiCalendar, FiBookOpen, FiUser, FiZap
} from "react-icons/fi";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import bgImage from "../assets/bg.jpeg";
import { useLanguage } from "../context/LanguageContext";
import { API_CONFIG } from "../config";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
const VIBRANT_GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-violet-600 to-purple-700'
];

function GradingHistory() {
  const { t } = useLanguage();
  const [gradingHistory, setGradingHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, name, score, course
  const [filterStatus, setFilterStatus] = useState("all"); // all, Excellent, Good, Poor, etc.
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Fetch data from backend
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/history`);
        const result = await response.json();
        if (result.success) {
          setGradingHistory(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(t('serverConnectionFailed'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(t('deleteRecordConfirm'))) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/history/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setGradingHistory(prev => prev.filter(item => item._id !== id));
        if (selectedStudent?._id === id) setSelectedStudent(null);
      } else {
        alert("Failed to delete record: " + result.error);
      }
    } catch (err) {
      alert("Error deleting record. Please check your connection.");
    }
  };

  // Aggregated Stats
  const stats = useMemo(() => {
    if (gradingHistory.length === 0) return { total: 0, avgScore: 0, topPerformer: { student_name: "N/A" } };
    const total = gradingHistory.length;
    const avgScore = Math.round(gradingHistory.reduce((acc, curr) => acc + (curr.overall_percentage || 0), 0) / total);
    const topPerformer = gradingHistory.reduce((prev, current) => ((prev.total_marks || 0) > (current.total_marks || 0)) ? prev : current);
    return { total, avgScore, topPerformer };
  }, [gradingHistory]);

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return gradingHistory
      .filter(item => {
        const matchesSearch = (item.student_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.course_name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || item.overall_performance === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return (a.student_name || "").localeCompare(b.student_name || "");
        if (sortBy === "score") return b.overall_percentage - a.overall_percentage;
        if (sortBy === "course") return (a.course_name || "").localeCompare(b.course_name || "");
        if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
      });
  }, [gradingHistory, searchTerm, sortBy, filterStatus]);

  // Student Specific Data (for Dashboard View)
  const studentStats = useMemo(() => {
    if (!selectedStudent) return null;
    const records = gradingHistory.filter(r => r.student_name === selectedStudent.student_name);
    const avg = Math.round(records.reduce((acc, r) => acc + (r.overall_percentage || 0), 0) / records.length);

    // Prepare Graph Data
    const progressData = records
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(r => ({
        date: new Date(r.createdAt).toLocaleDateString(),
        score: r.overall_percentage,
        course: r.course_name
      }));

    // Radar Chart Data (Subjects/Topics)
    // For simplicity, we use the course performance average
    const courses = [...new Set(records.map(r => r.course_name))];
    const radarData = courses.map(course => {
      const courseRecords = records.filter(r => r.course_name === course);
      return {
        subject: course,
        A: Math.round(courseRecords.reduce((a, b) => a + (b.overall_percentage || 0), 0) / courseRecords.length),
        fullMark: 100
      };
    });

    return { records, avg, progressData, radarData };
  }, [selectedStudent, gradingHistory]);

  // Download Report Function
  const downloadReport = (student) => {
    if (!student) return;

    const studentRecords = gradingHistory.filter(r => r.student_name === student.student_name);
    const avgScore = Math.round(studentRecords.reduce((acc, r) => acc + (r.overall_percentage || 0), 0) / studentRecords.length);

    // Create HTML content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grading Report - ${student.student_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      color: #333;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 36px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    .student-info {
      background: #f8f9fa;
      padding: 30px 40px;
      border-bottom: 3px solid #667eea;
    }
    .student-info h2 {
      font-size: 28px;
      color: #667eea;
      margin-bottom: 20px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    .info-item {
      background: white;
      padding: 15px;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h3 {
      font-size: 22px;
      color: #667eea;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e9ecef;
    }
    .score-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      margin-bottom: 30px;
    }
    .score-card .score {
      font-size: 72px;
      font-weight: 900;
      margin: 20px 0;
    }
    .score-card .label {
      font-size: 18px;
      opacity: 0.9;
    }
    .assessment-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .assessment-table th {
      background: #f8f9fa;
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #667eea;
      border-bottom: 2px solid #667eea;
    }
    .assessment-table td {
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
    }
    .assessment-table tr:hover {
      background: #f8f9fa;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-excellent { background: #d4edda; color: #155724; }
    .badge-good { background: #d1ecf1; color: #0c5460; }
    .badge-average { background: #fff3cd; color: #856404; }
    .badge-poor { background: #f8d7da; color: #721c24; }
    .feedback-box {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 10px;
      border-left: 4px solid #667eea;
      font-style: italic;
      color: #555;
      line-height: 1.8;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px 40px;
      text-align: center;
      color: #666;
      font-size: 14px;
      border-top: 3px solid #667eea;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Student Grading Report</h1>
      <p>Comprehensive Performance Analysis</p>
    </div>

    <div class="student-info">
      <h2>${student.student_name}</h2>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Student ID</div>
          <div class="info-value">#${student._id.slice(-8)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Total Assessments</div>
          <div class="info-value">${studentRecords.length}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Report Generated</div>
          <div class="info-value">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Overall Average</div>
          <div class="info-value">${avgScore}%</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="score-card">
        <div class="label">Current Assessment Score</div>
        <div class="score">${student.overall_percentage}%</div>
        <div class="label">${student.overall_performance}</div>
      </div>

      <div class="section">
        <h3>📝 Assessment Details</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Course</div>
            <div class="info-value">${student.course_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date</div>
            <div class="info-value">${new Date(student.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Total Marks</div>
            <div class="info-value">${student.total_marks} / ${student.max_total_marks}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Questions</div>
            <div class="info-value">${student.number_of_questions}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>💬 Teacher's Feedback</h3>
        <div class="feedback-box">
          "${student.teacher_feedback || 'No feedback provided for this assessment.'}"
        </div>
      </div>

      <div class="section">
        <h3>📈 Assessment History</h3>
        <table class="assessment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Course</th>
              <th>Score</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            ${studentRecords.map(record => `
              <tr>
                <td>${new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>${record.course_name}</td>
                <td><strong>${record.overall_percentage}%</strong></td>
                <td>
                  <span class="badge ${record.overall_percentage >= 90 ? 'badge-excellent' :
        record.overall_percentage >= 70 ? 'badge-good' :
          record.overall_percentage >= 50 ? 'badge-average' : 'badge-poor'
      }">
                    ${record.overall_performance}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="footer">
      <p><strong>GradingApp</strong> - Automated Grading System</p>
      <p>Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${student.student_name.replace(/\s+/g, '_')}_Grading_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div
      className="w-full relative min-h-screen p-4 sm:p-8"
      style={{
        backgroundImage: `linear-gradient(rgba(23, 23, 117, 0.45), rgb(1, 14, 78), rgba(6, 74, 15, 0.62), rgba(3, 22, 61, 0.71), rgba(14, 16, 66, 0.67)), url(${bgImage})`,
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-[1600px] mx-auto w-full">

        {/* HEADER & GLOBAL STATS */}
        <div className="mb-8">
          <center><h1 className="text-4xl font-bold text-green-500 mb-2">{t('performanceAnalytics')}</h1>
            <p className="text-slate-400 text-blue-500 mb-8">{t('gradingOverview')}</p>
          </center><br />
          {/* GLOBAL STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mb-12">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/20 p-6 sm:p-8 rounded flex items-center gap-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-blue-900/10">
              <div className="p-4 sm:p-5 bg-blue-500/10 rounded text-blue-400 shadow-inner group-hover:scale-110 transition-transform"><FiTrendingUp size={28} /></div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">{t('classAverage')}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stats.avgScore}%</h3>
              </div>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 p-6 sm:p-8 rounded flex items-center gap-6 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-purple-900/10">
              <div className="p-4 sm:p-5 bg-purple-500/10 rounded text-purple-400 shadow-inner group-hover:scale-110 transition-transform"><FiUsers size={28} /></div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">{t('assessments')}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stats.total}</h3>
              </div>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 p-6 sm:p-8 rounded flex items-center gap-6 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-emerald-900/10 sm:col-span-2 lg:col-span-1">
              <div className="p-4 sm:p-5 bg-emerald-500/10 rounded text-emerald-400 shadow-inner group-hover:scale-110 transition-transform"><FiAward size={28} /></div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">{t('topPerformer')}</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white truncate max-w-[180px] sm:max-w-none tracking-tight">{stats.topPerformer.student_name}</h3>
              </div>
            </div>
          </div><br />

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-[#1e293b]/30 rounded-3xl border border-[#334155]">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-medium">Loading grading history...</p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded text-red-400">
              <p className="font-bold mb-2">Error Connection</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* MAIN CHART AREA */}
          {/* MAIN CHART AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-16">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 rounded h-[350px] sm:h-[400px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                {t('gradeTrends')}
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={[...gradingHistory].reverse().slice(0, 10)}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="createdAt" tickFormatter={(str) => new Date(str).toLocaleDateString()} stroke="#94a3b8" tick={{ fontSize: 12 }} dy={10} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, 100]} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Area type="monotone" dataKey="overall_percentage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 rounded h-[350px] sm:h-[400px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                {t('subjectDistribution')}
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={gradingHistory.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="course_name" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} dy={10} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} dx={-10} />
                  <Tooltip
                    cursor={{ fill: '#334155', opacity: 0.2 }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="overall_percentage" radius={[8, 8, 0, 0]} barSize={45}>
                    {gradingHistory.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <br />
          {/* SEARCH & FILTER */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-6 sm:gap-8">
            <div className="relative group w-full max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <FiSearch className="h-6 w-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="block w-full bg-slate-900/60 border border-slate-700/50 text-white pl-14 pr-6 py-5 rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 backdrop-blur-xl transition-all shadow-lg placeholder:text-slate-600 font-medium"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className={`flex items-center gap-2 px-6 py-4 sm:py-5 rounded bg-slate-900/60 border border-slate-700/50 text-slate-400 hover:text-white transition-all backdrop-blur-xl font-bold uppercase tracking-widest text-[10px] sm:text-[11px] ${isFilterMenuOpen ? 'border-blue-500/50 text-blue-400' : ''}`}
                >
                  <FiFilter size={18} />
                  <span>{t('sortFilter')}</span>
                  <FiChevronDown className={`transition-transform duration-300 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-4 w-[calc(100vw-2rem)] sm:w-96 bg-[#0f172a]/95 backdrop-blur-2xl border border-slate-700/60 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] z-50 p-6 sm:p-10 animate-slide-up no-print overflow-hidden ring-1 ring-white/5 mx-4 sm:mx-0">
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none"></div>

                    <div className="relative z-10 space-y-10">
                      {/* HEADER */}
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-5">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">{t('refineHistory')}</h4>
                        <button
                          onClick={() => { setSortBy("date"); setFilterStatus("all"); }}
                          className="text-[10px] text-slate-500 hover:text-blue-400 font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
                        >
                          <FiTrash2 size={12} className="group-hover:shake" />
                          {t('reset')}
                        </button>
                      </div>

                      {/* SORT SECTION */}
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('sortPriority')}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'date', label: t('recentFirst'), icon: <FiCalendar /> },
                            { id: 'name', label: t('studentAZ'), icon: <FiUser /> },
                            { id: 'score', label: t('topScore'), icon: <FiZap /> },
                            { id: 'course', label: t('coursePath'), icon: <FiBookOpen /> }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setSortBy(opt.id)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 ${sortBy === opt.id ? 'bg-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] scale-[1.02]' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800/70 border border-transparent hover:border-slate-700/50'}`}
                            >
                              <span className={`${sortBy === opt.id ? 'text-white' : 'text-blue-500/60'}`}>{opt.icon}</span>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* FILTER SECTION */}
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('performanceFilter')}</p>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {['all', 'Excellent', 'Very Good', 'Good', 'Satisfactory', 'Failed'].map(status => (
                            <button
                              key={status}
                              onClick={() => setFilterStatus(status)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest border ${filterStatus === status ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)]' : 'bg-slate-800/40 border-slate-700/30 text-slate-500 hover:text-slate-300 hover:border-slate-600'}`}
                            >
                              {status === 'all' ? t('showAll') : status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div><br />
        </div>

        {/* DATA TABLE */}
        {/* DATA TABLE */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded overflow-hidden shadow-2xl mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-[0.2em] font-bold">
                    <th className="px-10 py-6 border-b border-slate-700/50">{t('student')}</th>
                    <th className="px-10 py-6 border-b border-slate-700/50">{t('course')}</th>
                    <th className="px-10 py-6 border-b border-slate-700/50">{t('date')}</th>
                    <th className="px-10 py-6 border-b border-slate-700/50 text-center">{t('score')}</th>
                    <th className="px-10 py-6 border-b border-slate-700/50">{t('status')}</th>
                    <th className="px-10 py-6 border-b border-slate-700/50 text-right">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filteredData.map((record, idx) => (
                    <tr key={record._id} className="group hover:bg-slate-700/20 transition-all duration-300">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded bg-gradient-to-tr ${VIBRANT_GRADIENTS[idx % VIBRANT_GRADIENTS.length]} flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/10`}>
                            {(record.student_name || "S").charAt(0)}
                          </div>
                          <span className="text-slate-100 font-bold text-lg">{record.student_name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-slate-300 font-medium">{record.course_name}</span>
                          <span className="text-[10px] text-slate-500 tracking-widest mt-1 uppercase">Curriculum 2024</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-slate-400 text-sm font-medium">
                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-10 rounded-xl font-black text-lg ${record.overall_percentage >= 90 ? 'bg-green-500/10 text-green-400' : record.overall_percentage >= 80 ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {record.overall_percentage}%
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${['Excellent', 'Very Good'].includes(record.overall_performance) ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-md shadow-green-900/10' :
                          ['Good', 'Satisfactory'].includes(record.overall_performance) ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-md shadow-blue-900/10' :
                            'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-md shadow-amber-900/10'
                          }`}>
                          {record.overall_performance}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setSelectedStudent(record)}
                            className="px-6 py-2 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-xs transition-all duration-300 transform active:scale-95 shadow-sm shadow-blue-900/10 uppercase tracking-widest"
                          >
                            {t('report')}
                          </button>
                          <button
                            onClick={(e) => handleDelete(record._id, e)}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 transform active:scale-95 group/del"
                            title="Delete Record"
                          >
                            <FiTrash2 size={18} className="group-hover/del:rotate-12 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !error && filteredData.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-600"><FiSearch size={32} /></div>
              <p className="text-slate-500 font-bold text-xl">{t('noRecordsFound')}</p>
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes slide-up {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px) rotate(-1deg); }
            75% { transform: translateX(2px) rotate(1deg); }
          }
          .animate-slide-up {
            animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          .group:hover .group-hover\\:shake {
            animation: shake 0.4s ease-in-out infinite;
          }
        `}} />

        {/* STUDENT DASHBOARD MODAL */}
        {selectedStudent && studentStats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0f172a] border border-[#334155] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-slide-up">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-6 right-6 p-2 bg-[#1e293b] rounded-full text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition"
              >
                <FiX size={20} />
              </button>

              {/* DASHBOARD HEADER */}
              <div className="p-6 sm:p-8 border-b border-[#334155] bg-gradient-to-r from-[#1e293b] to-[#0f172a]">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl sm:text-4xl text-white font-bold shadow-xl border-2 border-[#334155]">
                    {(selectedStudent.student_name || "S").charAt(0)}
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{selectedStudent.student_name}</h2>
                    <p className="text-slate-400 flex items-center justify-center sm:justify-start gap-2 text-sm">
                      <FiCheckCircle className="text-green-500" />
                      ID: {selectedStudent._id.slice(-6)} • {studentStats.records.length} {t('assessmentsCompleted')}
                    </p>
                  </div>
                  <div className="sm:ml-auto text-center sm:text-right">
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">{t('averageScore')}</p>
                    <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                      {studentStats.avg}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COL: GRAPHS */}
                <div className="lg:col-span-2 space-y-8">

                  {/* Performance Radar */}
                  <div className="bg-[#1e293b]/30 border border-[#334155] p-4 sm:p-6 rounded">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm sm:text-base">
                      <FiActivity size={20} className="text-purple-400" /> {t('skillAnalysis')}
                    </h3>
                    <div className="h-[250px] sm:h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={studentStats.radarData}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name={selectedStudent.studentName} dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.3} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="bg-[#1e293b]/30 border border-[#334155] p-4 sm:p-6 rounded">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm sm:text-base">
                      <FiTrendingUp size={20} className="text-green-400" /> {t('progressOverTime')}
                    </h3>
                    <div className="h-[200px] sm:h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={studentStats.progressData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                          <YAxis stroke="#94a3b8" domain={[0, 100]} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                          <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* RIGHT COL: FEEDBACK */}
                <div className="space-y-6">
                  <div className="bg-[#1e293b] border border-[#334155] p-6 rounded h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <FiMessageSquare size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{t('feedback')}</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Latest Comment */}
                      <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">{t('feedback')}</p>
                        <p className="text-slate-300 italic leading-relaxed">"{selectedStudent.teacher_feedback || t('noFeedbackProvided')}"</p>
                        <p className="text-right text-xs text-slate-500 mt-3">— {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>

                      {/* Stats Section */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] p-4 rounded-xl border border-[#334155]">
                          <p className="text-slate-500 text-xs uppercase mb-1">{t('totalMarks')}</p>
                          <p className="text-white font-bold">{selectedStudent.total_marks} / {selectedStudent.max_total_marks}</p>
                        </div>
                        <div className="bg-[#0f172a] p-4 rounded-xl border border-[#334155]">
                          <p className="text-slate-500 text-xs uppercase mb-1">{t('questions')}</p>
                          <p className="text-white font-bold">{selectedStudent.number_of_questions}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => downloadReport(selectedStudent)}
                      className="w-full mt-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-900/20"
                    >
                      {t('downloadReport')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default GradingHistory;
