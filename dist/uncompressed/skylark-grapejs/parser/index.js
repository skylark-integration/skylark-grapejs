define([
    "skylark-langx/langx",
    './config/config',
    './model/ParserCss',
    './model/ParserHtml'
], function (langx,defaults, parserCss, parserHtml) {
    'use strict';
    return () => {
        let conf = {};
        let pHtml, pCss;
        return {
            compTypes: '',
            parserCss: null,
            parserHtml: null,
            name: 'Parser',
            getConfig() {
                return conf;
            },
            init(config = {}) {
                conf = langx.mixin({},defaults,config);
                conf.Parser = this;
                pHtml = new parserHtml(conf);
                pCss = new parserCss(conf);
                this.em = conf.em;
                this.parserCss = pCss;
                this.parserHtml = pHtml;
                return this;
            },
            parseHtml(str) {
                const {em, compTypes} = this;
                pHtml.compTypes = em ? em.get('DomComponents').getTypes() : compTypes;
                return pHtml.parse(str, pCss);
            },
            parseCss(str) {
                return pCss.parse(str);
            }
        };
    };
});