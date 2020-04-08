define(['skylark-backbone'], function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        idAttribute: 'name',
        defaults: {
            name: '',
            width: null,
            height: '',
            widthMedia: null,
            priority: null
        },
        initialize() {
            this.get('widthMedia') === null && this.set('widthMedia', this.get('width'));
            this.get('width') === null && this.set('width', this.get('widthMedia'));
            !this.get('priority') && this.set('priority', parseFloat(this.get('widthMedia')) || 0);
            const toCheck = [
                'width',
                'height',
                'widthMedia'
            ];
            toCheck.forEach(prop => this.checkUnit(prop));
        },
        checkUnit(prop) {
            const pr = this.get(prop) || '';
            const noUnit = (parseFloat(pr) || 0).toString() === pr.toString();
            noUnit && this.set(prop, `${ pr }px`);
        }
    });
});