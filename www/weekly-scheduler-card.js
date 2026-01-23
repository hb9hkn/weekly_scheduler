!function(t){"use strict";function e(t,e,s,i){var r,o=arguments.length,n=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,s,n):r(e,s))||n);return o>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const s=globalThis,i=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(s,t,r)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,r))(e)})(t):t,{is:d,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:u,getOwnPropertySymbols:p,getPrototypeOf:y}=Object,f=globalThis,g=f.trustedTypes,_=g?g.emptyScript:"",v=f.reactiveElementPolyfillSupport,b=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!d(t,e),x={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);r?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=y(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...u(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(i)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),r=s.litNonce;void 0!==r&&e.setAttribute("nonce",r),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=i;const o=r.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const o=this.constructor;if(!1===i&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??$)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,v?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.2");const S=globalThis,E=t=>t,A=S.trustedTypes,C=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,D="?"+T,M=`<${D}>`,P=document,O=()=>P.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,W="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,V=/>/g,z=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,I=/"/g,L=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),X=new WeakMap,J=P.createTreeWalker(P,129);function K(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const Y=(t,e)=>{const s=t.length-1,i=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=R;for(let e=0;e<s;e++){const s=t[e];let a,l,d=-1,c=0;for(;c<s.length&&(n.lastIndex=c,l=n.exec(s),null!==l);)c=n.lastIndex,n===R?"!--"===l[1]?n=N:void 0!==l[1]?n=V:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=z):void 0!==l[3]&&(n=z):n===z?">"===l[0]?(n=r??R,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?z:'"'===l[3]?I:j):n===I||n===j?n=z:n===N||n===V?n=R:(n=z,r=void 0);const h=n===z&&t[e+1].startsWith("/>")?" ":"";o+=n===R?s+M:d>=0?(i.push(a),s.slice(0,d)+k+s.slice(d)+T+h):s+T+(-2===d?e:h)}return[K(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Z{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,d]=Y(t,e);if(this.el=Z.createElement(l,s),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=J.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(k)){const e=d[o++],s=i.getAttribute(t).split(T),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?st:"?"===n[1]?it:"@"===n[1]?rt:et}),i.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(T),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),J.nextNode(),a.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===D)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(T,t+1));)a.push({type:7,index:r}),t+=T.length-1}r++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===q)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=U(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=G(t,r._$AS(t,e.values),r,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);J.currentNode=i;let r=J.nextNode(),o=0,n=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new ot(r,this,t)),this._$AV.push(e),a=s[++n]}o!==a?.index&&(r=J.nextNode(),o++)}return J.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),U(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=X.get(t.strings);return void 0===e&&X.set(t.strings,e=new Z(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new tt(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=E(t).nextSibling;E(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=F}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(void 0===r)t=G(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=G(this,i[s+n],e,n),a===q&&(a=this._$AH[n]),o||=!U(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!i&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class rt extends et{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??F)===q)return;const s=this._$AH,i=t===F&&s!==F||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==F&&(s===F||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const nt=S.litHtmlPolyfillSupport;nt?.(Z,tt),(S.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;class lt extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new tt(e.insertBefore(O(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const dt=at.litElementPolyfillSupport;dt?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:$},ut=(t=ht,e,s)=>{const{kind:i,metadata:r}=s;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function pt(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function yt(t){return pt({...t,state:!0,attribute:!1})}const ft=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],gt={monday:"Mon",tuesday:"Tue",wednesday:"Wed",thursday:"Thu",friday:"Fri",saturday:"Sat",sunday:"Sun"};function _t(t){const e=t%2*30;return`${Math.floor(t/2).toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`}function vt(t){const[e,s]=t.split(":").map(Number);return 2*e+Math.floor(s/30)}function bt(){const t=(new Date).getDay();return ft[0===t?6:t-1]}function mt(){const t=new Date;return 2*t.getHours()+Math.floor(t.getMinutes()/30)}function $t(t){const e={monday:[],tuesday:[],wednesday:[],thursday:[],friday:[],saturday:[],sunday:[]};for(const s of ft)e[s]=t[s].map(t=>({...t}));return e}function xt(t,e,s,i,r){const o=$t(t),n=_t(s),a=i>=48?"00:00":_t(i);o[e]=o[e].filter(t=>{const e=vt(t.start);return("00:00"===t.end?48:vt(t.end))<=s||e>=i});const l=[];for(const r of t[e]){const t=vt(r.start),e="00:00"===r.end?48:vt(r.end);t<s&&e>s&&l.push({start:r.start,end:_t(s),value:r.value}),t<i&&e>i&&l.push({start:_t(i),end:r.end,value:r.value})}return o[e].push({start:n,end:a,value:r}),o[e].push(...l),o[e]=function(t){if(0===t.length)return[];const e=[{...t[0]}];for(let s=1;s<t.length;s++){const i=e[e.length-1],r=t[s];("00:00"===i.end?48:vt(i.end))===vt(r.start)&&i.value===r.value?e[e.length-1]={start:i.start,end:r.end,value:i.value}:e.push({...r})}return e}(o[e].sort((t,e)=>vt(t.start)-vt(e.start))),o}function wt(t,e,s,i){const r=$t(t),o=[];for(const t of r[e]){const e=vt(t.start),r="00:00"===t.end?48:vt(t.end);r<=s||e>=i?o.push(t):(e<s&&o.push({start:t.start,end:_t(s),value:t.value}),r>i&&o.push({start:_t(i),end:t.end,value:t.value}))}return r[e]=o.sort((t,e)=>vt(t.start)-vt(e.start)),r}function St(t,e,s){for(const i of t[e]){const t=vt(i.start),e="00:00"===i.end?48:vt(i.end);if(s>=t&&s<e)return i.value}return null}function Et(t,e,s){return null!==St(t,e,s)}function At(t,e,s){const i=$t(t),r=i[e].map(t=>({...t}));for(const t of s)t!==e&&(i[t]=r.map(t=>({...t})));return i}function Ct(t,e){return{isSelecting:!0,startDay:t,startSlot:e,endDay:t,endSlot:e}}function kt(t,e,s){return t.isSelecting?{...t,endDay:e,endSlot:s}:t}function Tt(t,e){const s=e.getBoundingClientRect();let i,r;if("touches"in t){if(0===t.touches.length)return null;i=t.touches[0].clientX,r=t.touches[0].clientY}else i=t.clientX,r=t.clientY;const o=i-s.left,n=r-s.top,a=o-50;if(a<0)return null;const l=(s.width-50)/7,d=Math.floor(a/l);if(d<0||d>=7)return null;const c=n-30+e.scrollTop;if(c<0)return null;const h=(e.scrollHeight-30-48)/48,u=Math.floor(c/h);return u<0||u>=48?null:{day:ft[d],slot:u}}let Dt=class extends lt{constructor(){super(...arguments),this.schedule={monday:[],tuesday:[],wednesday:[],thursday:[],friday:[],saturday:[],sunday:[]},this.helperType="input_number",this.defaultValue=50,this._selection={isSelecting:!1,startDay:null,startSlot:null,endDay:null,endSlot:null},this._currentSlot=mt(),this._currentDay=bt(),this._slotProgress=0,this._handleMouseMove=t=>{const e=this.shadowRoot?.querySelector(".grid-container");if(!e)return;const s=Tt(t,e);s&&(this._selection=kt(this._selection,s.day,s.slot))},this._handleMouseUp=()=>{document.removeEventListener("mousemove",this._handleMouseMove),document.removeEventListener("mouseup",this._handleMouseUp),document.body.style.userSelect="",document.body.style.webkitUserSelect="",this._finishSelection()}}connectedCallback(){super.connectedCallback(),this._startTimeUpdates()}disconnectedCallback(){super.disconnectedCallback(),this._stopTimeUpdates()}_startTimeUpdates(){this._updateCurrentTime(),this._timeUpdateInterval=window.setInterval(()=>{this._updateCurrentTime()},3e4)}_stopTimeUpdates(){this._timeUpdateInterval&&clearInterval(this._timeUpdateInterval)}_updateCurrentTime(){this._currentSlot=mt(),this._currentDay=bt(),this._slotProgress=(new Date).getMinutes()%30/30}_handleMouseDown(t){const e=this.shadowRoot?.querySelector(".grid-container");if(!e)return;const s=Tt(t,e);s&&(t.preventDefault(),document.body.style.userSelect="none",document.body.style.webkitUserSelect="none",this._selection=Ct(s.day,s.slot),document.addEventListener("mousemove",this._handleMouseMove),document.addEventListener("mouseup",this._handleMouseUp))}_handleTouchStart(t){const e=this.shadowRoot?.querySelector(".grid-container");if(!e)return;const s=Tt(t,e);s&&(t.preventDefault(),this._selection=Ct(s.day,s.slot))}_handleTouchMove(t){const e=this.shadowRoot?.querySelector(".grid-container");if(!e)return;const s=Tt(t,e);s&&(t.preventDefault(),this._selection=kt(this._selection,s.day,s.slot))}_handleTouchEnd(){this._finishSelection()}_finishSelection(){const t=function(t){if(!t.startDay||null===t.startSlot||!t.endDay||null===t.endSlot)return null;const e=ft.indexOf(t.startDay),s=ft.indexOf(t.endDay),i=Math.min(e,s),r=Math.max(e,s);return{days:ft.slice(i,r+1),startSlot:Math.min(t.startSlot,t.endSlot),endSlot:Math.max(t.startSlot,t.endSlot)+1}}(this._selection);if(this._selection={isSelecting:!1,startDay:null,startSlot:null,endDay:null,endSlot:null},!t)return;let e=!1;for(const s of t.days){for(let i=t.startSlot;i<t.endSlot;i++)if(Et(this.schedule,s,i)){e=!0;break}if(e)break}this.dispatchEvent(new CustomEvent("selection-complete",{detail:{days:t.days,startSlot:t.startSlot,endSlot:t.endSlot,action:e?"remove":"add"},bubbles:!0,composed:!0}))}_getIntensityClass(t){return null===t?"":"boolean"==typeof t?t?"intensity-high":"":t<=33?"intensity-low":t<=66?"intensity-medium":"intensity-high"}_renderTimeLabel(t){const e=_t(t);return B`
      <div class="time-label ${t%4==0?"even-hour":""}">
        ${t%2==0?e:B`&nbsp;`}
      </div>
    `}_renderCell(t,e){const s=St(this.schedule,t,e),i=null!==s,r=function(t,e,s){if(!t.isSelecting||!t.startDay||null===t.startSlot||!t.endDay||null===t.endSlot)return!1;const i=ft.indexOf(t.startDay),r=ft.indexOf(t.endDay),o=Math.min(i,r),n=Math.max(i,r),a=ft.indexOf(e);if(a<o||a>n)return!1;const l=Math.min(t.startSlot,t.endSlot),d=Math.max(t.startSlot,t.endSlot);return s>=l&&s<=d}(this._selection,t,e),o=t===this._currentDay&&e===this._currentSlot,n=["cell",i?"active":"",i?this._getIntensityClass(s):"",r?"selected":"",o?"now-row":""].filter(Boolean).join(" ");return B`
      <div class="${n}" data-day="${t}" data-slot="${e}">
        ${o?B`<div
              class="now-indicator"
              style="top: ${100*this._slotProgress}%"
            ></div>`:""}
        ${i&&"input_number"===this.helperType&&"number"==typeof s?B`<span class="cell-value">${Math.round(s)}</span>`:""}
      </div>
    `}render(){const t=Array.from({length:48},(t,e)=>e);return B`
      <div
        class="grid-container"
        @mousedown=${this._handleMouseDown}
        @touchstart=${this._handleTouchStart}
        @touchmove=${this._handleTouchMove}
        @touchend=${this._handleTouchEnd}
      >
        <!-- Corner cell -->
        <div class="corner-cell"></div>

        <!-- Day headers -->
        ${ft.map(t=>B`
            <div class="header-cell ${t===this._currentDay?"today":""}">
              ${gt[t]}
            </div>
          `)}

        <!-- Grid rows -->
        ${t.map(t=>B`
            ${this._renderTimeLabel(t)}
            ${ft.map(e=>this._renderCell(e,t))}
          `)}
      </div>
    `}};Dt.styles=a`
    :host {
      display: block;
      --grid-bg: var(--card-background-color, #fff);
      --grid-border: var(--divider-color, #e0e0e0);
      --cell-active: var(--primary-color, #03a9f4);
      --cell-hover: var(--secondary-background-color, #f5f5f5);
      --cell-selected: rgba(3, 169, 244, 0.3);
      --now-indicator: var(--error-color, #f44336);
      --text-primary: var(--primary-text-color, #212121);
      --text-secondary: var(--secondary-text-color, #757575);
    }

    .grid-container {
      display: grid;
      grid-template-columns: 50px repeat(7, 1fr);
      grid-template-rows: 30px repeat(48, minmax(14px, 1fr));
      gap: 1px;
      background: var(--grid-border);
      border: 1px solid var(--grid-border);
      border-radius: 4px;
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 600px;
      max-height: 80vh;
      user-select: none;
    }

    .header-cell {
      background: var(--grid-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 12px;
      color: var(--text-primary);
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .header-cell.today {
      background: var(--cell-active);
      color: white;
    }

    .time-label {
      background: var(--grid-bg);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      font-size: 10px;
      color: var(--text-secondary);
      padding-top: 2px;
      position: sticky;
      left: 0;
      z-index: 1;
      min-height: 14px;
    }

    .time-label.even-hour {
      font-weight: 500;
    }

    .cell {
      background: var(--grid-bg);
      position: relative;
      cursor: pointer;
      transition: background-color 0.1s;
      min-height: 12px;
    }

    .cell:hover {
      background: var(--cell-hover);
    }

    .cell.active {
      background: var(--cell-active);
    }

    .cell.active.intensity-low {
      opacity: 0.4;
    }

    .cell.active.intensity-medium {
      opacity: 0.7;
    }

    .cell.active.intensity-high {
      opacity: 1;
    }

    .cell.selected {
      background: var(--cell-selected) !important;
    }

    .cell.now-row {
      position: relative;
    }

    .now-indicator {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--now-indicator);
      z-index: 3;
      pointer-events: none;
    }

    .corner-cell {
      background: var(--grid-bg);
      position: sticky;
      top: 0;
      left: 0;
      z-index: 3;
    }

    .cell-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 8px;
      color: white;
      font-weight: 500;
      pointer-events: none;
    }

    /* Touch improvements */
    @media (pointer: coarse) {
      .cell {
        min-height: 16px;
      }
    }
  `,e([pt({type:Object})],Dt.prototype,"schedule",void 0),e([pt({type:String})],Dt.prototype,"helperType",void 0),e([pt({type:Number})],Dt.prototype,"defaultValue",void 0),e([yt()],Dt.prototype,"_selection",void 0),e([yt()],Dt.prototype,"_currentSlot",void 0),e([yt()],Dt.prototype,"_currentDay",void 0),e([yt()],Dt.prototype,"_slotProgress",void 0),Dt=e([ct("schedule-grid")],Dt),customElements.get("schedule-grid")||customElements.define("schedule-grid",Dt);let Mt=class extends lt{constructor(){super(...arguments),this.enabled=!0,this.helperType="input_number",this.currentValue=50,this.helperEntity="",this._selectedDay="monday",this._inputValue=50}_handleCopyToAll(){this.dispatchEvent(new CustomEvent("copy-to-all",{detail:{sourceDay:this._selectedDay},bubbles:!0,composed:!0}))}_handleCopyToWorkdays(){this.dispatchEvent(new CustomEvent("copy-to-workdays",{detail:{sourceDay:this._selectedDay},bubbles:!0,composed:!0}))}_handleClearDay(){this.dispatchEvent(new CustomEvent("clear-day",{detail:{day:this._selectedDay},bubbles:!0,composed:!0}))}_handleClearAll(){this.dispatchEvent(new CustomEvent("clear-all",{bubbles:!0,composed:!0}))}_handleToggleEnabled(){this.dispatchEvent(new CustomEvent("toggle-enabled",{detail:{enabled:!this.enabled},bubbles:!0,composed:!0}))}_handleValueChange(t){const e=t.target;this._inputValue=Number(e.value)}_handleValueConfirm(){this.dispatchEvent(new CustomEvent("value-change",{detail:{value:this._inputValue},bubbles:!0,composed:!0}))}_handleDayChange(t){const e=t.target;this._selectedDay=e.value}render(){return B`
      <div class="toolbar">
        <!-- Enable/Disable toggle -->
        <div class="section enable-toggle">
          <span class="section-label">Schedule</span>
          <label class="toggle-switch">
            <input
              type="checkbox"
              .checked=${this.enabled}
              @change=${this._handleToggleEnabled}
            />
            <span class="toggle-slider"></span>
          </label>
          <span class="section-label">${this.enabled?"On":"Off"}</span>
        </div>

        <div class="divider"></div>

        <!-- Value input (for input_number only) -->
        ${"input_number"===this.helperType?B`
              <div class="section">
                <span class="section-label">Value:</span>
                <input
                  type="number"
                  class="value-input"
                  .value=${String(this._inputValue)}
                  @input=${this._handleValueChange}
                  @change=${this._handleValueConfirm}
                  min="0"
                  max="100"
                />
              </div>
              <div class="divider"></div>
            `:""}

        <!-- Day selection -->
        <div class="section">
          <span class="section-label">Copy from:</span>
          <select class="day-select" @change=${this._handleDayChange}>
            ${ft.map(t=>B`
                <option value="${t}" ?selected=${t===this._selectedDay}>
                  ${gt[t]}
                </option>
              `)}
          </select>
        </div>

        <!-- Copy buttons -->
        <div class="section">
          <button class="btn btn-primary" @click=${this._handleCopyToAll}>
            Copy to All
          </button>
          <button class="btn btn-primary" @click=${this._handleCopyToWorkdays}>
            Copy to Workdays
          </button>
        </div>

        <div class="divider"></div>

        <!-- Clear buttons -->
        <div class="section">
          <button class="btn btn-secondary" @click=${this._handleClearDay}>
            Clear ${gt[this._selectedDay]}
          </button>
          <button class="btn btn-secondary" @click=${this._handleClearAll}>
            Clear All
          </button>
        </div>

        <!-- Helper info -->
        <div class="helper-info">
          Controlling: ${this.helperEntity}
        </div>
      </div>
    `}};Mt.styles=a`
    :host {
      display: block;
      --toolbar-bg: var(--card-background-color, #fff);
      --toolbar-border: var(--divider-color, #e0e0e0);
      --btn-bg: var(--primary-color, #03a9f4);
      --btn-text: white;
      --btn-hover: var(--primary-color, #0288d1);
      --text-primary: var(--primary-text-color, #212121);
      --text-secondary: var(--secondary-text-color, #757575);
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px;
      background: var(--toolbar-bg);
      border: 1px solid var(--toolbar-border);
      border-radius: 4px;
      margin-bottom: 12px;
      align-items: center;
    }

    .section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-label {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .day-select {
      padding: 6px 10px;
      border: 1px solid var(--toolbar-border);
      border-radius: 4px;
      font-size: 14px;
      background: var(--toolbar-bg);
      color: var(--text-primary);
      cursor: pointer;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s, opacity 0.2s;
      white-space: nowrap;
    }

    .btn-primary {
      background: var(--btn-bg);
      color: var(--btn-text);
    }

    .btn-primary:hover {
      background: var(--btn-hover);
    }

    .btn-secondary {
      background: var(--toolbar-border);
      color: var(--text-primary);
    }

    .btn-secondary:hover {
      background: var(--text-secondary);
      color: white;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .value-input {
      width: 60px;
      padding: 6px 10px;
      border: 1px solid var(--toolbar-border);
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
    }

    .enable-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toggle-switch {
      position: relative;
      width: 40px;
      height: 20px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 20px;
    }

    .toggle-slider:before {
      position: absolute;
      content: '';
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    .toggle-switch input:checked + .toggle-slider {
      background-color: var(--btn-bg);
    }

    .toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(20px);
    }

    .helper-info {
      font-size: 11px;
      color: var(--text-secondary);
      margin-left: auto;
    }

    .divider {
      width: 1px;
      height: 24px;
      background: var(--toolbar-border);
    }

    @media (max-width: 600px) {
      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .section {
        justify-content: space-between;
      }

      .helper-info {
        margin-left: 0;
        text-align: center;
      }

      .divider {
        display: none;
      }
    }
  `,e([pt({type:Boolean})],Mt.prototype,"enabled",void 0),e([pt({type:String})],Mt.prototype,"helperType",void 0),e([pt({type:Number})],Mt.prototype,"currentValue",void 0),e([pt({type:String})],Mt.prototype,"helperEntity",void 0),e([yt()],Mt.prototype,"_selectedDay",void 0),e([yt()],Mt.prototype,"_inputValue",void 0),Mt=e([ct("schedule-toolbar")],Mt),customElements.get("schedule-toolbar")||customElements.define("schedule-toolbar",Mt),window.customCards=window.customCards||[],window.customCards.push({type:"weekly-scheduler-card",name:"Weekly Scheduler Card",description:"A card for managing weekly schedules for input helpers",preview:!0}),t.WeeklySchedulerCard=class extends lt{constructor(){super(...arguments),this._schedule={monday:[],tuesday:[],wednesday:[],thursday:[],friday:[],saturday:[],sunday:[]},this._enabled=!0,this._helperType="input_number",this._helperEntity="",this._currentValue=50,this._defaultValue=50}setConfig(t){if(!t.entity)throw new Error("Please define an entity");this.config=t}getCardSize(){return 8}updated(t){super.updated(t),t.has("hass")&&this.hass&&this.config&&this._updateFromEntity()}_updateFromEntity(){if(!this.hass||!this.config?.entity)return;const t=this.hass.states[this.config.entity];if(!t)return;const e=t.attributes;if(e.schedule&&(this._schedule=e.schedule),e.helper_type&&(this._helperType=e.helper_type),e.helper_entity&&(this._helperEntity=e.helper_entity),this._enabled="on"===t.state,this._helperEntity&&this.hass.states[this._helperEntity]){const t=this.hass.states[this._helperEntity];"input_number"===this._helperType&&(this._currentValue=parseFloat(t.state)||0)}}async _updateSchedule(t){if(this.hass&&this.config?.entity){this._schedule=t;try{await this.hass.callService("weekly_scheduler","set_schedule",{entity_id:this.config.entity,schedule:t})}catch(t){console.error("Failed to update schedule:",t)}}}async _handleSelectionComplete(t){const{days:e,startSlot:s,endSlot:i,action:r}=t.detail;let o=$t(this._schedule);for(const t of e)if("add"===r){o=xt(o,t,s,i,"input_boolean"===this._helperType||this._defaultValue)}else o=wt(o,t,s,i);await this._updateSchedule(o)}async _handleCopyToAll(t){const{sourceDay:e}=t.detail,s=At(this._schedule,e,ft);await this._updateSchedule(s)}async _handleCopyToWorkdays(t){const{sourceDay:e}=t.detail,s=At(this._schedule,e,["monday","tuesday","wednesday","thursday","friday"]);await this._updateSchedule(s)}async _handleClearDay(t){const{day:e}=t.detail,s=$t(this._schedule);s[e]=[],await this._updateSchedule(s)}async _handleClearAll(){await this._updateSchedule({monday:[],tuesday:[],wednesday:[],thursday:[],friday:[],saturday:[],sunday:[]})}async _handleToggleEnabled(t){if(!this.hass||!this.config?.entity)return;const{enabled:e}=t.detail;try{await this.hass.callService("switch",e?"turn_on":"turn_off",{entity_id:this.config.entity})}catch(t){console.error("Failed to toggle schedule:",t)}}_handleValueChange(t){this._defaultValue=t.detail.value}render(){if(!this.config)return B`<div class="error">Invalid configuration</div>`;if(!this.hass)return B`<div class="error">Home Assistant not available</div>`;const t=this.hass.states[this.config.entity];if(!t)return B`<div class="error">
        Entity not found: ${this.config.entity}
      </div>`;const e=this.config.title||t.attributes.friendly_name||"Weekly Schedule",s=t.attributes.current_timeblock;return B`
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="title">${e}</div>
            <div class="status ${this._enabled?"":"disabled"}">
              ${this._enabled?"Active":"Disabled"}
            </div>
          </div>

          <schedule-toolbar
            .enabled=${this._enabled}
            .helperType=${this._helperType}
            .currentValue=${this._currentValue}
            .helperEntity=${this._helperEntity}
            @copy-to-all=${this._handleCopyToAll}
            @copy-to-workdays=${this._handleCopyToWorkdays}
            @clear-day=${this._handleClearDay}
            @clear-all=${this._handleClearAll}
            @toggle-enabled=${this._handleToggleEnabled}
            @value-change=${this._handleValueChange}
          ></schedule-toolbar>

          <schedule-grid
            .schedule=${this._schedule}
            .helperType=${this._helperType}
            .defaultValue=${this._defaultValue}
            @selection-complete=${this._handleSelectionComplete}
          ></schedule-grid>

          ${s&&!1!==this.config.show_current_time?B`
                <div class="current-block">
                  Current: <strong>${s.day}</strong> at
                  <strong>${s.time}</strong>
                  ${null!==s.value?B` - Value:
                        <strong
                          >${"input_boolean"===this._helperType?s.value?"On":"Off":s.value}</strong
                        >`:""}
                  ${s.in_block?"":" (in gap)"}
                </div>
              `:""}
        </div>
      </ha-card>
    `}static getConfigElement(){return document.createElement("weekly-scheduler-card-editor")}static getStubConfig(){return{entity:"",title:"Weekly Schedule",show_current_time:!0}}},t.WeeklySchedulerCard.styles=a`
    :host {
      display: block;
    }

    .card {
      padding: 16px;
      background: var(--ha-card-background, var(--card-background-color, white));
      border-radius: var(--ha-card-border-radius, 4px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 3px 1px -2px rgba(0, 0, 0, 0.2)
      );
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .title {
      font-size: 18px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .status {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      background: var(--success-color, #4caf50);
      color: white;
    }

    .status.disabled {
      background: var(--disabled-color, #9e9e9e);
    }

    .error {
      padding: 16px;
      color: var(--error-color, #f44336);
      text-align: center;
    }

    .current-block {
      margin-top: 12px;
      padding: 8px 12px;
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .current-block strong {
      color: var(--primary-text-color);
    }
  `,e([pt({attribute:!1})],t.WeeklySchedulerCard.prototype,"hass",void 0),e([pt({type:Object})],t.WeeklySchedulerCard.prototype,"config",void 0),e([yt()],t.WeeklySchedulerCard.prototype,"_schedule",void 0),e([yt()],t.WeeklySchedulerCard.prototype,"_enabled",void 0),e([yt()],t.WeeklySchedulerCard.prototype,"_helperType",void 0),e([yt()],t.WeeklySchedulerCard.prototype,"_helperEntity",void 0),e([yt()],t.WeeklySchedulerCard.prototype,"_currentValue",void 0),e([yt()],t.WeeklySchedulerCard.prototype,"_defaultValue",void 0),t.WeeklySchedulerCard=e([ct("weekly-scheduler-card")],t.WeeklySchedulerCard),t.WeeklySchedulerCardEditor=class extends lt{setConfig(t){this._config=t}_valueChanged(t){if(!this._config)return;const e=t.target,s={...this._config,[e.name]:"checkbox"===e.type?e.checked:e.value};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){if(!this.hass)return B``;const t=Object.keys(this.hass.states).filter(t=>t.startsWith("switch.")&&void 0!==this.hass.states[t].attributes.schedule);return B`
      <div class="editor">
        <div class="row">
          <label>Entity</label>
          <select
            name="entity"
            .value=${this._config?.entity||""}
            @change=${this._valueChanged}
          >
            <option value="">Select an entity...</option>
            ${t.map(t=>B`
                <option
                  value="${t}"
                  ?selected=${t===this._config?.entity}
                >
                  ${this.hass.states[t].attributes.friendly_name||t}
                </option>
              `)}
          </select>
        </div>

        <div class="row">
          <label>Title (optional)</label>
          <input
            type="text"
            name="title"
            .value=${this._config?.title||""}
            @input=${this._valueChanged}
            placeholder="Weekly Schedule"
          />
        </div>

        <div class="row">
          <label>
            <input
              type="checkbox"
              name="show_current_time"
              .checked=${!1!==this._config?.show_current_time}
              @change=${this._valueChanged}
            />
            Show current time indicator
          </label>
        </div>
      </div>
    `}},t.WeeklySchedulerCardEditor.styles=a`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }

    input,
    select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      font-size: 14px;
    }
  `,e([pt({attribute:!1})],t.WeeklySchedulerCardEditor.prototype,"hass",void 0),e([pt({type:Object})],t.WeeklySchedulerCardEditor.prototype,"_config",void 0),t.WeeklySchedulerCardEditor=e([ct("weekly-scheduler-card-editor")],t.WeeklySchedulerCardEditor),customElements.get("weekly-scheduler-card")||customElements.define("weekly-scheduler-card",t.WeeklySchedulerCard),customElements.get("weekly-scheduler-card-editor")||customElements.define("weekly-scheduler-card-editor",t.WeeklySchedulerCardEditor)}({});
