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
                conf = {...defaults,...config};
                conf.Parser = this;
                pHtml =  parserHtml(conf);  // modified by lwf // new parserHtml(conf)
                pCss = parserCss(conf); // modified by lwf  // new parserCss
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