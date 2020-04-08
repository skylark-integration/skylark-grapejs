define([
    "skylark-langx/langx",
    'skylark-underscore',
    './config'
], function (langx,_, config) {
    'use strict';
    const isObj = el => !Array.isArray(el) && el !== null && typeof el === 'object';
    const deepAssign = (...args) => {
        const target = lang.mixin({},args[0] );
        for (let i = 1; i < args.length; i++) {
            const source = lang.mixin({},args[i] );
            for (let key in source) {
                const targValue = target[key];
                const srcValue = source[key];
                if (isObj(targValue) && isObj(srcValue)) {
                    target[key] = deepAssign(targValue, srcValue);
                } else {
                    target[key] = srcValue;
                }
            }
        }
        return target;
    };
    return () => {
        return {
            name: 'I18n',
            config,
            init(opts = {}) {
                this.config = langx.mixin({},config,opts,{
                    messages: langx.mixin({},
                        config.messages,
                        opts.messages
                    )
                });
                if (this.config.detectLocale) {
                    this.config.locale = this._localLang();
                }
                this.em = opts.em;
                return this;
            },
            getConfig() {
                return this.config;
            },
            setLocale(locale) {
                const {em, config} = this;
                const evObj = {
                    value: locale,
                    valuePrev: config.locale
                };
                em && em.trigger('i18n:locale', evObj);
                config.locale = locale;
                return this;
            },
            getLocale() {
                return this.config.locale;
            },
            getMessages(lang, opts = {}) {
                const {messages} = this.config;
                lang && !messages[lang] && this._debug(`'${ lang }' i18n lang not found`, opts);
                return lang ? messages[lang] : messages;
            },
            setMessages(msg) {
                const {em, config} = this;
                config.messages = msg;
                em && em.trigger('i18n:update', msg);
                return this;
            },
            addMessages(msg) {
                const {em} = this;
                const {messages} = this.config;
                em && em.trigger('i18n:add', msg);
                this.setMessages(deepAssign(messages, msg));
                return this;
            },
            t(key, opts = {}) {
                const {config} = this;
                const param = opts.params || {};
                const locale = opts.l || this.getLocale();
                const localeFlb = opts.lFlb || config.localeFallback;
                let result = this._getMsg(key, locale, opts);
                if (!result)
                    result = this._getMsg(key, localeFlb, opts);
                !result && this._debug(`'${ key }' i18n key not found in '${ locale }' lang`, opts);
                result = result && _.isString(result) ? this._addParams(result, param) : result;
                return result;
            },
            _localLang() {
                const nav = window.navigator || {};
                const lang = nav.language || nav.userLanguage;
                return lang ? lang.split('-')[0] : 'en';
            },
            _addParams(str, params) {
                const reg = new RegExp(`\{([\\w\\d-]*)\}`, 'g');
                return str.replace(reg, (m, val) => params[val] || '').trim();
            },
            _getMsg(key, locale, opts = {}) {
                const msgSet = this.getMessages(locale, opts);
                if (!msgSet)
                    return;
                let result = msgSet[key];
                if (!result && key.indexOf('.') > 0) {
                    result = key.split('.').reduce((lang, key) => {
                        if (_.isUndefined(lang))
                            return;
                        return lang[key];
                    }, msgSet);
                }
                return result;
            },
            _debug(str, opts = {}) {
                const {em, config} = this;
                (opts.debug || config.debug) && em && em.logWarning(str);
            }
        };
    };
});