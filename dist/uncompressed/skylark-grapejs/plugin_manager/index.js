define(['./config/config'], function (defaults) {
    'use strict';
    return config => {
        var c = config || {};
        for (var name in defaults) {
            if (!(name in c))
                c[name] = defaults[name];
        }
        var plugins = {};
        return {
            add(id, plugin) {
                if (plugins[id]) {
                    return plugins[id];
                }
                plugins[id] = plugin;
                return plugin;
            },
            get(id) {
                return plugins[id];
            },
            getAll() {
                return plugins;
            }
        };
    };
});