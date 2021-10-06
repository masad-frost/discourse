import discourseComputed from "discourse-common/utils/decorators";
import Category from "discourse/models/category";
import RestModel from "discourse/models/rest";
import { userPath } from "discourse/lib/url";
import { alias } from "@ember/object/computed";
import { cookAsync } from "discourse/lib/text";

const PendingPost = RestModel.extend({
  expandedExcerpt: null,
  postUrl: alias("topic_url"),
  truncated: false,

  init() {
    this._super(...arguments);
    cookAsync(this.raw_text).then((cooked) => {
      this.set("expandedExcerpt", cooked);
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
