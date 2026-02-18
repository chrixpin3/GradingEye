import React, { useState, useEffect, useMemo } from "react";
import {
  FiCheckCircle,
  FiActivity,
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiZap
} from "react-icons/fi";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import bgImage from "../assets/bg.jpeg";
import { useLanguage } from "../context/LanguageContext";
import { API_CONFIG } from "../config";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function Dashboard() {
  const { t } = useLanguage();
  const [gradingHistory, setGradingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setError(t('failedConnectBackend'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate passing rate data (students with >= 50%)
  const passingRateData = useMemo(() => {
    if (gradingHistory.length === 0) return [];

    // Group by date and calculate passing rate
    const dateGroups = {};
    gradingHistory.forEach(item => {
      const date = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dateGroups[date]) {
        dateGroups[date] = { total: 0, passed: 0 };
      }
      dateGroups[date].total++;
      if (item.overall_percentage >= 50) {
        dateGroups[date].passed++;
      }
    });

    return Object.entries(dateGroups).slice(-12).map(([date, data]) => ({
      date,
      rate: Math.round((data.passed / data.total) * 100),
      passed: data.passed,
      total: data.total
    }));
  }, [gradingHistory]);

  // Recent 5 students
  const recentStudents = useMemo(() => {
    return gradingHistory.slice(0, 5);
  }, [gradingHistory]);

  // Overall class performance
  const classPerformance = useMemo(() => {
    if (gradingHistory.length === 0) return 0;
    const totalScore = gradingHistory.reduce((acc, curr) => acc + (curr.overall_percentage || 0), 0);
    return Math.round(totalScore / gradingHistory.length);
  }, [gradingHistory]);

  // Time metrics (assuming 15 min manual vs 30s AI)
  const timeMetrics = useMemo(() => {
    const totalGraded = gradingHistory.length;
    const manualMinutes = totalGraded * 15; // 15 min per paper
    const aiMinutes = Math.round(totalGraded * 0.5); // 0.5 min (30s) per paper
    const savedMinutes = manualMinutes - aiMinutes;

    return {
      manualMinutes,
      aiMinutes,
      savedMinutes,
      efficiencyRatio: manualMinutes > 0 ? (savedMinutes / manualMinutes) : 0
    };
  }, [gradingHistory]);

  // Performance distribution for pie chart
  const performanceDistribution = useMemo(() => {
    const excellent = gradingHistory.filter(item => item.overall_percentage >= 80).length;
    const good = gradingHistory.filter(item => item.overall_percentage >= 60 && item.overall_percentage < 80).length;
    const average = gradingHistory.filter(item => item.overall_percentage >= 40 && item.overall_percentage < 60).length;
    const poor = gradingHistory.filter(item => item.overall_percentage < 40).length;

    return [
      { name: `${t('excellent')} (80-100%)`, value: excellent, color: '#10b981' },
      { name: `${t('good')} (60-79%)`, value: good, color: '#3b82f6' },
      { name: `${t('average')} (40-59%)`, value: average, color: '#f59e0b' },
      { name: `${t('poor')} (<40%)`, value: poor, color: '#ef4444' }
    ];
  }, [gradingHistory]);

  return (
    <div
      className="w-full relative min-h-screen px-4 sm:px-6 lg:px-12 py-8 custom-scrollbar"
      style={{
        backgroundImage: `linear-gradient(rgba(23, 23, 117, 0.45), rgb(1, 14, 78), rgba(6, 74, 15, 0.62), rgba(3, 22, 61, 0.71), rgba(14, 16, 66, 0.67)), url(${bgImage})`,
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-[1600px] mx-auto w-full">

        {/* Header */}
        <div className="mb-8">
          <center>
            <h1 className="text-3xl sm:text-4xl font-bold text-green-500 mb-2">{t('dashboardOverview')}</h1>
            <p className="text-slate-400 text-blue-500 text-base sm:text-lg">{t('trackPerformance')}</p>
          </center>
        </div><br />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

          {/* Left Column - Passing Rate Chart (2 cols wide) */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 shadow-2xl hover:border-blue-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{t('passingRate')}</h2>
                <p className="text-sm text-slate-400">{t('trackSuccess')}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">{t('totalGraded')}</div>
                <div className="text-3xl font-bold text-white">{gradingHistory.length}</div>
              </div>
            </div>

            <div className="h-[280px] sm:h-[320px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400">{t('loadingChart')}</div>
              ) : passingRateData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={passingRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                      formatter={(value, name, props) => [
                        `${value}% (${props.payload.passed}/${props.payload.total})`,
                        'Passing Rate'
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 5 }}
                      activeDot={{ r: 7, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">{t('noRecordsFound')}</div>
              )}
            </div>
          </div>

          {/* Right Column - Recent Students */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl hover:border-purple-500/40 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">{t('recentStudents')}</h2>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-slate-400 py-8">...</div>
              ) : recentStudents.length > 0 ? (
                recentStudents.map((student, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-700/40 hover:border-blue-500/30 transition-all">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {(student.student_name || 'S').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{student.student_name}</p>
                      <p className="text-xs text-slate-400">{student.course_name}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${student.overall_percentage >= 80 ? 'text-emerald-400' :
                        student.overall_percentage >= 50 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                        {student.overall_percentage}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">{t('noStudentsYet')}</div>
              )}
            </div>
          </div><br />
        </div>

        {/* Bottom Grid - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Time Efficiency Cycle */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 shadow-2xl hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <FiZap className="text-emerald-400" size={24} />
              <h2 className="text-xl font-bold text-white">{t('efficiencyCycle')}</h2>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 group">
                <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all duration-500" />

                <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 224 224">
                  <defs>
                    <linearGradient id="savingsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <circle cx="112" cy="112" r="90" stroke="#1e293b" strokeWidth="10" fill="none" />

                  <circle
                    cx="112" cy="112" r="90"
                    stroke="url(#savingsGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="565"
                    strokeDashoffset={`${565 * (1 - timeMetrics.efficiencyRatio)}`}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000 ease-out"
                  />

                  <circle
                    cx="112" cy="112" r="90"
                    stroke="url(#aiGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="565"
                    strokeDashoffset={`${565 * (1 - (timeMetrics.aiMinutes / timeMetrics.manualMinutes))}`}
                    transform={`rotate(${360 * timeMetrics.efficiencyRatio}, 112, 112)`}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">{t('timeSaved')}</div>
                  <div className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">{timeMetrics.savedMinutes}<span className="text-lg ml-0.5 font-bold">m</span></div>
                  <div className="mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    {Math.round(timeMetrics.efficiencyRatio * 100)}% {t('optimized')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 bg-slate-800/20 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:bg-slate-800/40 transition-all cursor-default text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('humanEffort')}</span>
                  </div>
                  <div className="text-xl font-black text-white">{timeMetrics.manualMinutes}<span className="text-sm ml-1 text-slate-500 font-normal">mins</span></div>
                </div>
                <div className="p-4 bg-slate-800/20 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:bg-slate-800/40 transition-all cursor-default text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('aiSpeed')}</span>
                  </div>
                  <div className="text-xl font-black text-white">{timeMetrics.aiMinutes}<span className="text-sm ml-1 text-slate-500 font-normal">mins</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Class Performance */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 shadow-2xl hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <FiAward className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">{t('classPerformance')}</h2>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#334155"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(classPerformance / 100) * 440} 440`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-black text-white">{classPerformance}%</div>
                  <div className="text-xs text-slate-400">{t('average')}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{t('totalStudents')}</span>
                <span className="text-white font-semibold">{new Set(gradingHistory.map(item => item.student_name)).size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{t('assessments')}</span>
                <span className="text-white font-semibold">{gradingHistory.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{t('passRate')}</span>
                <span className="text-emerald-400 font-semibold">
                  {gradingHistory.length > 0
                    ? Math.round((gradingHistory.filter(item => item.overall_percentage >= 50).length / gradingHistory.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <FiTarget className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-white">{t('gradeDistribution')}</h2>
            </div>

            <div className="h-[200px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400">...</div>
              ) : performanceDistribution.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceDistribution.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {performanceDistribution.filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">{t('noRecordsFound')}</div>
              )}
            </div>

            <div className="space-y-2 mt-4">
              {performanceDistribution.filter(item => item.value > 0).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-400">{item.name.split(' ')[0]}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
