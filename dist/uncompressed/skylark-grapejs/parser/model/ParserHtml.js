define(['skylark-underscore'], function (a) {
    'use strict';
    return config => {
        var TEXT_NODE = 'span';
        var c = config;
        var modelAttrStart = 'data-gjs-';
        return {
            compTypes: '',
            modelAttrStart,
            splitPropsFromAttr(attr = {}) {
                const props = {};
                const attrs = {};
                a.each(attr, (value, key) => {
                    if (key.indexOf(this.modelAttrStart) === 0) {
                        const modelAttr = key.replace(modelAttrStart, '');
                        const valueLen = value.length;
                        const valStr = value && a.isString(value);
                        const firstChar = valStr && value.substr(0, 1);
                        const lastChar = valStr && value.substr(valueLen - 1);
                        value = value === 'true' ? true : value;
                        value = value === 'false' ? false : value;
                        try {
                            value = firstChar == '{' && lastChar == '}' || firstChar == '[' && lastChar == ']' ? JSON.parse(value) : value;
                        } catch (e) {
                        }
                        props[modelAttr] = value;
                    } else {
                        attrs[key] = value;
                    }
                });
                return {
                    props,
                    attrs
                };
            },
            parseStyle(str) {
                var result = {};
                var decls = str.split(';');
                for (var i = 0, len = decls.length; i < len; i++) {
                    var decl = decls[i].trim();
                    if (!decl)
                        continue;
                    var prop = decl.split(':');
                    result[prop[0].trim()] = prop.slice(1).join(':').trim();
                }
                return result;
            },
            parseClass(str) {
                const result = [];
                const cls = str.split(' ');
                for (let i = 0, len = cls.length; i < len; i++) {
                    const cl = cls[i].trim();
                    if (!cl)
                        continue;
                    result.push(cl);
                }
                return result;
            },
            parseNode(el) {
                const result = [];
                const nodes = el.childNodes;
                for (var i = 0, len = nodes.length; i < len; i++) {
                    const node = nodes[i];
                    const attrs = node.attributes || [];
                    const attrsLen = attrs.length;
                    const nodePrev = result[result.length - 1];
                    const nodeChild = node.childNodes.length;
                    const ct = this.compTypes;
                    let model = {};
                    if (ct) {
                        let obj = '';
                        let type = node.getAttribute && node.getAttribute(`${ modelAttrStart }type`);
                        if (type) {
                            model = { type };
                        } else {
                            for (let it = 0; it < ct.length; it++) {
                                const compType = ct[it];
                                obj = compType.model.isComponent(node);
                                if (obj) {
                                    if (typeof obj !== 'object') {
                                        obj = { type: compType.id };
                                    }
                                    break;
                                }
                            }
                            model = obj;
                        }
                    }
                    if (!model.tagName) {
                        model.tagName = node.tagName ? node.tagName.toLowerCase() : '';
                    }
                    if (attrsLen) {
                        model.attributes = {};
                    }
                    for (let j = 0; j < attrsLen; j++) {
                        const nodeName = attrs[j].nodeName;
                        let nodeValue = attrs[j].nodeValue;
                        if (nodeName == 'style') {
                            model.style = this.parseStyle(nodeValue);
                        } else if (nodeName == 'class') {
                            model.classes = this.parseClass(nodeValue);
                        } else if (nodeName == 'contenteditable') {
                            continue;
                        } else if (nodeName.indexOf(modelAttrStart) === 0) {
                            const modelAttr = nodeName.replace(modelAttrStart, '');
                            const valueLen = nodeValue.length;
                            const firstChar = nodeValue && nodeValue.substr(0, 1);
                            const lastChar = nodeValue && nodeValue.substr(valueLen - 1);
                            nodeValue = nodeValue === 'true' ? true : nodeValue;
                            nodeValue = nodeValue === 'false' ? false : nodeValue;
                            try {
                                nodeValue = firstChar == '{' && lastChar == '}' || firstChar == '[' && lastChar == ']' ? JSON.parse(nodeValue) : nodeValue;
                            } catch (e) {
                            }
                            model[modelAttr] = nodeValue;
                        } else {
                            model.attributes[nodeName] = nodeValue;
                        }
                    }
                    if (nodeChild && !model.components) {
                        const firstChild = node.childNodes[0];
                        if (nodeChild === 1 && firstChild.nodeType === 3) {
                            !model.type && (model.type = 'text');
                            model.content = firstChild.nodeValue;
                        } else {
                            model.components = this.parseNode(node);
                        }
                    }
                    if (model.type == 'textnode') {
                        if (nodePrev && nodePrev.type == 'textnode') {
                            nodePrev.content += model.content;
                            continue;
                        }
                        if (!config.keepEmptyTextNodes) {
                            const content = node.nodeValue;
                            if (content != ' ' && !content.trim()) {
                                continue;
                            }
                        }
                    }
                    const comps = model.components;
                    if (!model.type && comps) {
                        let allTxt = 1;
                        let foundTextNode = 0;
                        for (let ci = 0; ci < comps.length; ci++) {
                            const comp = comps[ci];
                            const cType = comp.type;
                            if ([
                                    'text',
                                    'textnode'
                                ].indexOf(cType) < 0 && c.textTags.indexOf(comp.tagName) < 0) {
                                allTxt = 0;
                                break;
                            }
                            if (cType == 'textnode') {
                                foundTextNode = 1;
                            }
                        }
                        if (allTxt && foundTextNode) {
                            model.type = 'text';
                        }
                    }
                    if (!model.tagName && model.type != 'textnode') {
                        continue;
                    }
                    result.push(model);
                }
                return result;
            },
            parse(str, parserCss) {
                var config = c.em && c.em.get('Config') || {};
                var res = {
                    html: '',
                    css: ''
                };
                var el = document.createElement('div');
                el.innerHTML = str;
                var scripts = el.querySelectorAll('script');
                var i = scripts.length;
                if (!config.allowScripts) {
                    while (i--)
                        scripts[i].parentNode.removeChild(scripts[i]);
                }
                if (parserCss) {
                    var styleStr = '';
                    var styles = el.querySelectorAll('style');
                    var j = styles.length;
                    while (j--) {
                        styleStr = styles[j].innerHTML + styleStr;
                        styles[j].parentNode.removeChild(styles[j]);
                    }
                    if (styleStr)
                        res.css = parserCss.parse(styleStr);
                }
                var result = this.parseNode(el);
                if (result.length == 1)
                    result = result[0];
                res.html = result;
                return res;
            }
        };
    };
});