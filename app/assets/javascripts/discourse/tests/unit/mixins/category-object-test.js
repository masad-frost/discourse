import EmberObject from "@ember/object";
import CategoryObjectMixin from "discourse/mixins/category-object";
import { module, test } from "qunit";

module("Unit | Mixin | category-object", function () {
  // Replace this with your real tests.
  test("it works", function (assert) {
    let CategoryObjectObject = EmberObject.extend(CategoryObjectMixin);
    let subject = CategoryObjectObject.create();
    assert.ok(subject);
  });
});
