function t(t,e,s,i){var n,r=arguments.length,o=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,s,o):n(e,s))||o);return r>3&&o&&Object.defineProperty(e,s,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,y=globalThis,f=y.trustedTypes,g=f?f.emptyScript:"",_=y.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},m=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:m};Symbol.metadata??=Symbol("metadata"),y.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);n?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const r=n.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const r=this.constructor;if(!1===i&&(n=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??m)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,_?.({ReactiveElement:x}),(y.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,S=t=>t,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+k,D=`<${T}>`,M=document,P=()=>M.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,H="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,V=/>/g,z=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,I=/"/g,L=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),B=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),F=new WeakMap,X=M.createTreeWalker(M,129);function J(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=R;for(let e=0;e<s;e++){const s=t[e];let a,l,d=-1,c=0;for(;c<s.length&&(o.lastIndex=c,l=o.exec(s),null!==l);)c=o.lastIndex,o===R?"!--"===l[1]?o=N:void 0!==l[1]?o=V:void 0!==l[2]?(L.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=z):void 0!==l[3]&&(o=z):o===z?">"===l[0]?(o=n??R,d=-1):void 0===l[1]?d=-2:(d=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?z:'"'===l[3]?I:j):o===I||o===j?o=z:o===N||o===V?o=R:(o=z,n=void 0);const h=o===z&&t[e+1].startsWith("/>")?" ":"";r+=o===R?s+D:d>=0?(i.push(a),s.slice(0,d)+C+s.slice(d)+k+h):s+k+(-2===d?e:h)}return[J(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,d]=K(t,e);if(this.el=Y.createElement(l,s),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=X.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=d[r++],s=i.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?et:"?"===o[1]?st:"@"===o[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),X.nextNode(),a.push({type:2,index:++n});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===T)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===B)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=O(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=Z(t,n._$AS(t,e.values),n,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);X.currentNode=i;let n=X.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=s[++o]}r!==a?.index&&(n=X.nextNode(),r++)}return X.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),O(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Y(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Q(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=Z(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==B,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=Z(this,i[s+o],e,o),a===B&&(a=this._$AH[o]),r||=!O(a)||a!==this._$AH[o],a===q?t=q:t!==q&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends tt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??q)===B)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(Y,Q),(w.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new Q(e.insertBefore(P(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const lt=ot.litElementPolyfillSupport;lt?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");const dt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ct={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:m},ht=(t=ct,e,s)=>{const{kind:i,metadata:n}=s;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ut(t){return(e,s)=>"object"==typeof s?ht(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function pt(t){return ut({...t,state:!0,attribute:!1})}const yt=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],ft={monday:"Mon",tuesday:"Tue",wednesday:"Wed",thursday:"Thu",friday:"Fri",saturday:"Sat",sunday:"Sun"};function gt(t){const e=t%2*30;return`${Math.floor(t/2).toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`}function _t(t){const[e,s]=t.split(":").map(Number);return 2*e+Math.floor(s/30)}function vt(){const t=(new Date).getDay();return yt[0===t?6:t-1]}function bt(){const t=new Date;return 2*t.getHours()+Math.floor(t.getMinutes()/30)}function mt(t){const e={monday:[],tuesday:[],wednesday:[],thursday:[],friday:[],saturday:[],sunday:[]};for(const s of yt)e[s]=t[s].map(t=>({...t}));return e}function $t(t,e,s,i,n){const r=mt(t),o=gt(s),a=i>=48?"00:00":gt(i);r[e]=r[e].filter(t=>{const e=_t(t.start);return("00:00"===t.end?48:_t(t.end))<=s||e>=i});const l=[];for(const n of t[e]){const t=_t(n.start),e="00:00"===n.end?48:_t(n.end);t<s&&e>s&&l.push({start:n.start,end:gt(s),value:n.value}),t<i&&e>i&&l.push({start:gt(i),end:n.end,value:n.value})}return r[e].push({start:o,end:a,value:n}),r[e].push(...l),r[e]=function(t){if(0===t.length)return[];const e=[{...t[0]}];for(let s=1;s<t.length;s++){const i=e[e.length-1],n=t[s];("00:00"===i.end?48:_t(i.end))===_t(n.start)&&i.value===n.value?e[e.length-1]={start:i.start,end:n.end,value:i.value}:e.push({...n})}return e}(r[e].sort((t,e)=>_t(t.start)-_t(e.start))),r}function xt(t,e,s,i){const n=mt(t),r=[];for(const t of n[e]){const e=_t(t.start),n="00:00"===t.end?48:_t(t.end);n<=s||e>=i?r.push(t):(e<s&&r.push({start:t.start,end:gt(s),value:t.value}),n>i&&r.push({start:gt(i),end:t.end,value:t.value}))}return n[e]=r.sort((t,e)=>_t(t.start)-_t(e.start)),n}function wt(t,e,s){for(const i of t[e]){const t=_t(i.start),e="00:00"===i.end?48:_t(i.end);if(s>=t&&s<e)return i.value}return null}function St(t,e,s){return null!==wt(t,e,s)}function At(t,e,s){const i=mt(t),n=i[e].map(t=>({...t}));for(const t of s)t!==e&&(i[t]=n.map(t=>({...t})));return i}function Et(t,e){return{isSelecting:!0,startDay:t,startSlot:e,endDay:t,endSlot:e}}function Ct(t,e,s){return t.isSelecting?{...t,endDay:e,endSlot:s}:t}function kt(t,e){const s=e.getBoundingClientRect();let i,n;if("touches"in t){if(0===t.touches.length)return null;i=t.touches[0].clientX,n=t.touches[0].clientY}else i=t.clientX,n=t.clientY;const r=i-s.left,o=n-s.top,a=r-50;if(a<0)return null;const l=(s.width-50)/7,d=Math.floor(a/l);if(d<0||d>=7)return null;const c=o-30;if(c<0)return null;const h=(s.height-30)/48,u=Math.floor(c/h);return u<0||u>=48?null:{day:yt[d],slot:u}}let Tt=class extends at{constructor(){super(...arguments),this.schedule={monday:[],tuesday:[],wednesday:[],thursday:[],friday:[],saturday:[],sunday:[]},this.helperType="input_number",this.defaultValue=50,this._selection={isSelecting:!1,startDay:null,startSlot:null,endDay:null,endSlot:null},this._currentSlot=bt(),this._currentDay=vt(),this._slotProgress=0,this._handleMouseMove=t=>{const e=this.shadowRoot?.querySelector(".grid-container");if(!e)return;const s=kt(t,e);s&&(this._selection=Ct(this._selection,s.day,s.slot))},this._handleMouseUp=()=>{document.removeEventListener("mousemove",this._handleMouseMove),document.removeEventListener("mouseup",this._handleMouseUp),document.body.style.userSelect="",document.body.style.webkitUserSelect="",this._finishSelection()}}connectedCallback(){super.connectedCallback(),this._startTimeUpdates()}disconnectedCallback(){super.disconnectedCallback(),this._stopTimeUpdates()}_startTimeUpdates(){this._updateCurrentTime(),this._timeUpdateInterval=window.setInterval(()=>{this._updateCurrentTime()},3e4)}_stopTimeUpdates(){this._timeUpdateInterval&&clearInterval(this._timeUpdateInterval)}_updateCurrentTime(){this._currentSlot=bt(),this._currentDay=vt(),this._slotProgress=(new Date).getMinutes()%30/30}_handleMouseDown(t){const e=this.shadowRoot?.querySelector(".grid-container");if(!e)return;const s=kt(t,e);s&&(t.preventDefault(),document.body.style.userSelect="none",document.body.style.webkitUserSelect="none",this._selection=Et(s.day,s.slot),document.addEventListener("mousemove",this._handleMouseMove),document.addEventListener("mouseup",this._handleMouseUp))}_handleTouchStart(t){const e=this.shadowRoot?.querySelector(".grid-container");if(!e)return;const s=kt(t,e);s&&(t.preventDefault(),this._selection=Et(s.day,s.slot))}_handleTouchMove(t){const e=this.shadowRoot?.querySelector(".grid-container");if(!e)return;const s=kt(t,e);s&&(t.preventDefault(),this._selection=Ct(this._selection,s.day,s.slot))}_handleTouchEnd(){this._finishSelection()}_finishSelection(){const t=function(t){if(!t.startDay||null===t.startSlot||!t.endDay||null===t.endSlot)return null;const e=yt.indexOf(t.startDay),s=yt.indexOf(t.endDay),i=Math.min(e,s),n=Math.max(e,s);return{days:yt.slice(i,n+1),startSlot:Math.min(t.startSlot,t.endSlot),endSlot:Math.max(t.startSlot,t.endSlot)+1}}(this._selection);if(this._selection={isSelecting:!1,startDay:null,startSlot:null,endDay:null,endSlot:null},!t)return;let e=!1;for(const s of t.days){for(let i=t.startSlot;i<t.endSlot;i++)if(St(this.schedule,s,i)){e=!0;break}if(e)break}this.dispatchEvent(new CustomEvent("selection-complete",{detail:{days:t.days,startSlot:t.startSlot,endSlot:t.endSlot,action:e?"remove":"add"},bubbles:!0,composed:!0}))}_getIntensityClass(t){return null===t?"":"boolean"==typeof t?t?"intensity-high":"":t<=33?"intensity-low":t<=66?"intensity-medium":"intensity-high"}_renderTimeLabel(t){const e=gt(t);return W`
      <div class="time-label ${t%4==0?"even-hour":""}">
        ${t%2==0?e:""}
      </div>
    `}_renderCell(t,e){const s=wt(this.schedule,t,e),i=null!==s,n=function(t,e,s){if(!t.isSelecting||!t.startDay||null===t.startSlot||!t.endDay||null===t.endSlot)return!1;const i=yt.indexOf(t.startDay),n=yt.indexOf(t.endDay),r=Math.min(i,n),o=Math.max(i,n),a=yt.indexOf(e);if(a<r||a>o)return!1;const l=Math.min(t.startSlot,t.endSlot),d=Math.max(t.startSlot,t.endSlot);return s>=l&&s<=d}(this._selection,t,e),r=t===this._currentDay&&e===this._currentSlot,o=["cell",i?"active":"",i?this._getIntensityClass(s):"",n?"selected":"",r?"now-row":""].filter(Boolean).join(" ");return W`
      <div class="${o}" data-day="${t}" data-slot="${e}">
        ${r?W`<div
              class="now-indicator"
              style="top: ${100*this._slotProgress}%"
            ></div>`:""}
        ${i&&"input_number"===this.helperType&&"number"==typeof s?W`<span class="cell-value">${Math.round(s)}</span>`:""}
      </div>
    `}render(){const t=Array.from({length:48},(t,e)=>e);return W`
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
        ${yt.map(t=>W`
            <div class="header-cell ${t===this._currentDay?"today":""}">
              ${ft[t]}
            </div>
          `)}

        <!-- Grid rows -->
        ${t.map(t=>W`
            ${this._renderTimeLabel(t)}
            ${yt.map(e=>this._renderCell(e,t))}
          `)}
      </div>
    `}};Tt.styles=o`
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
      grid-template-rows: 30px repeat(48, 1fr);
      gap: 1px;
      background: var(--grid-border);
      border: 1px solid var(--grid-border);
      border-radius: 4px;
      overflow: hidden;
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
  `,t([ut({type:Object})],Tt.prototype,"schedule",void 0),t([ut({type:String})],Tt.prototype,"helperType",void 0),t([ut({type:Number})],Tt.prototype,"defaultValue",void 0),t([pt()],Tt.prototype,"_selection",void 0),t([pt()],Tt.prototype,"_currentSlot",void 0),t([pt()],Tt.prototype,"_currentDay",void 0),t([pt()],Tt.prototype,"_slotProgress",void 0),Tt=t([dt("schedule-grid")],Tt);let Dt=class extends at{constructor(){super(...arguments),this.enabled=!0,this.helperType="input_number",this.currentValue=50,this.helperEntity="",this._selectedDay="monday",this._inputValue=50}_handleCopyToAll(){this.dispatchEvent(new CustomEvent("copy-to-all",{detail:{sourceDay:this._selectedDay},bubbles:!0,composed:!0}))}_handleCopyToWorkdays(){this.dispatchEvent(new CustomEvent("copy-to-workdays",{detail:{sourceDay:this._selectedDay},bubbles:!0,composed:!0}))}_handleClearDay(){this.dispatchEvent(new CustomEvent("clear-day",{detail:{day:this._selectedDay},bubbles:!0,composed:!0}))}_handleClearAll(){this.dispatchEvent(new CustomEvent("clear-all",{bubbles:!0,composed:!0}))}_handleToggleEnabled(){this.dispatchEvent(new CustomEvent("toggle-enabled",{detail:{enabled:!this.enabled},bubbles:!0,composed:!0}))}_handleValueChange(t){const e=t.target;this._inputValue=Number(e.value)}_handleValueConfirm(){this.dispatchEvent(new CustomEvent("value-change",{detail:{value:this._inputValue},bubbles:!0,composed:!0}))}_handleDayChange(t){const e=t.target;this._selectedDay=e.value}render(){return W`
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
        ${"input_number"===this.helperType?W`
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
            ${yt.map(t=>W`
                <option value="${t}" ?selected=${t===this._selectedDay}>
                  ${ft[t]}
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
            Clear ${ft[this._selectedDay]}
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
    `}};Dt.styles=o`
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
  `,t([ut({type:Boolean})],Dt.prototype,"enabled",void 0),t([ut({type:String})],Dt.prototype,"helperType",void 0),t([ut({type:Number})],Dt.prototype,"currentValue",void 0),t([ut({type:String})],Dt.prototype,"helperEntity",void 0),t([pt()],Dt.prototype,"_selectedDay",void 0),t([pt()],Dt.prototype,"_inputValue",void 0),Dt=t([dt("schedule-toolbar")],Dt),window.customCards=window.customCards||[],window.customCards.push({type:"weekly-scheduler-card",name:"Weekly Scheduler Card",description:"A card for managing weekly schedules for input helpers",preview:!0});let Mt=class extends at{constructor(){super(...arguments),this._schedule={monday:[],tuesday:[],wednesday:[],thursday:[],friday:[],saturday:[],sunday:[]},this._enabled=!0,this._helperType="input_number",this._helperEntity="",this._currentValue=50,this._defaultValue=50}setConfig(t){if(!t.entity)throw new Error("Please define an entity");this.config=t}getCardSize(){return 8}updated(t){super.updated(t),t.has("hass")&&this.hass&&this.config&&this._updateFromEntity()}_updateFromEntity(){if(!this.hass||!this.config?.entity)return;const t=this.hass.states[this.config.entity];if(!t)return;const e=t.attributes;if(e.schedule&&(this._schedule=e.schedule),e.helper_type&&(this._helperType=e.helper_type),e.helper_entity&&(this._helperEntity=e.helper_entity),this._enabled="on"===t.state,this._helperEntity&&this.hass.states[this._helperEntity]){const t=this.hass.states[this._helperEntity];"input_number"===this._helperType&&(this._currentValue=parseFloat(t.state)||0)}}async _updateSchedule(t){if(this.hass&&this.config?.entity){this._schedule=t;try{await this.hass.callService("weekly_scheduler","set_schedule",{entity_id:this.config.entity,schedule:t})}catch(t){console.error("Failed to update schedule:",t)}}}async _handleSelectionComplete(t){const{days:e,startSlot:s,endSlot:i,action:n}=t.detail;let r=mt(this._schedule);for(const t of e)if("add"===n){r=$t(r,t,s,i,"input_boolean"===this._helperType||this._defaultValue)}else r=xt(r,t,s,i);await this._updateSchedule(r)}async _handleCopyToAll(t){const{sourceDay:e}=t.detail,s=At(this._schedule,e,yt);await this._updateSchedule(s)}async _handleCopyToWorkdays(t){const{sourceDay:e}=t.detail,s=At(this._schedule,e,["monday","tuesday","wednesday","thursday","friday"]);await this._updateSchedule(s)}async _handleClearDay(t){const{day:e}=t.detail,s=mt(this._schedule);s[e]=[],await this._updateSchedule(s)}async _handleClearAll(){await this._updateSchedule({monday:[],tuesday:[],wednesday:[],thursday:[],friday:[],saturday:[],sunday:[]})}async _handleToggleEnabled(t){if(!this.hass||!this.config?.entity)return;const{enabled:e}=t.detail;try{await this.hass.callService("switch",e?"turn_on":"turn_off",{entity_id:this.config.entity})}catch(t){console.error("Failed to toggle schedule:",t)}}_handleValueChange(t){this._defaultValue=t.detail.value}render(){if(!this.config)return W`<div class="error">Invalid configuration</div>`;if(!this.hass)return W`<div class="error">Home Assistant not available</div>`;const t=this.hass.states[this.config.entity];if(!t)return W`<div class="error">
        Entity not found: ${this.config.entity}
      </div>`;const e=this.config.title||t.attributes.friendly_name||"Weekly Schedule",s=t.attributes.current_timeblock;return W`
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

          ${s&&!1!==this.config.show_current_time?W`
                <div class="current-block">
                  Current: <strong>${s.day}</strong> at
                  <strong>${s.time}</strong>
                  ${null!==s.value?W` - Value:
                        <strong
                          >${"input_boolean"===this._helperType?s.value?"On":"Off":s.value}</strong
                        >`:""}
                  ${s.in_block?"":" (in gap)"}
                </div>
              `:""}
        </div>
      </ha-card>
    `}static getConfigElement(){return document.createElement("weekly-scheduler-card-editor")}static getStubConfig(){return{entity:"",title:"Weekly Schedule",show_current_time:!0}}};Mt.styles=o`
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
  `,t([ut({attribute:!1})],Mt.prototype,"hass",void 0),t([ut({type:Object})],Mt.prototype,"config",void 0),t([pt()],Mt.prototype,"_schedule",void 0),t([pt()],Mt.prototype,"_enabled",void 0),t([pt()],Mt.prototype,"_helperType",void 0),t([pt()],Mt.prototype,"_helperEntity",void 0),t([pt()],Mt.prototype,"_currentValue",void 0),t([pt()],Mt.prototype,"_defaultValue",void 0),Mt=t([dt("weekly-scheduler-card")],Mt);let Pt=class extends at{setConfig(t){this._config=t}_valueChanged(t){if(!this._config)return;const e=t.target,s={...this._config,[e.name]:"checkbox"===e.type?e.checked:e.value};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){if(!this.hass)return W``;const t=Object.keys(this.hass.states).filter(t=>t.startsWith("switch.")&&void 0!==this.hass.states[t].attributes.schedule);return W`
      <div class="editor">
        <div class="row">
          <label>Entity</label>
          <select
            name="entity"
            .value=${this._config?.entity||""}
            @change=${this._valueChanged}
          >
            <option value="">Select an entity...</option>
            ${t.map(t=>W`
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
    `}};Pt.styles=o`
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
  `,t([ut({attribute:!1})],Pt.prototype,"hass",void 0),t([ut({type:Object})],Pt.prototype,"_config",void 0),Pt=t([dt("weekly-scheduler-card-editor")],Pt);export{Mt as WeeklySchedulerCard,Pt as WeeklySchedulerCardEditor};
