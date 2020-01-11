import { Jinaga as j, ensure } from 'jinaga';

import { Content } from './site';
import { User } from './user';

export class Comment {
  static Type = "Feedback.Comment";
  type = Comment.Type;

  constructor (
    public uniqueId: string,
    public content: Content,
    public author: User
  ) { }

  static content(comment: Comment) {
    ensure(comment).has("content");
    return j.match(comment.content);
  }

  static author(comment: Comment) {
    ensure(comment).has("author");
    return j.match(comment.author);
  }

  static isDeleted(comment: Comment) {
    return j.exists(<CommentDelete>{
      type: CommentDelete.Type,
      comment
    });
  }

  static forContent(content: Content) {
    return j.match(<Comment>{
      type: Comment.Type,
      content
    }).suchThat(j.not(Comment.isDeleted));
  }
}

export class CommentText {
  static Type = "Feedback.Comment.Text";
  type = CommentText.Type;

  constructor (
    public comment: Comment,
    public value: string,
    public prior: CommentText[]
  ) { }

  static comment(commentText: CommentText) {
    ensure(commentText).has("comment");
    return j.match(commentText.comment);
  }

  static isCurrent(commentText: CommentText) {
    return j.notExists(<CommentText>{
      type: CommentText.Type,
      prior: [commentText]
    });
  }

  static forComment(comment: Comment) {
    return j.match(<CommentText>{
      type: CommentText.Type,
      comment
    });
  }
}

export class CommentDelete {
  static Type = "Feedback.Comment.Delete";
  type = CommentDelete.Type;

  constructor (
    public comment: Comment
  ) { }

  static comment(commentDelete: CommentDelete) {
    ensure(commentDelete).has("comment");
    return j.match(commentDelete.comment);
  }
}