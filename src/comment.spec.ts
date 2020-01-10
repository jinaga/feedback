import { Jinaga, JinagaBrowser } from "jinaga";
import { Content, Site } from "./site";
import { User } from "./user";
import { Comment, CommentText, CommentDelete } from "./comment";

describe("Comment", () => {
  let j: Jinaga;
  let content: Content;

  beforeEach(async () => {
    j = JinagaBrowser.create({});

    const owner = new User("Site owner's RSA public key");
    const site = new Site(owner, "425b853b-8208-46b1-868a-275b35eaba7d");
    content = await j.fact(new Content(site, "/factual/"));
  });

  it("should initially have no comments", async () => {
    const comments = await j.query(content, j.for(Comment.forContent));

    expect(comments.length).toBe(0);
  });

  it("should be able to add a comment", async () => {
    const user = new User("Commenter's RSA public key");
    const comment = await j.fact(new Comment(
      "16f359cc-4125-4259-ab22-481a95dcc7f7", content, user));
    await j.fact(new CommentText(comment, "I'd like to learn more about this.", []));

    const commentTexts = await j.query(content, j.for(Comment.forContent)
      .then(CommentText.forComment));

    expect(commentTexts.length).toBe(1);
    expect(commentTexts[0].value).toBe("I'd like to learn more about this.");
  });

  it("should be able to delete a comment", async () => {
    const user = new User("Commenter's RSA public key");
    const comment = await j.fact(new Comment(
      "16f359cc-4125-4259-ab22-481a95dcc7f7", content, user));
    await j.fact(new CommentText(comment, "I'd like to learn more about this.", []));
    await j.fact(new CommentDelete(comment));

    const commentTexts = await j.query(content, j.for(Comment.forContent)
      .then(CommentText.forComment));

    expect(commentTexts.length).toBe(0);
  });
});