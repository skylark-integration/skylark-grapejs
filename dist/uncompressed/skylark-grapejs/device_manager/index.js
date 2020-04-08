define([
    "skylark-langx/langx",
    './config/config',
    './model/Devices',
    './view/DevicesView'
], function (langx,defaults, Devices, DevicesView) {
    'use strict';
    return () => {
        var c = {};
        var devices, view;
        return {
            name: 'DeviceManager',
            init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                devices = new Devices();
                (c.devices || []).forEach(dv => this.add(dv.id || dv.name, dv.width, dv));
                view = new DevicesView({
                    collection: devices,
                    config: c
                });
                return this;
            },
            add(id, width, opts = {}) {
                const obj = langx.mixin({},opts,{
                    id,
                    name: opts.name || id,
                    width: width
                });
                return devices.add(obj);
            },
            get(name) {
                return devices.get(name);
            },
            getAll() {
                return devices;
            },
            render() {
                return view.render().el;
            }
        };
    };
});