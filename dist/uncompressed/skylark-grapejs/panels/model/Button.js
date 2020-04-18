define(['skylark-backbone'], function (Backbone) {
    'use strict';
    var Button =  Backbone.Model.extend({
        defaults: {
            id: '',
            label: '',
            tagName: 'span',
            className: '',
            command: '',
            context: '',
            buttons: [],
            attributes: {},
            options: {},
            active: false,
            dragDrop: false,
            togglable: true,
            runDefaultCommand: true,
            stopDefaultCommand: false,
            disable: false
        },
        initialize(options) {
            if (this.get('buttons').length) {
                var Buttons = Button.Buttons; //require('./Buttons').default; modified by lwf
                this.set('buttons', new Buttons(this.get('buttons')));
            }
        }
    });

    return Button;
});