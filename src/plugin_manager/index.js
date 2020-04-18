define(['./config/config'], function (defaults) {
    'use strict';

    return config => {
        for (var name in defaults) {
            if (!(name in defaults))
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