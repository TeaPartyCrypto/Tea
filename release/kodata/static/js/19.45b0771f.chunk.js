(this["webpackJsonp@scaffold-eth/react-app"]=this["webpackJsonp@scaffold-eth/react-app"]||[]).push([[19],{1605:function(e,t,n){"use strict";n.r(t);var r=n(1591),a=n(78),l=n(1658),u=(n(0),n(84),Object.defineProperty),i=function(e,t){return u(e,"name",{value:t,configurable:!0})};function s(e,t){var n,r,a=e.levels;return((a&&0!==a.length?a[a.length-1]-((null===(n=this.electricInput)||void 0===n?void 0:n.test(t))?1:0):e.indentLevel)||0)*((null===(r=this.config)||void 0===r?void 0:r.indentUnit)||0)}r.C.defineMode("graphql-variables",(function(e){var t=Object(l.a)({eatWhitespace:function(e){return e.eatSpace()},lexRules:o,parseRules:c,editorConfig:{tabSize:e.tabSize}});return{config:e,startState:t.startState,token:t.token,indent:s,electricInput:/^\s*[}\]]/,fold:"brace",closeBrackets:{pairs:'[]{}""',explode:"[]{}"}}})),i(s,"indent");var o={Punctuation:/^\[|]|\{|\}|:|,/,Number:/^-?(?:0|(?:[1-9][0-9]*))(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?/,String:/^"(?:[^"\\]|\\(?:"|\/|\\|b|f|n|r|t|u[0-9a-fA-F]{4}))*"?/,Keyword:/^true|false|null/},c={Document:[Object(a.z)("{"),Object(a.v)("Variable",Object(a.y)(Object(a.z)(","))),Object(a.z)("}")],Variable:[d("variable"),Object(a.z)(":"),"Value"],Value:function(e){switch(e.kind){case"Number":return"NumberValue";case"String":return"StringValue";case"Punctuation":switch(e.value){case"[":return"ListValue";case"{":return"ObjectValue"}return null;case"Keyword":switch(e.value){case"true":case"false":return"BooleanValue";case"null":return"NullValue"}return null}},NumberValue:[Object(a.C)("Number","number")],StringValue:[Object(a.C)("String","string")],BooleanValue:[Object(a.C)("Keyword","builtin")],NullValue:[Object(a.C)("Keyword","keyword")],ListValue:[Object(a.z)("["),Object(a.v)("Value",Object(a.y)(Object(a.z)(","))),Object(a.z)("]")],ObjectValue:[Object(a.z)("{"),Object(a.v)("ObjectField",Object(a.y)(Object(a.z)(","))),Object(a.z)("}")],ObjectField:[d("attribute"),Object(a.z)(":"),"Value"]};function d(e){return{style:e,match:function(e){return"String"===e.kind},update:function(e,t){e.name=t.value.slice(1,-1)}}}i(d,"namedKey")},1658:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n(78),a=n(24),l=Object.defineProperty,u=function(e,t){return l(e,"name",{value:t,configurable:!0})};function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{eatWhitespace:function(e){return e.eatWhile(r.s)},lexRules:r.i,parseRules:r.j,editorConfig:{}};return{startState:function(){var t={level:0,step:0,name:null,kind:null,type:null,rule:null,needsSeparator:!1,prevState:null};return d(e.parseRules,t,a.a.DOCUMENT),t},token:function(t,n){return s(t,n,e)}}}function s(e,t,n){var r;if(t.inBlockstring)return e.match(/.*"""/)?(t.inBlockstring=!1,"string"):(e.skipToEnd(),"string");var a=n.lexRules,l=n.parseRules,u=n.eatWhitespace,i=n.editorConfig;if(t.rule&&0===t.rule.length?v(t):t.needsAdvance&&(t.needsAdvance=!1,p(t,!0)),e.sol()){var s=(null===i||void 0===i?void 0:i.tabSize)||2;t.indentLevel=Math.floor(e.indentation()/s)}if(u(e))return"ws";var f=S(a,e);if(!f)return e.match(/\S+/)||e.match(/\s/),d(c,t,"Invalid"),"invalidchar";if("Comment"===f.kind)return d(c,t,"Comment"),"comment";var h=o({},t);if("Punctuation"===f.kind)if(/^[{([]/.test(f.value))void 0!==t.indentLevel&&(t.levels=(t.levels||[]).concat(t.indentLevel+1));else if(/^[})\]]/.test(f.value)){var g=t.levels=(t.levels||[]).slice(0,-1);t.indentLevel&&g.length>0&&g[g.length-1]<t.indentLevel&&(t.indentLevel=g[g.length-1])}for(;t.rule;){var j="function"===typeof t.rule?0===t.step?t.rule(f,e):null:t.rule[t.step];if(t.needsSeparator&&(j=null===j||void 0===j?void 0:j.separator),j){if(j.ofRule&&(j=j.ofRule),"string"===typeof j){d(l,t,j);continue}if(null===(r=j.match)||void 0===r?void 0:r.call(j,f))return j.update&&j.update(t,f),"Punctuation"===f.kind?p(t,!0):t.needsAdvance=!0,j.style}b(t)}return o(t,h),d(c,t,"Invalid"),"invalidchar"}function o(e,t){for(var n=Object.keys(t),r=0;r<n.length;r++)e[n[r]]=t[n[r]];return e}u(i,"onlineParser"),u(s,"getToken"),u(o,"assign");var c={Invalid:[],Comment:[]};function d(e,t,n){if(!e[n])throw new TypeError("Unknown rule: "+n);t.prevState=Object.assign({},t),t.kind=n,t.name=null,t.type=null,t.rule=e[n],t.step=0,t.needsSeparator=!1}function v(e){e.prevState&&(e.kind=e.prevState.kind,e.name=e.prevState.name,e.type=e.prevState.type,e.rule=e.prevState.rule,e.step=e.prevState.step,e.needsSeparator=e.prevState.needsSeparator,e.prevState=e.prevState.prevState)}function p(e,t){var n;if(f(e)&&e.rule){var r=e.rule[e.step];if(r.separator){var a=r.separator;if(e.needsSeparator=!e.needsSeparator,!e.needsSeparator&&a.ofRule)return}if(t)return}for(e.needsSeparator=!1,e.step++;e.rule&&!(Array.isArray(e.rule)&&e.step<e.rule.length);)v(e),e.rule&&(f(e)?(null===(n=e.rule)||void 0===n?void 0:n[e.step].separator)&&(e.needsSeparator=!e.needsSeparator):(e.needsSeparator=!1,e.step++))}function f(e){var t=Array.isArray(e.rule)&&"string"!==typeof e.rule[e.step]&&e.rule[e.step];return t&&t.isList}function b(e){for(;e.rule&&(!Array.isArray(e.rule)||!e.rule[e.step].ofRule);)v(e);e.rule&&p(e,!1)}function S(e,t){for(var n=Object.keys(e),r=0;r<n.length;r++){var a=t.match(e[n[r]]);if(a&&a instanceof Array)return{kind:n[r],value:a[0]}}}u(d,"pushRule"),u(v,"popRule"),u(p,"advanceRule"),u(f,"isList"),u(b,"unsuccessful"),u(S,"lex")}}]);
//# sourceMappingURL=19.45b0771f.chunk.js.map