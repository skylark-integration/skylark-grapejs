define(function () {
    'use strict';
    return {
        stylePrefix: 'comp-',
        wrapperId: 'wrapper',
        wrapperName: 'Body',
        wrapper: {
            removable: false,
            copyable: false,
            draggable: false,
            components: [],
            traits: [],
            stylable: [
                'background',
                'background-color',
                'background-image',
                'background-repeat',
                'background-attachment',
                'background-position',
                'background-size'
            ]
        },
        components: [],
        draggableComponents: 1,
        storeWrapper: 0,
        processor: 0,
        voidElements: [
            'area',
            'base',
            'br',
            'col',
            'embed',
            'hr',
            'img',
            'input',
            'keygen',
            'link',
            'menuitem',
            'meta',
            'param',
            'source',
            'track',
            'wbr'
        ]
    };
});