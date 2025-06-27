import useReportStore from "../../Store/reportStore";
import useCommentStore from "../../Store/ComStore";
import usePostStore from "../../Store/Poststore";
import useUserStore from "../../Store/userStore";
import { useNavigate } from "react-router-dom";

export default function AdminReports() {
  const { reports, removeReport, markIgnored } = useReportStore();
  const { deleteComment } = useCommentStore();
  const { deletePost } = usePostStore();
  const { banUser } = useUserStore();
  const navigate = useNavigate();

  const handleAction = (report, action) => {
    if (action === "delete") {
      if (report.targetType === "comment") deleteComment(report.targetId);
      if (report.targetType === "article") deletePost(report.targetId);
      removeReport(report.id);
    } else if (action === "ban") {
      banUser(report.reportedBy);
      alert(`🚫 تم حظر المستخدم: ${report.reportedBy}`);
      removeReport(report.id);
    } else if (action === "ignore") {
      markIgnored(report.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📋 البلاغات الواردة</h1>

      {reports.length === 0 ? (
        <p>🎉 لا توجد بلاغات حالية.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow border flex flex-col md:flex-row justify-between gap-4"
            >
              <div>
                <div className="font-bold">🚨 بلاغ على {r.targetType === "comment" ? "تعليق" : "مقال"}</div>
                <div className="text-sm text-gray-500">سبب البلاغ: {r.reason}</div>
                <div className="text-sm text-gray-500">
                  المُبلِّغ: {r.reportedBy} | التاريخ: {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 italic">الحالة: {r.status}</div>
              </div>

              <div className="flex gap-2 items-center self-end">
                <button
                  onClick={() => handleAction(r, "delete")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  🗑️ حذف المحتوى
                </button>
                <button
                  onClick={() => handleAction(r, "ban")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                >
                  🚫 حظر المستخدم
                </button>
                <button
                  onClick={() => handleAction(r, "ignore")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                >
                  ❌ تجاهل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
