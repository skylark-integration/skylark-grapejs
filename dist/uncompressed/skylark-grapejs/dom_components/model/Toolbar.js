define([
    'skylark-backbone',
    './ToolbarButton'
], function (Backbone, ToolbarButton) {
    'use strict';
    return Backbone.Collection.extend({ model: ToolbarButton });
});