define([
    "skylark-langx/langx",
    'skylark-jquery',
    './editor/index',
    'skylark-underscore',
    './utils/polyfills',
    './plugin_manager/index'
], function (
    langx,
    $, 
    startEditor, 
    _, 
    polyfills, 
    pluginsInit
) {
    'use strict';
    polyfills();
    const plugins = pluginsInit();
    const editors = [];
    const defaultConfig = {
        autorender: 1,
        plugins: [],
        pluginsOpts: {}
    };
    return {
        $,
        editors,
        plugins,
        version: '<# VERSION #>',
        init(config = {}) {
            const els = config.container;
            if (!els)
                throw new Error("'container' is required");
            config = langx.mixin({},
                defaultConfig,
                config
            );
            config.el = _.isElement(els) ? els : document.querySelector(els);
            const editor = startEditor(config).init();
            config.plugins.forEach(pluginId => {
                let plugin = plugins.get(pluginId);
                const plgOptions = config.pluginsOpts[pluginId] || {};
                if (!plugin) {
                    const wplg = window[pluginId];
                    plugin = wplg && wplg.default ? wplg.default : wplg;
                }
                if (plugin) {
                    plugin(editor, plgOptions);
                } else if (_.isFunction(pluginId)) {
                    pluginId(editor, plgOptions);
                } else {
                    console.warn(`Plugin ${ pluginId } not found`);
                }
            });
            editor.getModel().loadOnStart();
            config.autorender && editor.render();
            editors.push(editor);
            return editor;
        }
    };
});