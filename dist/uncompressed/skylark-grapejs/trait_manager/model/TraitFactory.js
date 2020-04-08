define(function () {
    'use strict';
    return (config = {}) => ({
        build(props) {
            var objs = [];
            if (typeof props === 'string')
                props = [props];
            for (var i = 0; i < props.length; i++) {
                var obj = {};
                var prop = props[i];
                obj.name = prop;
                switch (prop) {
                case 'target':
                    obj.type = 'select';
                    break;
                }
                switch (prop) {
                case 'target':
                    obj.options = config.optionsTarget;
                    break;
                }
                objs.push(obj);
            }
            return objs;
        }
    });
});