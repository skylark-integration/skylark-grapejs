define([
    'skylark-underscore',
    'skylark-backbone',
    './Frame'
], function (a, Backbone, model) {
    'use strict';
    return Backbone.Collection.extend({
        model,
        initialize() {
            a.bindAll(this, 'itemLoaded');
        },
        itemLoaded() {
            this.loadedItems++;
            if (this.loadedItems >= this.itemsToLoad) {
                this.trigger('loaded:all');
                this.listenToLoadItems(0);
            }
        },
        listenToLoad() {
            this.loadedItems = 0;
            this.itemsToLoad = this.length;
            this.listenToLoadItems(1);
        },
        listenToLoadItems(on) {
            this.forEach(item => item[on ? 'on' : 'off']('loaded', this.itemLoaded));
        }
    });
});