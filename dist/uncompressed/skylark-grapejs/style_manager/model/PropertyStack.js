define([
    "skylark-langx/langx",
    './PropertyComposite',
    './Layers'
], function (langx,Property, Layers) {
    'use strict';
    return Property.extend({
        defaults: langx.mixin({},
            ...Property.prototype.defaults,{
            layers: [],
            layerSeparator: ', ',
            prepend: 0,
            preview: 0
        }),
        initialize(props = {}, opts = {}) {
            Property.callParentInit(Property, this, props, opts);
            const layers = this.get('layers');
            const layersColl = new Layers(layers);
            layersColl.property = this;
            layersColl.properties = this.get('properties');
            this.set('layers', layersColl);
            Property.callInit(this, props, opts);
        },
        getLayers() {
            return this.get('layers');
        },
        getCurrentLayer() {
            return this.getLayers().filter(layer => layer.get('active'))[0];
        },
        getFullValue() {
            return this.get('detached') ? '' : this.get('layers').getFullValue();
        },
        getValueFromStyle(styles = {}) {
            const layers = this.getLayers().getLayersFromStyle(styles);
            return new Layers(layers).getFullValue();
        },
        clearValue() {
            this.getLayers().reset();
            return Property.prototype.clearValue.apply(this, arguments);
        },
        getLayersFromTarget(target) {
            return;
        }
    });
});