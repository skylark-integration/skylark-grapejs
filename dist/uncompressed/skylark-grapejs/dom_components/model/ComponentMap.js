define([
    './ComponentImage',
    './Component'
], function (Component, OComponent) {
    'use strict';
    return Component.extend({
        defaults: {
            ...Component.prototype.defaults,
            type: 'map',
            src: '',
            void: 0,
            mapUrl: 'https://maps.google.com/maps',
            tagName: 'iframe',
            mapType: 'q',
            address: '',
            zoom: '1',
            attributes: { frameborder: 0 },
            toolbar: OComponent.prototype.defaults.toolbar,
            traits: [
                {
                    label: 'Address',
                    name: 'address',
                    placeholder: 'eg. London, UK',
                    changeProp: 1
                },
                {
                    type: 'select',
                    label: 'Map type',
                    name: 'mapType',
                    changeProp: 1,
                    options: [
                        {
                            value: 'q',
                            name: 'Roadmap'
                        },
                        {
                            value: 'w',
                            name: 'Satellite'
                        }
                    ]
                },
                {
                    label: 'Zoom',
                    name: 'zoom',
                    type: 'range',
                    min: '1',
                    max: '20',
                    changeProp: 1
                }
            ]
        },
        initialize(o, opt) {
            if (this.get('src'))
                this.parseFromSrc();
            else
                this.updateSrc();
            Component.prototype.initialize.apply(this, arguments);
            this.listenTo(this, 'change:address change:zoom change:mapType', this.updateSrc);
        },
        updateSrc() {
            this.set('src', this.getMapUrl());
        },
        getMapUrl() {
            var md = this;
            var addr = md.get('address');
            var zoom = md.get('zoom');
            var type = md.get('mapType');
            var size = '';
            addr = addr ? '&q=' + addr : '';
            zoom = zoom ? '&z=' + zoom : '';
            type = type ? '&t=' + type : '';
            var result = md.get('mapUrl') + '?' + addr + zoom + type;
            result += '&output=embed';
            return result;
        },
        parseFromSrc() {
            var uri = this.parseUri(this.get('src'));
            var qr = uri.query;
            if (qr.q)
                this.set('address', qr.q);
            if (qr.z)
                this.set('zoom', qr.z);
            if (qr.t)
                this.set('mapType', qr.t);
        }
    }, {
        isComponent(el) {
            var result = '';
            if (el.tagName == 'IFRAME' && /maps\.google\.com/.test(el.src)) {
                result = {
                    type: 'map',
                    src: el.src
                };
            }
            return result;
        }
    });
});