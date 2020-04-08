define([
    'skylark-underscore',
    'skylark-backbone'
], function (a, Backbone) {
    'use strict';
    return Backbone.Model.extend({
        build(model) {
            var json = model.toJSON();
            this.beforeEach(json);
            a.each(json, function (v, attr) {
                var obj = json[attr];
                if (obj instanceof Backbone.Model) {
                    json[attr] = this.build(obj);
                } else if (obj instanceof Backbone.Collection) {
                    var coll = obj;
                    json[attr] = [];
                    if (coll.length) {
                        coll.undefined(function (el, index) {
                            json[attr][index] = this.build(el);
                        }, this);
                    }
                }
            }, this);
            return json;
        },
        beforeEach(obj) {
            delete obj.status;
        }
    });
});