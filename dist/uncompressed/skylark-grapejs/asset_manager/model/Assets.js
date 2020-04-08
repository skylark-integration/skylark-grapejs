define([
    'skylark-backbone/Collection',
    './AssetImage',
    './../view/AssetImageView',
    '../../domain_abstract/model/TypeableCollection'
], function (Collection, AssetImage, AssetImageView, TypeableCollection) {
    'use strict';
    return Collection.extend(TypeableCollection).extend({
        types: [{
                id: 'image',
                model: AssetImage,
                view: AssetImageView,
                isType(value) {
                    if (typeof value == 'string') {
                        return {
                            type: 'image',
                            src: value
                        };
                    }
                    return value;
                }
            }]
    });
});