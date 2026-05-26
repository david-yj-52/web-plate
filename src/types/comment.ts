import type { UserSummary } from "./issue";

export interface CommentResponse {
  id: string;
  issueId: string;
  content: string;
  author: UserSummary;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}
