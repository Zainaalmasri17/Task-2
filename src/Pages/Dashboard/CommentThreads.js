import { useState } from "react";
import useCommentStore from "../../Store/ComStore";
import useNotificationStore from "../../Store/notificationStore";
import ReactionButtons from "./ReactionButtons";
import useUserGuard from "../../Store/useUserGuard";
import useReportStore from "../../Store/reportStore"; // ✅ جديد

export default function CommentThread({ comment, allComments, articleId }) {
  const { addComment, updateComment, deleteComment } = useCommentStore();
  const { addNotification } = useNotificationStore();
  const { checkAccess } = useUserGuard(); // ✅
  const { reports, addReport } = useReportStore(); // ✅

  const userEmail = localStorage.getItem("userEmail");
  const [replyBody, setReplyBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(comment.body);
  const replies = allComments.filter((c) => c.parentId === comment.id);
  const isOwner = userEmail === comment.email;

  const handleAddReply = () => {
    if (!replyBody.trim()) return;
    if (!checkAccess(userEmail, "إرسال رد")) return;

    const reply = {
      id: Date.now(),
      articleId,
      parentId: comment.id,
      name: userEmail?.split("@")[0],
      email: userEmail,
      body: replyBody,
      createdAt: new Date().toISOString(),
    };

    addComment(reply);

    if (userEmail !== comment.email) {
      addNotification({
        id: Date.now(),
        user: comment.email,
        type: "reply",
        message: `💬 ${userEmail?.split("@")[0]} قام بالرد على تعليقك`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    setReplyBody("");
  };

  const handleEdit = () => {
    if (!editedBody.trim()) return;
    updateComment(comment.id, editedBody);
    setEditing(false);
  };

  const handleReport = () => {
    const alreadyReported = reports.some(
      (r) =>
        r.targetId === comment.id &&
        r.targetType === "comment" &&
        r.reportedBy === userEmail
    );

    if (alreadyReported) {
      alert("🚫 لقد قمت بالإبلاغ عن هذا التعليق مسبقًا.");
      return;
    }

    addReport({
      id: Date.now(),
      targetId: comment.id,
      targetType: "comment",
      reportedBy: userEmail,
      reason: "تعليق مسيء أو مخالف",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    alert("✅ تم إرسال البلاغ للمشرف.");
  };

  return (
    <div className="ml-4 border-l pl-4 mt-4">
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          ✍️ {comment.name} • 🕓 {new Date(comment.createdAt).toLocaleString()}
        </div>

        {!editing ? (
          <p className="text-gray-800 dark:text-white">{comment.body}</p>
        ) : (
          <textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
            rows={3}
          />
        )}

        <ReactionButtons
          targetId={comment.id}
          targetType="comment"
          targetOwner={comment.email}
        />

        <div className="flex gap-4 text-sm mt-2 text-blue-600">
          {!editing && checkAccess(userEmail, "الرد على تعليق") && (
            <button onClick={() => setReplyBody(replyBody ? "" : "💬 ")}>
              💬 رد
            </button>
          )}

          {!isOwner && (
            <button onClick={handleReport} className="text-red-600 hover:underline">
              🚨 إبلاغ
            </button>
          )}

          {isOwner && !editing && (
            <button onClick={() => setEditing(true)}>✏️ تعديل</button>
          )}

          {isOwner && editing && (
            <>
              <button onClick={handleEdit}>✅ حفظ</button>
              <button onClick={() => setEditing(false)}>❌ إلغاء</button>
            </>
          )}

          {isOwner && !editing && (
            <button
              onClick={() => deleteComment(comment.id)}
              className="text-red-500"
            >
              🗑️ حذف
            </button>
          )}
        </div>

        {replyBody && (
          <div className="mt-2">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white resize-none"
              rows={2}
              placeholder="💬 ردك هنا..."
            />
            <button
              onClick={handleAddReply}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ➕ إرسال الرد
            </button>
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              allComments={allComments}
              articleId={articleId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
