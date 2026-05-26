"use client";

import { useToast } from "@/components/ui/Toast";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/useComments";
import type { CommentResponse } from "@/types/comment";
import { useRef, useState } from "react";

function CommentItem({
  comment,
  issueId,
}: {
  comment: CommentResponse;
  issueId: string;
}) {
  const { show, ToastComponent } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(issueId);
  const { mutate: deleteComment, isPending: isDeleting } =
    useDeleteComment(issueId);

  const handleEdit = () => {
    setDraft(comment.content);
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === comment.content) {
      setEditing(false);
      return;
    }
    updateComment(
      { commentId: comment.id, data: { content: trimmed } },
      {
        onSuccess: () => {
          setEditing(false);
          show("댓글이 수정되었습니다.");
        },
        onError: () => show("댓글 수정에 실패했습니다.", "error"),
      },
    );
  };

  const handleCancel = () => {
    setDraft(comment.content);
    setEditing(false);
  };

  const handleDelete = () => {
    deleteComment(comment.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        show("댓글이 삭제되었습니다.");
      },
      onError: () => show("댓글 삭제에 실패했습니다.", "error"),
    });
  };

  return (
    <div className="group flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 uppercase">
        {comment.author.name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-800">
            {comment.author.name}
          </span>
          <span className="text-xs text-slate-400">
            {new Date(comment.createdAt).toLocaleString("ko-KR")}
          </span>
          {comment.createdAt !== comment.modifiedAt && (
            <span className="text-xs text-slate-400 italic">(수정됨)</span>
          )}
        </div>

        {editing ? (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancel();
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave();
              }}
              rows={3}
              className="w-full border border-blue-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isUpdating || !draft.trim()}
                className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {comment.content}
          </p>
        )}
      </div>

      {!editing && (
        <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="px-2 py-1 rounded text-xs text-slate-500 hover:bg-slate-100"
          >
            수정
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-2 py-1 rounded text-xs text-red-400 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              댓글 삭제
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              이 댓글을 삭제하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-9 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-9 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}

      {ToastComponent}
    </div>
  );
}

export function CommentSection({ issueId }: { issueId: string }) {
  const { show, ToastComponent } = useToast();
  const { data: comments, isLoading } = useComments(issueId);
  const { mutate: createComment, isPending: isSubmitting } =
    useCreateComment(issueId);

  const [newContent, setNewContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    const trimmed = newContent.trim();
    if (!trimmed) return;
    createComment(
      { content: trimmed },
      {
        onSuccess: () => {
          setNewContent("");
          setIsFocused(false);
          show("댓글이 등록되었습니다.");
        },
        onError: () => show("댓글 등록에 실패했습니다.", "error"),
      },
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-slate-700 mb-4 px-1">
        댓글{" "}
        {comments && comments.length > 0 && (
          <span className="ml-1 text-slate-400 font-normal">
            ({comments.length})
          </span>
        )}
      </h2>

      {/* 댓글 작성 폼 */}
      <div className="mb-6">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
            if (e.key === "Escape") {
              setIsFocused(false);
              setNewContent("");
            }
          }}
          placeholder="댓글을 입력하세요... (Ctrl+Enter로 등록)"
          rows={isFocused ? 3 : 2}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none transition-all placeholder:text-slate-400"
        />
        {isFocused && (
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setIsFocused(false);
                setNewContent("");
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !newContent.trim()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "등록 중..." : "등록"}
            </button>
          </div>
        )}
      </div>

      {/* 댓글 목록 */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-24" />
                <div className="h-4 bg-slate-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} issueId={issueId} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-6">
          아직 댓글이 없습니다.
        </p>
      )}

      {ToastComponent}
    </div>
  );
}
