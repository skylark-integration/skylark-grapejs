/**
 * skylark-grapejs - A version of garpejs that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-grapejs/
 * @license MIT
 */
define(["./ComponentImageView","./ComponentView"],function(e,t){"use strict";return e.extend({tagName:"div",events:{},initialize(e){t.prototype.initialize.apply(this,arguments);const{model:r}=this,i=["loop","autoplay","controls","color","rel","modestbranding","poster"].map(e=>`change:${e}`).join(" ");this.listenTo(r,"change:provider",this.updateProvider),this.listenTo(r,"change:src",this.updateSrc),this.listenTo(r,i,this.updateVideo)},updateProvider(){var e=this.model.get("provider");this.el.innerHTML="",this.el.appendChild(this.renderByProvider(e))},updateSrc(){const{model:e,videoEl:t}=this;if(!t)return;const r=e.get("provider");let i=e.get("src");switch(r){case"yt":i=e.getYoutubeSrc();break;case"ytnc":i=e.getYoutubeNoCookieSrc();break;case"vi":i=e.getVimeoSrc()}t.src=i},updateVideo(){var e=this.model.get("provider"),t=this.videoEl,r=this.model;switch(e){case"yt":case"ytnc":case"vi":this.model.trigger("change:videoId");break;default:t.loop=r.get("loop"),t.autoplay=r.get("autoplay"),t.controls=r.get("controls"),t.poster=r.get("poster")}},renderByProvider(e){var t;switch(e){case"yt":t=this.renderYoutube();break;case"ytnc":t=this.renderYoutubeNoCookie();break;case"vi":t=this.renderVimeo();break;default:t=this.renderSource()}return this.videoEl=t,t},renderSource(){var e=document.createElement("video");return e.src=this.model.get("src"),this.initVideoEl(e),e},renderYoutube(){var e=document.createElement("iframe");return e.src=this.model.getYoutubeSrc(),e.frameBorder=0,e.setAttribute("allowfullscreen",!0),this.initVideoEl(e),e},renderYoutubeNoCookie(){var e=document.createElement("iframe");return e.src=this.model.getYoutubeNoCookieSrc(),e.frameBorder=0,e.setAttribute("allowfullscreen",!0),this.initVideoEl(e),e},renderVimeo(){var e=document.createElement("iframe");return e.src=this.model.getVimeoSrc(),e.frameBorder=0,e.setAttribute("allowfullscreen",!0),this.initVideoEl(e),e},initVideoEl(e){e.className=this.ppfx+"no-pointer",e.style.height="100%",e.style.width="100%"},render(...t){e.prototype.render.apply(this,t),this.updateClasses();var r=this.model.get("provider");return this.el.appendChild(this.renderByProvider(r)),this.updateVideo(),this}})});
//# sourceMappingURL=../../sourcemaps/dom_components/view/ComponentVideoView.js.map
