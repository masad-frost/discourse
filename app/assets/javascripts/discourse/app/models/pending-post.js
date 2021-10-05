import discourseComputed from "discourse-common/utils/decorators";
import Category from "discourse/models/category";
import RestModel from "discourse/models/rest";
import { userPath } from "discourse/lib/url";
import { alias } from "@ember/object/computed";
import { cookAsync } from "discourse/lib/text";
import { loadOneboxes } from "discourse/lib/load-oneboxes";
import { ajax } from "discourse/lib/ajax";
import { resolveAllShortUrls } from "pretty-text/upload-short-url";

const PendingPost = RestModel.extend({
  expandedExcerpt: null,
  postUrl: alias("topic_url"),

  init() {
    this._super(...arguments);
    cookAsync(this.raw_text).then((cooked) => {
      this.set("expandedExcerpt", cooked);
      loadOneboxes(
        this.element,
        ajax,
        this.topic_id,
        this.category_id,
        this.siteSettings.max_oneboxes_per_post,
        false
      );
      resolveAllShortUrls(ajax, this.siteSettings, this.element, this.opts);
    });
  },

  @discourseComputed("category_id")
  category(categoryId) {
    return Category.findById(categoryId);
  },

  @discourseComputed("username")
  userUrl(username) {
    return userPath(username.toLowerCase());
  },
});

export default PendingPost;
