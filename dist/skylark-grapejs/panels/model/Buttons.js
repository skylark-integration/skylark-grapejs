/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["skylark-backbone","./Button"],function(t,e){"use strict";var n=t.Collection.extend({model:e,deactivateAllExceptOne(t,e){this.forEach((n,l)=>{n!==t&&(n.set("active",!1),e&&n.get("buttons").length&&n.get("buttons").deactivateAllExceptOne(t,e))})},deactivateAll(t,e){const n=t||"";this.forEach(t=>{t.get("context")==n&&t!==e&&(t.set("active",!1,{silent:1}),t.trigger("updateActive",{fromCollection:1}))})},disableAllButtons(t){var e=t||"";this.forEach((t,n)=>{t.get("context")==e&&t.set("disable",!0)})},disableAllButtonsExceptOne(t,e){this.forEach((n,l)=>{n!==t&&(n.set("disable",!0),e&&n.get("buttons").length&&n.get("buttons").disableAllButtonsExceptOne(t,e))})}});return e.Buttons=n,n});
//# sourceMappingURL=../../sourcemaps/panels/model/Buttons.js.map
