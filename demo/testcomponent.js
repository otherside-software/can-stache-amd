define([
  "can",
  "stache!template.stache"
], function( can, VIEW ) {
  "use strict";

  return can.Component.extend({
    tag: "test-component",
    template: VIEW,
    viewModel: {

      var: "some text"
    }
  });

});
