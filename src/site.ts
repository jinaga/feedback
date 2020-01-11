import { Jinaga as j, ensure } from 'jinaga';

import { User } from './user';

export class Site {
  static Type = "Feedback.Site";
  type = Site.Type;

  constructor (
    public createdBy: User,
    public uniqueId: string
  ) { }

  static createdBy(site: Site) {
    ensure(site).has("createdBy");
    return j.match(site.createdBy);
  }
}

export class SiteDomain {
  static Type = "Feedback.Site.Domain";
  type = SiteDomain.Type;

  constructor (
    public site: Site,
    public value: string,
    public prior: SiteDomain[]
  ) { }

  static site(siteDomain: SiteDomain) {
    ensure(siteDomain).has("site");
    return j.match(siteDomain.site);
  }

  static isCurrent(siteDomain: SiteDomain) {
    return j.notExists(<SiteDomain>{
      type: SiteDomain.Type,
      prior: [siteDomain]
    });
  }

  static forSite(site: Site) {
    return j.match(<SiteDomain>{
      type: SiteDomain.Type,
      site
    }).suchThat(SiteDomain.isCurrent);
  }
}

export class Content {
  static Type = "Feedback.Content";
  type = Content.Type;

  constructor (
    public site: Site,
    public path: string
  ) { }

  static site(content: Content) {
    ensure(content).has("site");
    return j.match(content.site);
  }
}