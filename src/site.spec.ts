import { Jinaga, JinagaBrowser } from 'jinaga';

import { Site, SiteDomain } from './site';
import { User } from './user';

describe("Site", () => {
  let j: Jinaga;
  let creator: User;
  let site: Site;

  beforeEach(async () => {
    j = JinagaBrowser.create({});

    creator = await j.fact(new User("An RSA public key goes here"));
    site = await j.fact(new Site(creator, "425b853b-8208-46b1-868a-275b35eaba7d"));
  });

  it("should initially have no domain", async () => {
    const domains = await j.query(site, j.for(SiteDomain.forSite));

    expect(domains.length).toBe(0);
  });
});