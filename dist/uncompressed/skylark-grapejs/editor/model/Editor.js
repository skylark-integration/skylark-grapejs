define([
    "skylark-langx/langx",
    'skylark-underscore',
    'skylark-jquery',
    'skylark-backbone',
    '../../utils/extender',
    '../../utils/mixins',
    "../../utils/index",
    "../../i18n/index",
    "../../keymaps/index",
    "../../undo_manager/index",
    "../../storage_manager/index",
    "../../device_manager/index",
    "../../parser/index",
    "../../selector_manager/index",
    "../../style_manager/index",
    "../../modal_dialog/index",
    "../../code_manager/index",
    "../../panels/index",
    "../../rich_text_editor/index",
    "../../asset_manager/index",
    "../../css_composer/index",
    "../../trait_manager/index",
    "../../dom_components/index",
    "../../navigator/index",
    "../../canvas/index",
    "../../commands/index",
    "../../block_manager/index"
], function (langx,_, $, Backbone, Extender, b,
    _utils,
    _i18n,
    _keymaps,
    _undo_manager,
    _storage_manager,
    _device_manager,
    _parser,
    _selector_manager,
    _style_manager,
    _modal_dialog,
    _code_manager,
    _panels,
    _rich_text_editor,
    _asset_manager,
    _css_composer,
    _trait_manager,
    _dom_components,
    _navigator,
    _canvas,
    _commands,
    _block_manager
) {
    'use strict';
    Backbone.$ = $;
    const deps = [
        _utils,
        _i18n,
        _keymaps,
        _undo_manager,
        _storage_manager,
        _device_manager,
        _parser,
        _selector_manager,
        _style_manager,
        _modal_dialog,
        _code_manager,
        _panels,
        _rich_text_editor,
        _asset_manager,
        _css_composer,
        _trait_manager,
        _dom_components,
        _navigator,
        _canvas,
        _commands,
        _block_manager
    ];
    const {Collection} = Backbone;
    let timedInterval;
    let updateItr;
    Extender({
        Backbone: Backbone,
        $: Backbone.$
    });
    const logs = {
        debug: console.log,
        info: console.info,
        warning: console.warn,
        error: console.error
    };
    return Backbone.Model.extend({
        defaults() {
            return {
                editing: 0,
                selected: new Collection(),
                clipboard: null,
                dmode: 0,
                componentHovered: null,
                previousModel: null,
                changesCount: 0,
                storables: [],
                modules: [],
                toLoad: [],
                opened: {},
                device: ''
            };
        },
        initialize(c = {}) {
            this.config = c;
            this.set('Config', c);
            this.set('modules', []);
            this.set('toLoad', []);
            this.set('storables', []);
            this.set('dmode', c.dragMode);
            const el = c.el;
            const log = c.log;
            const toLog = log === true ? _.keys(logs) : _.isArray(log) ? log : [];
            _.bindAll(this, 'initBaseColorPicker');
            if (el && c.fromElement)
                this.config.components = el.innerHTML;
            this.attrsOrig = el ? _.toArray(el.attributes).reduce((res, next) => {
                res[next.nodeName] = next.nodeValue;
                return res;
            }, {}) : '';
            deps.forEach(name => this.loadModule(name));
            this.on('change:componentHovered', this.componentHovered, this);
            this.on('change:changesCount', this.updateChanges, this);
            toLog.forEach(e => this.listenLog(e));
            [{
                    from: 'change:selectedComponent',
                    to: 'component:toggled'
                }].forEach(event => {
                const eventFrom = event.from;
                const eventTo = event.to;
                this.listenTo(this, eventFrom, (...args) => {
                    this.trigger(eventTo, ...args);
                    this.logWarning(`The event '${ eventFrom }' is deprecated, replace it with '${ eventTo }'`);
                });
            });
        },
        getContainer() {
            return this.config.el;
        },
        listenLog(event) {
            this.listenTo(this, `log:${ event }`, logs[event]);
        },
        getConfig(prop) {
            const config = this.config;
            return _.isUndefined(prop) ? config : config[prop];
        },
        loadOnStart(clb = null) {
            const sm = this.get('StorageManager');
            this.get('toLoad').forEach(module => {
                module.onLoad();
            });
            const postLoad = () => {
                const modules = this.get('modules');
                modules.forEach(module => module.postLoad && module.postLoad(this));
                clb && clb();
            };
            if (sm && sm.canAutoload()) {
                this.load(postLoad);
            } else {
                postLoad();
            }
        },
        updateChanges() {
            const stm = this.get('StorageManager');
            const changes = this.get('changesCount');
            updateItr && clearTimeout(updateItr);
            updateItr = setTimeout(() => this.trigger('update'));
            if (this.config.noticeOnUnload) {
                window.onbeforeunload = changes ? e => 1 : null;
            }
            if (stm.isAutosave() && changes >= stm.getStepsBeforeSave()) {
                this.store();
            }
        },
        loadModule(moduleName) {
            const {config} = this;
            const Module = moduleName.default || moduleName;
            const Mod =  Module(); // new Module() modified by lwf
            const name = Mod.name.charAt(0).toLowerCase() + Mod.name.slice(1);
            const cfgParent = !_.isUndefined(config[name]) ? config[name] : config[Mod.name];
            const cfg = cfgParent || {};
            const sm = this.get('StorageManager');
            cfg.pStylePrefix = config.pStylePrefix || '';
            if (!_.isUndefined(cfgParent) && !cfgParent) {
                cfg._disable = 1;
            }
            if (Mod.storageKey && Mod.store && Mod.load && sm) {
                cfg.stm = sm;
                const mth = name == 'domComponents' ? 'unshift' : 'push';
                this.get('storables')[mth](Mod);
            }
            cfg.em = this;
            Mod.init(cfg);
            !Mod.private && this.set(Mod.name, Mod);
            Mod.onLoad && this.get('toLoad').push(Mod);
            this.get('modules').push(Mod);
            return this;
        },
        init(editor) {
            this.set('Editor', editor);
        },
        getEditor() {
            return this.get('Editor');
        },
        handleUpdates(model, val, opt = {}) {
            if (opt.temporary) {
                return;
            }
            timedInterval && clearInterval(timedInterval);
            timedInterval = setTimeout(() => {
                if (!opt.avoidStore) {
                    this.set('changesCount', this.get('changesCount') + 1, opt);
                }
            }, 0);
        },
        componentHovered(editor, component, options) {
            const prev = this.previous('componentHovered');
            prev && this.trigger('component:unhovered', prev, options);
            component && this.trigger('component:hovered', component, options);
        },
        getSelected() {
            return this.get('selected').last();
        },
        getSelectedAll() {
            return this.get('selected').models;
        },
        setSelected(el, opts = {}) {
            const multiple = _.isArray(el);
            const els = multiple ? el : [el];
            const selected = this.get('selected');
            let added;
            multiple && this.removeSelected(selected.filter(s => !_.contains(els, s)));
            els.forEach(el => {
                const model = b.getModel(el, $);
                if (model && !model.get('selectable'))
                    return;
                !multiple && this.removeSelected(selected.filter(s => s !== model));
                this.addSelected(model, opts);
                added = model;
            });
        },
        addSelected(el, opts = {}) {
            const model = b.getModel(el, $);
            const models = _.isArray(model) ? model : [model];
            models.forEach(model => {
                if (model && !model.get('selectable'))
                    return;
                const selected = this.get('selected');
                opts.forceChange && selected.remove(model, opts);
                selected.push(model, opts);
            });
        },
        removeSelected(el, opts = {}) {
            this.get('selected').remove(b.getModel(el, $), opts);
        },
        toggleSelected(el, opts = {}) {
            const model = b.getModel(el, $);
            const models = _.isArray(model) ? model : [model];
            models.forEach(model => {
                if (this.get('selected').contains(model)) {
                    this.removeSelected(model, opts);
                } else {
                    this.addSelected(model, opts);
                }
            });
        },
        setHovered(el, opts = {}) {
            const model = b.getModel(el, $);
            if (model && !model.get('hoverable'))
                return;
            opts.forceChange && this.set('componentHovered', '');
            this.set('componentHovered', model, opts);
        },
        getHovered() {
            return this.get('componentHovered');
        },
        setComponents(components) {
            return this.get('DomComponents').setComponents(components);
        },
        getComponents() {
            var cmp = this.get('DomComponents');
            var cm = this.get('CodeManager');
            if (!cmp || !cm)
                return;
            var wrp = cmp.getComponents();
            return cm.getCode(wrp, 'json');
        },
        setStyle(style) {
            var rules = this.get('CssComposer').getAll();
            for (var i = 0, len = rules.length; i < len; i++)
                rules.pop();
            rules.add(style);
            return this;
        },
        getStyle() {
            return this.get('CssComposer').getAll();
        },
        setState(value) {
            this.set('state', value);
            return this;
        },
        getState() {
            return this.get('state');
        },
        getHtml() {
            const config = this.config;
            const exportWrapper = config.exportWrapper;
            const wrapperIsBody = config.wrapperIsBody;
            const js = config.jsInHtml ? this.getJs() : '';
            var wrp = this.get('DomComponents').getComponent();
            var html = this.get('CodeManager').getCode(wrp, 'html', {
                exportWrapper,
                wrapperIsBody
            });
            html += js ? `<script>${ js }</script>` : '';
            return html;
        },
        getCss(opts = {}) {
            const config = this.config;
            const wrapperIsBody = config.wrapperIsBody;
            const avoidProt = opts.avoidProtected;
            const keepUnusedStyles = !_.isUndefined(opts.keepUnusedStyles) ? opts.keepUnusedStyles : config.keepUnusedStyles;
            const cssc = this.get('CssComposer');
            const wrp = this.get('DomComponents').getComponent();
            const protCss = !avoidProt ? config.protectedCss : '';
            return protCss + this.get('CodeManager').getCode(wrp, 'css', {
                cssc,
                wrapperIsBody,
                keepUnusedStyles
            });
        },
        getJs() {
            var wrp = this.get('DomComponents').getWrapper();
            return this.get('CodeManager').getCode(wrp, 'js').trim();
        },
        store(clb) {
            var sm = this.get('StorageManager');
            var store = {};
            if (!sm)
                return;
            this.get('storables').forEach(m => {
                var obj = m.store(1);
                for (var el in obj)
                    store[el] = obj[el];
            });
            sm.store(store, res => {
                clb && clb(res);
                this.set('changesCount', 0);
                this.trigger('storage:store', store);
            });
            return store;
        },
        load(clb = null) {
            this.getCacheLoad(1, res => {
                this.get('storables').forEach(module => module.load(res));
                clb && clb(res);
            });
        },
        getCacheLoad(force, clb) {
            if (this.cacheLoad && !force)
                return this.cacheLoad;
            const sm = this.get('StorageManager');
            const load = [];
            if (!sm)
                return {};
            this.get('storables').forEach(m => {
                let key = m.storageKey;
                key = _.isFunction(key) ? key() : key;
                const keys = _.isArray(key) ? key : [key];
                keys.forEach(k => load.push(k));
            });
            sm.load(load, res => {
                this.cacheLoad = res;
                clb && clb(res);
                setTimeout(() => this.trigger('storage:load', res));
            });
        },
        getDeviceModel() {
            var name = this.get('device');
            return this.get('DeviceManager').get(name);
        },
        runDefault(opts = {}) {
            var command = this.get('Commands').get(this.config.defaultCommand);
            if (!command || this.defaultRunning)
                return;
            command.stop(this, this, opts);
            command.run(this, this, opts);
            this.defaultRunning = 1;
        },
        stopDefault(opts = {}) {
            var command = this.get('Commands').get(this.config.defaultCommand);
            if (!command)
                return;
            command.stop(this, this, opts);
            this.defaultRunning = 0;
        },
        refreshCanvas() {
            this.set('canvasOffset', null);
            this.set('canvasOffset', this.get('Canvas').getOffset());
        },
        clearSelection(win) {
            var w = win || window;
            w.getSelection().removeAllRanges();
        },
        getCurrentMedia() {
            const config = this.config;
            const device = this.getDeviceModel();
            const condition = config.mediaCondition;
            const preview = config.devicePreviewMode;
            const width = device && device.get('widthMedia');
            return device && width && !preview ? `(${ condition }: ${ width })` : '';
        },
        getWrapper() {
            return this.get('DomComponents').getWrapper();
        },
        setCurrentFrame(frameView) {
            return this.set('currentFrame', frameView);
        },
        getCurrentFrame() {
            return this.get('currentFrame');
        },
        getCurrentFrameModel() {
            return (this.getCurrentFrame() || {}).model;
        },
        getDirtyCount() {
            return this.get('changesCount');
        },
        getZoomDecimal() {
            return this.get('Canvas').getZoomDecimal();
        },
        getZoomMultiplier() {
            return this.get('Canvas').getZoomMultiplier();
        },
        setDragMode(value) {
            return this.set('dmode', value);
        },
        t(...args) {
            return this.get('I18n').t(...args);
        },
        inAbsoluteMode() {
            return this.get('dmode') === 'absolute';
        },
        destroyAll() {
            const {DomComponents, CssComposer, UndoManager, Panels, Canvas, Keymaps, RichTextEditor} = this.attributes;
            DomComponents.clear();
            CssComposer.clear();
            UndoManager.clear().removeAll();
            Panels.getPanels().reset();
            Canvas.getCanvasView().remove();
            Keymaps.removeAll();
            RichTextEditor.destroy();
            this.view.remove();
            this.stopListening();
            $(this.config.el).empty().attr(this.attrsOrig);
        },
        setEditing(value) {
            this.set('editing', value);
            return this;
        },
        isEditing() {
            return !!this.get('editing');
        },
        log(msg, opts = {}) {
            const {ns, level = 'debug'} = opts;
            this.trigger('log', msg, opts);
            level && this.trigger(`log:${ level }`, msg, opts);
            if (ns) {
                const logNs = `log-${ ns }`;
                this.trigger(logNs, msg, opts);
                level && this.trigger(`${ logNs }:${ level }`, msg, opts);
            }
        },
        logInfo(msg, opts) {
            this.log(msg, langx.mixin({},opts, {evel: 'info' }));
        },
        logWarning(msg, opts) {
            this.log(msg, langx.mixin({},opts, {evel: 'warning' }));
        },
        logError(msg, opts) {
            this.log(msg, langx.mixin({},opts, {evel: 'error' }));
        },
        initBaseColorPicker(el, opts = {}) {
            const config = this.getConfig();
            const {
                colorPicker = {}
            } = config;
            const elToAppend = config.el;
            const ppfx = config.stylePrefix;
            return $(el).spectrum(langx.mixin({
                    containerClassName: `${ ppfx }one-bg ${ ppfx }two-color`,
                    appendTo: elToAppend || 'body',
                    maxSelectionSize: 8,
                    showPalette: true,
                    palette: [],
                    showAlpha: true,
                    chooseText: 'Ok',
                    cancelText: '\u2A2F',
                },opts,colorPicker)
            );
        },
        data(el, name, value) {
            const varName = '_gjs-data';
            if (!el[varName]) {
                el[varName] = {};
            }
            if (_.isUndefined(value)) {
                return el[varName][name];
            } else {
                el[varName][name] = value;
            }
        }
    });
});