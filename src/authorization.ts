import { AuthorizationRules, Jinaga as j } from 'jinaga';

import { Comment, CommentDelete, CommentText } from './comment';
import { Content, Site, SiteDomain } from './site';
import { User } from './user';

export function authorization(a: AuthorizationRules) {
  return a
    .any(User.Type)
    .type(Site.Type, j.for(Site.createdBy))
    .type(SiteDomain.Type, j.for(SiteDomain.site).then(Site.createdBy))
    .any(Content.Type)
    .type(Comment.Type, j.for(Comment.author))
    .type(CommentText.Type, j.for(CommentText.comment).then(Comment.author))
    .type(CommentDelete.Type, j.for(CommentDelete.comment).then(Comment.author))
    .type(CommentDelete.Type, j.for(CommentDelete.comment).then(Comment.content)
      .then(Content.site).then(Site.createdBy))
    ;
}
