import { Jinaga as j } from 'jinaga';

import { User } from './user';

export class Site {
  static Type = "Feedback.Site";
  type = Site.Type;

  constructor (
    public createdBy: User,
    public uniqueId: string
  ) { }
}

export class SiteDomain {
  static Type = "Feedback.Site.Domain";
  type = SiteDomain.Type;

  constructor (
    public site: Site,
    public value: string,
    public prior: SiteDomain[]
  ) { }

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