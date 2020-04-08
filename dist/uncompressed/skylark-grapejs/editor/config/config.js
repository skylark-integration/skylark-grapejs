define(function () {
    'use strict';
    return {
        stylePrefix: 'gjs-',
        components: '',
        style: '',
        fromElement: 0,
        noticeOnUnload: true,
        showOffsets: false,
        showOffsetsSelected: false,
        forceClass: true,
        height: '900px',
        width: '100%',
        log: [
            'warning',
            'error'
        ],
        baseCss: `
    * {
      box-sizing: border-box;
    }
    html, body, [data-gjs-type=wrapper] {
      min-height: 100%;
    }
    body {
      margin: 0;
      height: 100%;
      background-color: #fff
    }
    [data-gjs-type=wrapper] {
      overflow: auto;
      overflow-x: hidden;
    }

    * ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1)
    }

    * ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2)
    }

    * ::-webkit-scrollbar {
      width: 10px
    }
  `,
        protectedCss: '* { box-sizing: border-box; } body {margin: 0;}',
        canvasCss: '',
        defaultCommand: 'select-comp',
        showToolbar: 1,
        allowScripts: 0,
        showDevices: 1,
        devicePreviewMode: 0,
        mediaCondition: 'max-width',
        tagVarStart: '{[ ',
        tagVarEnd: ' ]}',
        keepEmptyTextNodes: 0,
        jsInHtml: true,
        nativeDnD: 1,
        multipleSelection: 1,
        exportWrapper: 0,
        wrapperIsBody: 1,
        avoidInlineStyle: 1,
        avoidDefaults: 1,
        clearStyles: 0,
        dragMode: 0,
        cssIcons: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        el: '',
        i18n: {},
        undoManager: {},
        assetManager: {},
        canvas: {},
        layers: {},
        storageManager: {},
        richTextEditor: {},
        domComponents: {},
        modal: {},
        codeManager: {},
        panels: {},
        commands: {},
        cssComposer: {},
        selectorManager: {},
        deviceManager: {
            devices: [
                {
                    id: 'desktop',
                    name: 'Desktop',
                    width: ''
                },
                {
                    id: 'tablet',
                    name: 'Tablet',
                    width: '768px',
                    widthMedia: '992px'
                },
                {
                    id: 'mobileLandscape',
                    name: 'Mobile landscape',
                    width: '568px',
                    widthMedia: '768px'
                },
                {
                    id: 'mobilePortrait',
                    name: 'Mobile portrait',
                    width: '320px',
                    widthMedia: '480px'
                }
            ]
        },
        styleManager: {
            sectors: [
                {
                    name: 'General',
                    open: false,
                    buildProps: [
                        'float',
                        'display',
                        'position',
                        'top',
                        'right',
                        'left',
                        'bottom'
                    ]
                },
                {
                    name: 'Flex',
                    open: false,
                    buildProps: [
                        'flex-direction',
                        'flex-wrap',
                        'justify-content',
                        'align-items',
                        'align-content',
                        'order',
                        'flex-basis',
                        'flex-grow',
                        'flex-shrink',
                        'align-self'
                    ]
                },
                {
                    name: 'Dimension',
                    open: false,
                    buildProps: [
                        'width',
                        'height',
                        'max-width',
                        'min-height',
                        'margin',
                        'padding'
                    ]
                },
                {
                    name: 'Typography',
                    open: false,
                    buildProps: [
                        'font-family',
                        'font-size',
                        'font-weight',
                        'letter-spacing',
                        'color',
                        'line-height',
                        'text-align',
                        'text-shadow'
                    ],
                    properties: [{
                            property: 'text-align',
                            list: [
                                {
                                    value: 'left',
                                    className: 'fa fa-align-left'
                                },
                                {
                                    value: 'center',
                                    className: 'fa fa-align-center'
                                },
                                {
                                    value: 'right',
                                    className: 'fa fa-align-right'
                                },
                                {
                                    value: 'justify',
                                    className: 'fa fa-align-justify'
                                }
                            ]
                        }]
                },
                {
                    name: 'Decorations',
                    open: false,
                    buildProps: [
                        'border-radius-c',
                        'background-color',
                        'border-radius',
                        'border',
                        'box-shadow',
                        'background'
                    ]
                },
                {
                    name: 'Extra',
                    open: false,
                    buildProps: [
                        'transition',
                        'perspective',
                        'transform'
                    ]
                }
            ]
        },
        blockManager: {},
        traitManager: {},
        textViewCode: 'Code',
        keepUnusedStyles: 0,
        multiFrames: 0
    };
});