/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./Button"],function(t,e){"use strict";return t.Collection.extend({model:e,deactivateAllExceptOne(t,e){this.forEach((l,n)=>{l!==t&&(l.set("active",!1),e&&l.get("buttons").length&&l.get("buttons").deactivateAllExceptOne(t,e))})},deactivateAll(t,e){const l=t||"";this.forEach(t=>{t.get("context")==l&&t!==e&&(t.set("active",!1,{silent:1}),t.trigger("updateActive",{fromCollection:1}))})},disableAllButtons(t){var e=t||"";this.forEach((t,l)=>{t.get("context")==e&&t.set("disable",!0)})},disableAllButtonsExceptOne(t,e){this.forEach((l,n)=>{l!==t&&(l.set("disable",!0),e&&l.get("buttons").length&&l.get("buttons").disableAllButtonsExceptOne(t,e))})}})});
//# sourceMappingURL=../../sourcemaps/panels/model/Buttons.js.map
