import { Jinaga, JinagaTest, Trace } from 'jinaga';

import { authorization } from './authorization';
import { Site, SiteDomain, Content } from './site';
import { User } from './user';
import { Comment, CommentDelete } from './comment';

describe("Site", () => {
  let j: Jinaga;
  let site: Site;
  let content: Content;
  let comment: Comment;

  beforeEach(async () => {
    Trace.off();
    
    const user = new User("An RSA public key goes here");
    site = new Site(user, "425b853b-8208-46b1-868a-275b35eaba7d");
    const visitor = new User("A site visitor");
    content = new Content(site, "/path/to/content");
    comment = new Comment("16f359cc-4125-4259-ab22-481a95dcc7f7", content, visitor);

    j = JinagaTest.create({
      authorization,
      user,
      initialState: [
        user,
        site,
        visitor,
        content,
        comment
      ]
    });
  });

  it("should initially have no domain", async () => {
    const domains = await j.query(site, j.for(SiteDomain.forSite));

    expect(domains.length).toBe(0);
  });

  it("should be able to add a domain", async () => {
    await j.fact(new SiteDomain(site, "historicalmodeling.com", []));

    const domains = await j.query(site, j.for(SiteDomain.forSite));

    expect(domains.length).toBe(1);
    expect(domains[0].value).toBe("historicalmodeling.com")
  });

  it("should be able to change the domain", async () => {
    const first = await j.fact(new SiteDomain(site, "historicalmodeling.com", []));
    await j.fact(new SiteDomain(site, "qedcode.com", [first]));

    const domains = await j.query(site, j.for(SiteDomain.forSite));

    expect(domains.length).toBe(1);
    expect(domains[0].value).toBe("qedcode.com");
  });

  it("should initially have one comment", async () => {
    const comments = await j.query(content, j.for(Comment.forContent));

    expect(comments.length).toBe(1);
  });

  it("should be able to delete a visitor's comment", async () => {
    await j.fact(new CommentDelete(comment));

    const comments = await j.query(content, j.for(Comment.forContent));

    expect(comments.length).toBe(0);
  });
});