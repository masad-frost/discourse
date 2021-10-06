import Mixin from "@ember/object/mixin";
import discourseComputed from "discourse-common/utils/decorators";
import Category from "discourse/models/category";

export default Mixin.create({
  @discourseComputed("category_id")
  category(categoryId) {
    return Category.findById(categoryId);
  },
});
