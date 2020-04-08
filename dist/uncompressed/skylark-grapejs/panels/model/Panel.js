define([
    'skylark-backbone',
    './Buttons'
], function (Backbone, Buttons) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            id: '',
            content: '',
            visible: true,
            buttons: [],
            attributes: {}
        },
        initialize(options) {
            this.btn = this.get('buttons') || [];
            this.buttons = new Buttons(this.btn);
            this.set('buttons', this.buttons);
        }
    });
});