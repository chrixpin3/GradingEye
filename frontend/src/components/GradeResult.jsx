import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiArrowLeft, FiPrinter, FiDownload, FiPlay, FiAward, FiBook, FiUser, FiCalendar, FiClock, FiAlertCircle, FiCheckCircle, FiXCircle, FiMinusCircle
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import bgImage from "../assets/ana.png";
import ResultChat from "./ResultChat";
import { useLanguage } from "../context/LanguageContext";

function GradeResult() {
  const { t, language } = useLanguage();
  const { state } = useLocation();
  const navigate = useNavigate();

  // State for animations and loading
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Safely initialize audio with error handling
  const audioRefs = {
    correct: new Audio("/sounds/correct.wav"),
    wrong: new Audio("/sounds/incorrect.m4a"),
    partial: new Audio("/sounds/partial.m4a")
  };

  const getVoice = (gender = "female") => {
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return null;
      const selected = voices.find((v) =>
        gender === "male"
          ? v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("en-us")
          : gender === "female"
            ? v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("en-us")
            : true
      );
      return selected || voices[0];
    } catch (err) {
      console.warn("Speech synthesis error:", err);
    }
  };

  const playMarkSound = (status) => {
    try {
      if (status === "correct") audioRefs.correct.play().catch(() => { });
      else if (status === "partial") audioRefs.partial.play().catch(() => { });
      else audioRefs.wrong.play().catch(() => { });
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const readQuestionAnswerMarks = (question, answer, marks, maxMarks, status) => {
    if (!window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const qUtterance = new SpeechSynthesisUtterance(question || "");
      qUtterance.voice = getVoice("male");
      qUtterance.rate = 1;

      const aUtterance = new SpeechSynthesisUtterance(answer || "");
      aUtterance.voice = getVoice("female");
      aUtterance.rate = 1;

      const marksText = `${t('score')}: ${marks || 0} ${t('outOf')} ${maxMarks || 0}`;
      const marksUtterance = new SpeechSynthesisUtterance(marksText);
      marksUtterance.voice = getVoice("male");
      marksUtterance.rate = 1;

      qUtterance.onend = () => window.speechSynthesis.speak(aUtterance);
      aUtterance.onend = () => {
        window.speechSynthesis.speak(marksUtterance);
        playMarkSound(status);
      };
      window.speechSynthesis.speak(qUtterance);
    } catch (e) {
      console.error("Speech synthesis failed", e);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleDownload = () => {
    if (!state?.result) return;

    setIsDownloading(true);
    const doc = new jsPDF();
    const result = state.result;
    const studentName = result.student_name || "Unnamed Candidate";
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    // HEADER - Title & Branding
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(0, 0, 210, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(t('officialEvaluationReport'), 105, 25, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(t('veritasSystem'), 105, 38, { align: "center", charSpace: 1 });

    // STUDENT INFO BOX
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text(t('studentAssessmentDetails'), 14, 65);
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 68, 196, 68);

    doc.setFontSize(12);
    doc.text(`${t('candidateName')}: ${studentName}`, 14, 80);
    doc.text(`${t('idReference')}: ${result?.student_id || result?._id?.slice(-8).toUpperCase() || "N/A"}`, 14, 88);
    doc.text(`${t('assessmentDate')}: ${dateStr}`, 14, 96);
    doc.text(`${t('courseSubject')}: ${result?.course_name || t('institutional')}`, 14, 104);
    doc.setFont("helvetica", "bold");
    doc.text(`${t('attainmentStatus')}: ${result.status === 'Pass' ? t('successful') : t('retakeRequired')}`, 14, 112);

    // PERFORMANCE SUMMARY (GRADE BOX - MATCHING IMAGE)
    doc.setDrawColor(21, 128, 61); // emerald-700
    doc.setLineWidth(1.5);
    doc.rect(130, 75, 66, 40);

    doc.setTextColor(21, 128, 61);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(t('finalIndex'), 163, 85, { align: "center", charSpace: 1 });
    doc.setFontSize(36);
    doc.text(`${result.overall_percentage}%`, 163, 105, { align: "center" });

    // TEACHER'S EVALUATIVE SUMMARY
    doc.setFillColor(254, 252, 232); // feedback yellow
    doc.rect(14, 125, 182, 40, 'F');
    doc.setDrawColor(185, 28, 28); // red-700
    doc.setLineWidth(2);
    doc.line(14, 125, 14, 165); // Thick red left border

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(t('teacherEvaluativeSummary'), 20, 137);
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    const splitFeedback = doc.splitTextToSize(`"${result.teacher_feedback || "The student provided a comprehensive response aligned with the marking criteria."}"`, 170);
    doc.text(splitFeedback, 20, 148);

    // DETAILED ANALYSIS SECTION IN PDF
    let finalY = 175;

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(t('comprehensiveScriptEvaluation'), 14, finalY);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, finalY + 3, 196, finalY + 3);
    finalY += 15;

    result.student_answers.forEach((q) => {
      // Check for page overflow
      if (finalY > 250) {
        doc.addPage();
        finalY = 20;
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(`${t('question')} ${q.question_number}`, 14, finalY);
      finalY += 6;

      // THE ACTUAL QUESTION TEXT (Wrapped)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const wrappedQText = doc.splitTextToSize(q.question_text || "", 182);
      doc.text(wrappedQText, 14, finalY);
      finalY += (wrappedQText.length * 6) + 4;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${t('status')}: ${q.graded_marks} / ${q.max_marks} (${q.status.toUpperCase()})`, 14, finalY);
      finalY += 10;

      // Candidate Box
      doc.setFillColor(248, 250, 252); // slate-50
      const submissionLines = doc.splitTextToSize(`${t('candidateScript')}: "${q.student_answer || t('noResponseRecorded')}"`, 170);
      const subBoxH = (submissionLines.length * 5) + 10;
      doc.rect(14, finalY, 182, subBoxH, 'F');

      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "italic");
      doc.text(submissionLines, 20, finalY + 8);
      finalY += subBoxH + 5;

      // Solution Box (if needed)
      if (q.correct_answer && q.status !== 'correct') {
        doc.setFillColor(240, 253, 244); // emerald-50
        const solutionLines = doc.splitTextToSize(`${t('officialCorrection')}: ${q.correct_answer}`, 170);
        const solBoxH = (solutionLines.length * 5) + 10;
        doc.rect(14, finalY, 182, solBoxH, 'F');

        doc.setTextColor(5, 46, 22);
        doc.setFont("helvetica", "italic");
        doc.text(solutionLines, 20, finalY + 8);
        finalY += solBoxH + 10;
      } else {
        finalY += 10;
      }
    });

    // FOOTER (Applied to all pages)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(t('page').replace('{0}', i).replace('{1}', pageCount), 105, 285, { align: "center" });
      doc.text(`${t('reportId')}: ${result._id}`, 196, 285, { align: "right" });
    }

    doc.save(`${studentName.replace(/\s+/g, '_')}_GradeReport.pdf`);
    setIsDownloading(false);
  };

  // Get performance description based on level
  const getPerformanceDescription = (performance) => {
    const descriptions = {
      "Excellent": "Outstanding Performance - Exceptional mastery of the subject matter",
      "Very Good": "Strong Performance - Demonstrates solid understanding and application",
      "Good": "Competent Performance - Shows good grasp of core concepts",
      "Satisfactory": "Adequate Performance - Meets basic requirements",
      "Sufficient": "Passing Performance - Minimal competency demonstrated",
      "Poor": "Below Standard - Significant gaps in understanding",
      "Failed": "Unsuccessful - Does not meet minimum requirements"
    };
    return descriptions[performance] || "";
  };

  if (!state) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
      <p className="text-xl mb-4 font-medium">{t('noRecordsFound')}</p>
      <button onClick={() => navigate("/")} className="text-blue-400 hover:text-blue-300 underline">{t('backToDashboard')}</button>
    </div>
  );

  if (!state.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a] text-center">
        <div className="w-full max-w-md bg-[#1e293b] rounded-3xl p-10 border border-[#334155] shadow-2xl flex flex-col items-center">
          <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-500/20">
            <FaTimes className="text-red-500 text-4xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">{t('gradingFailed')}</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">{state.error || t('unknownError')}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-900/30 hover:-translate-y-1"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const result = state.result || {};
  const answers = result.student_answers || [];
  const studentName = result.student_name || "Unnamed Candidate";
  const isNameMissing = !result.student_name;

  // Count-up animation for score
  useEffect(() => {
    const targetScore = result.overall_percentage || 0;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetScore / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayedScore(Math.min(Math.round(increment * currentStep), targetScore));
      } else {
        setDisplayedScore(targetScore);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.overall_percentage]);

  return (
    <div className="min-h-screen bg-[#0f172a] pb-20 selection:bg-blue-500/30 font-sans">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-10 pt-12">

        {/* ACTION BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 sm:py-10 no-print gap-6">
          <button
            onClick={() => navigate("/")}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 text-slate-400 hover:text-white transition-all duration-300 font-black uppercase tracking-[0.3em] text-[10px] bg-slate-800/20 px-6 py-3 rounded-full border border-slate-700/30 backdrop-blur-sm"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>{t('backToDashboard')}</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {/* Print Button - Glassmorphic Dark */}
            <button
              onClick={handlePrint}
              className="relative w-full sm:w-auto group overflow-hidden flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/40 text-slate-200 rounded-2xl border border-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-500 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl backdrop-blur-md active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FiPrinter size={18} className="group-hover:rotate-12 transition-transform" />
              <span>{t('printReport')}</span>
              {/* Subtle bottom glow */}
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
            </button>

            {/* Download Button - Premium Glowing Gradient */}
            <button
              onClick={handleDownload}
              className="relative w-full sm:w-auto group overflow-hidden flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_50px_-10px_rgba(37,99,235,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-500"
            >
              {/* Shine effect animation */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

              <FiDownload size={18} className="group-hover:bounce-subtle" />
              <span className="relative z-10 transition-colors">{t('downloadPDF')}</span>

              {/* Animated pulse ring */}
              <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            </button>
          </div>
        </div>

        {/* OFFICIAL REPORT CONTAINER */}
        <div className="bg-white shadow-[0_0_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden rounded-sm border border-slate-200">

          {/* HEADER (Veritas Official Style) */}
          <div className="bg-[#1e293b] py-16 sm:py-20 px-6 sm:px-10 flex flex-col items-center text-center">
            <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight mb-4 uppercase">{t('gradingResults')}</h1>
            <p className="text-slate-400 text-xs sm:text-sm font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-80">{t('internationalSystem')}</p>
          </div>

          <div className="p-6 sm:p-20">

            {/* STUDENT ASSESSMENT DETAILS SECTION */}
            <div className="relative mb-16">
              <div className="border-b-[1px] border-slate-200 pb-2 mb-10">
                <h2 className="text-3xl font-normal text-slate-700">{t('studentAssessmentDetails')}</h2>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-6 flex-1 w-full order-2 lg:order-1">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('candidateName')}</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{studentName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('idReference')}</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-900 leading-tight uppercase">{result.student_id || result._id?.slice(-8).toUpperCase() || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('assessmentDate')}</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('courseSubject')}</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{result.course_name || t('institutional')}</p>
                  </div>
                  <div className="sm:col-span-2 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('attainmentStatus')}:</span>
                    <span className={`px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-widest ${result.status === 'Pass' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {result.status === 'Pass' ? t('successful') : t('retakeRequired')}
                    </span>
                  </div>
                </div>

                {/* FINAL GRADE BOX (Consolidated Style) */}
                <div className="shrink-0 relative group order-1 lg:order-2">
                  <div className="absolute -inset-4 bg-emerald-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-10 opacity-50"></div>
                  <div className="border-[4px] sm:border-[6px] border-emerald-700 p-6 sm:p-10 w-48 h-48 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center animate-boom bg-white shadow-xl shadow-emerald-900/10 transition-all duration-300">
                    <p className="text-emerald-700 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2">{t('finalIndex')}</p>
                    <div className="text-4xl sm:text-7xl font-black text-emerald-700 tracking-tighter tabular-nums">
                      {displayedScore}<span className="text-xl sm:text-3xl ml-0.5 sm:ml-1">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div><br /><br />

            {/* INTEGRITY REPORT SECTION */}
            {result.integrity_analysis && (
              <div className={`p-8 mb-12 rounded-xl border-l-[6px] ${result.integrity_analysis.is_clean ? "bg-slate-50 border-slate-300" : "bg-red-50 border-red-600"}`}>
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-full ${result.integrity_analysis.is_clean ? "bg-slate-200 text-slate-500" : "bg-red-100 text-red-600 animate-pulse"}`}>
                    {result.integrity_analysis.is_clean ? <FiCheckCircle size={32} /> : <FiAlertCircle size={32} />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-black uppercase tracking-widest mb-2 ${result.integrity_analysis.is_clean ? "text-slate-600" : "text-red-700"}`}>
                      {result.integrity_analysis.is_clean ? t('integrityVerification') : t('integrityAnomalies')}
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium mb-4">
                      {result.integrity_analysis.evidence || t('noAnomalies')}
                    </p>

                    {!result.integrity_analysis.is_clean && result.integrity_analysis.flags && result.integrity_analysis.flags.length > 0 && (
                      <div className="bg-white p-6 rounded-lg border border-red-100">
                        <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">{t('detectedFlags')}</p>
                        <ul className="space-y-2">
                          {result.integrity_analysis.flags.map((flag, i) => (
                            <li key={i} className="flex items-center gap-3 text-red-700 font-bold text-sm">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {result.integrity_analysis.is_clean && (
                    <div className="hidden sm:block opacity-50">
                      <div className="border-4 border-slate-300 rounded-full p-2">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400 text-center leading-tight">
                          {t('verifiedClean')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TEACHER'S EVALUATIVE SUMMARY (MATCHING IMAGE EXACTLY) */}
            <div className="bg-[#fefce8] p-6 sm:p-12 border-l-[8px] border-red-700 mb-16 sm:mb-20 shadow-sm relative">
              <h3 className="text-slate-900 font-bold mb-4 sm:mb-5 text-lg sm:text-xl">{t('teacherEvaluativeSummary')}</h3>
              <p className="text-slate-900 text-xl sm:text-2xl font-serif italic leading-relaxed">
                "{result.teacher_feedback || "The student provided a comprehensive response aligned with the marking criteria."}"
              </p>
            </div><br /><br />


            {/* DETAILED SCRIPT ANALYSIS */}
            <div className="space-y-24">
              <div className="border-b-2 border-slate-200 pb-5">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <FiAward className="text-emerald-600" />
                  <span>{t('comprehensiveScriptEvaluation')}</span>
                </h3>
              </div>

              {answers.map((q, i) => (
                <div key={i} className="animate-reveal group">
                  <div className="flex flex-col gap-6 sm:gap-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-10">
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                          <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em]">{t('question')} {q.question_number}</span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed whitespace-pre-line">{q.question_text}</h4>
                      </div>
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-5 pb-4 sm:pb-0">
                        <div className={`px-6 py-3 sm:px-8 sm:py-4 border-[3px] sm:border-[4px] ${q.status === 'correct' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : q.status === 'partial' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-red-600 bg-red-50 text-red-700'} rounded-sm font-black text-xl sm:text-2xl shadow-md transition-transform hover:scale-105 duration-300`}>
                          {q.graded_marks} / {q.max_marks}
                        </div>
                        <button
                          onClick={() => readQuestionAnswerMarks(q.question_text, q.student_answer, q.graded_marks, q.max_marks, q.status)}
                          className="no-print flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                        >
                          <FiPlay />
                          {t('aiReviewAudio')}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      <div className="bg-slate-50 border border-slate-200 p-6 sm:p-10 rounded-sm relative group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 bg-slate-900 px-5 py-2 text-[9px] font-black text-white uppercase tracking-widest">
                          {t('candidateScript')}
                        </div>
                        <p className="text-lg sm:text-xl text-slate-700 italic leading-[1.8] font-serif pr-4">
                          "{q.student_answer || t('noResponseRecorded')}"
                        </p>
                      </div>

                      {(q.correct_answer && q.status !== 'correct') && (
                        <div className="bg-emerald-50 border border-emerald-100 p-6 sm:p-10 rounded-sm relative group hover:shadow-md transition-shadow">
                          <div className="absolute top-0 right-0 bg-emerald-600 px-5 py-2 text-[9px] font-black text-white uppercase tracking-widest">
                            {t('officialCorrection')}
                          </div>
                          <p className="text-lg sm:text-xl text-emerald-800 italic leading-[1.8] font-serif pr-4">
                            {q.correct_answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* FOOTER (Metadata) */}
          <div className="bg-slate-50 p-6 sm:p-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest gap-6 sm:gap-4 text-center sm:text-left">
            <div>{t('reportId')}: {result._id || "VER-OFFICIAL-X"}</div>
            <div>{t('institutional')} {t('status')}: DIGITAL_SIG_AUTHENTICATED</div>
            <div>&copy; {new Date().getFullYear()} {t('examinationBoard')}</div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes boom {
          0% { transform: scale(0.9); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }

        .group:hover .group-hover\:bounce-subtle {
          animation: bounce-subtle 0.6s ease-in-out;
        }

        .animate-boom {
          animation: boom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .min-h-screen { background: white !important; padding: 0 !important; }
          .shadow-2xl { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          .bg-slate-100 { background: white !important; }
        }
      `}} />

      {/* FLOAT CHATBOT */}
      <ResultChat resultData={result} />
    </div >
  );
}

export default GradeResult;
