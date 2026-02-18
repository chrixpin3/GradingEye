import React, { useState } from "react";
import { FiUpload, FiEye, FiCheckCircle, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.jpeg";
import { useLanguage } from "../context/LanguageContext";
import { API_CONFIG } from "../config";

/**
 * FileUpload with robust backend interaction
 * - uses AbortController to timeout requests
 * - shows sending/loading state
 * - robustly parses backend response and navigates to result
 */
function FileUpload() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [student_doc, setStudent_doc] = useState(null);
  const [marking_guide_doc, setMarking_guide_doc] = useState(null);
  const [sending, setSending] = useState(false);

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (type === "student") setStudent_doc(file);
    if (type === "guide") setMarking_guide_doc(file);
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "student") setStudent_doc(file);
    if (type === "guide") setMarking_guide_doc(file);
  };

  const preventDefault = (e) => e.preventDefault();

  const sendToBackend = async () => {
    if (!student_doc || !marking_guide_doc) return;

    setSending(true);

    const formData = new FormData();
    formData.append("student_doc", student_doc);
    formData.append("marking_guide_doc", marking_guide_doc);

    // Timeout via AbortController
    const controller = new AbortController();
    const timeoutMs = 300_000; // 60s
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/grade`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        throw new Error(data?.error || t('gradingFailed'));
      }

      // ✅ SUCCESS → redirect with result
      navigate("/result", {
        state: {
          success: true,
          result: data.result ?? data,
        },
      });


    } catch (err) {
      navigate("/result", {
        state: {
          success: false,
          error: err.name === "AbortError"
            ? t('gradingTimedOut')
            : err.message || t('unknownError'),
        },
      });
    } finally {
      clearTimeout(timeout);
      setSending(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(23, 23, 117, 0.45), rgb(4, 6, 68), rgba(6, 74, 15, 0.62), rgba(3, 22, 61, 0.71), rgba(14, 16, 66, 0.67)), url(${bgImage})`,
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-green-300">
          {t('gradingEye')}
        </h1>
        <p className="text-lg sm:text-xl text-blue-200 px-4">{t('uploadDescription')}</p>
      </div>

      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Marking Guide */}
          <div className="group">
            <div className="text-lg font-semibold text-blue-200 mb-3 flex items-center">
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 font-bold">1</span>
              {t('markingGuide')}
            </div>
            <div
              onDrop={(e) => handleDrop(e, "guide")}
              onDragOver={preventDefault}
              onClick={() => document.getElementById("guideInput").click()}
              className={`relative h-56 sm:h-64 border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${marking_guide_doc
                ? "bg-blue-700 border-blue-300"
                : "bg-blue-800 border-blue-400 hover:border-blue-300 hover:bg-blue-700 group-hover:shadow-2xl"
                }`}
            >
              <input id="guideInput" type="file" className="hidden" onChange={(e) => handleFileSelect(e, "guide")} accept=".pdf" />
              {marking_guide_doc ? (
                <div className="text-center w-full">
                  <div className="bg-blue-600 rounded-lg p-4 mb-3">
                    <FiUpload size={40} className="mx-auto text-green-400 mb-2" />
                    <p className="text-sm text-green-400 font-semibold mb-2">✓ {t('uploaded')}</p>
                  </div>
                  <p className="text-blue-100 font-semibold break-words">{marking_guide_doc.name}</p>
                  <p className="text-xs text-blue-300 mt-2">{(marking_guide_doc.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <FiUpload size={50} className="mx-auto mb-4 text-blue-300" />
                  <p className="text-lg font-semibold text-blue-100">{t('dragDrop')}</p>
                  <p className="text-sm text-blue-300 mt-2">{t('markingGuide')} PDF</p>
                  <p className="text-xs text-blue-400 mt-3">{t('clickToBrowse')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Student Answer */}
          <div className="group">
            <div className="text-lg font-semibold text-green-200 mb-3 flex items-center">
              <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 font-bold">2</span>
              {t('studentAnswerSheet')}
            </div>
            <div
              onDrop={(e) => handleDrop(e, "student")}
              onDragOver={preventDefault}
              onClick={() => document.getElementById("studentInput").click()}
              className={`relative h-56 sm:h-64 border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${student_doc ? "bg-green-700 border-green-300" : "bg-blue-800 border-green-400 hover:border-green-300 hover:bg-green-700 group-hover:shadow-2xl"
                }`}
            >
              <input id="studentInput" type="file" className="hidden" onChange={(e) => handleFileSelect(e, "student")} accept=".pdf" />
              {student_doc ? (
                <div className="text-center w-full">
                  <div className="bg-green-600 rounded-lg p-4 mb-3">
                    <FiUpload size={40} className="mx-auto text-blue-400 mb-2" />
                    <p className="text-sm text-blue-400 font-semibold mb-2">✓ {t('uploaded')}</p>
                  </div>
                  <p className="text-green-100 font-semibold break-words">{student_doc.name}</p>
                  <p className="text-xs text-green-300 mt-2">{(student_doc.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <FiUpload size={50} className="mx-auto mb-4 text-green-300" />
                  <p className="text-lg font-semibold text-green-100">{t('dragDrop')}</p>
                  <p className="text-sm text-green-300 mt-2">{t('studentAnswerSheet')} PDF</p>
                  <p className="text-xs text-green-400 mt-3">{t('clickToBrowse')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification */}
        {student_doc && marking_guide_doc && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 shadow-2xl border-2 border-green-400">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full p-3">
                  <FiCheckCircle size={32} className="text-green-600" />
                </div>
                <br /><br />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{t('filesReady')}</h3>
                  <p className="text-green-50 text-sm">{t('readyForGrading')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <br /><div className="flex justify-center">
          <button
            onClick={() => {
              if (!student_doc || !marking_guide_doc) {
                alert(t('uploadBothFiles'));
                return;
              }
              sendToBackend();
            }}
            disabled={!student_doc || !marking_guide_doc || sending}
            className={`px-12 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center gap-3 ${student_doc && marking_guide_doc && !sending
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white cursor-pointer transform hover:scale-105"
              : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
              }`}
          >
            {sending ? <><FiLoader className="animate-spin" /> {t('sending')}</> : <><FiEye size={24} /> {t('tapToMark')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;