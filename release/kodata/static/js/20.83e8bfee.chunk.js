(this["webpackJsonp@scaffold-eth/react-app"]=this["webpackJsonp@scaffold-eth/react-app"]||[]).push([[20],{1595:function(e,t,n){"use strict";n.r(t),n.d(t,"c",(function(){return u}));var r,a=n(2),i=n(1591),s=Object.defineProperty,o=function(e,t){return s(e,"name",{value:t,configurable:!0})};function c(e,t){return t.forEach((function(t){t&&"string"!==typeof t&&!Array.isArray(t)&&Object.keys(t).forEach((function(n){if("default"!==n&&!(n in e)){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}}))})),Object.freeze(e)}o(c,"_mergeNamespaces");var l={exports:{}};!function(e){var t={pairs:"()[]{}''\"\"",closeBefore:")]}'\":;>",triples:"",explode:"[]{}"},n=e.Pos;function r(e,n){return"pairs"==n&&"string"==typeof e?e:"object"==typeof e&&null!=e[n]?e[n]:t[n]}e.defineOption("autoCloseBrackets",!1,(function(t,n,s){s&&s!=e.Init&&(t.removeKeyMap(a),t.state.closeBrackets=null),n&&(i(r(n,"pairs")),t.state.closeBrackets=n,t.addKeyMap(a))})),o(r,"getOption");var a={Backspace:l,Enter:f};function i(e){for(var t=0;t<e.length;t++){var n=e.charAt(t),r="'"+n+"'";a[r]||(a[r]=s(n))}}function s(e){return function(t){return p(t,e)}}function c(e){var t=e.state.closeBrackets;return!t||t.override?t:e.getModeAt(e.getCursor()).closeBrackets||t}function l(t){var a=c(t);if(!a||t.getOption("disableInput"))return e.Pass;for(var i=r(a,"pairs"),s=t.listSelections(),o=0;o<s.length;o++){if(!s[o].empty())return e.Pass;var l=d(t,s[o].head);if(!l||i.indexOf(l)%2!=0)return e.Pass}for(o=s.length-1;o>=0;o--){var f=s[o].head;t.replaceRange("",n(f.line,f.ch-1),n(f.line,f.ch+1),"+delete")}}function f(t){var n=c(t),a=n&&r(n,"explode");if(!a||t.getOption("disableInput"))return e.Pass;for(var i=t.listSelections(),s=0;s<i.length;s++){if(!i[s].empty())return e.Pass;var o=d(t,i[s].head);if(!o||a.indexOf(o)%2!=0)return e.Pass}t.operation((function(){var e=t.lineSeparator()||"\n";t.replaceSelection(e+e,null),u(t,-1),i=t.listSelections();for(var n=0;n<i.length;n++){var r=i[n].head.line;t.indentLine(r,null,!0),t.indentLine(r+1,null,!0)}}))}function u(e,t){for(var n=[],r=e.listSelections(),a=0,i=0;i<r.length;i++){var s=r[i];s.head==e.getCursor()&&(a=i);var o=s.head.ch||t>0?{line:s.head.line,ch:s.head.ch+t}:{line:s.head.line-1};n.push({anchor:o,head:o})}e.setSelections(n,a)}function h(t){var r=e.cmpPos(t.anchor,t.head)>0;return{anchor:new n(t.anchor.line,t.anchor.ch+(r?-1:1)),head:new n(t.head.line,t.head.ch+(r?1:-1))}}function p(t,a){var i=c(t);if(!i||t.getOption("disableInput"))return e.Pass;var s=r(i,"pairs"),o=s.indexOf(a);if(-1==o)return e.Pass;for(var l,f=r(i,"closeBefore"),p=r(i,"triples"),d=s.charAt(o+1)==a,v=t.listSelections(),b=o%2==0,O=0;O<v.length;O++){var S,y=v[O],k=y.head,P=t.getRange(k,n(k.line,k.ch+1));if(b&&!y.empty())S="surround";else if(!d&&b||P!=a)if(d&&k.ch>1&&p.indexOf(a)>=0&&t.getRange(n(k.line,k.ch-2),k)==a+a){if(k.ch>2&&/\bstring/.test(t.getTokenTypeAt(n(k.line,k.ch-2))))return e.Pass;S="addFour"}else if(d){var x=0==k.ch?" ":t.getRange(n(k.line,k.ch-1),k);if(e.isWordChar(P)||x==a||e.isWordChar(x))return e.Pass;S="both"}else{if(!b||!(0===P.length||/\s/.test(P)||f.indexOf(P)>-1))return e.Pass;S="both"}else S=d&&g(t,k)?"both":p.indexOf(a)>=0&&t.getRange(k,n(k.line,k.ch+3))==a+a+a?"skipThree":"skip";if(l){if(l!=S)return e.Pass}else l=S}var A=o%2?s.charAt(o-1):a,m=o%2?a:s.charAt(o+1);t.operation((function(){if("skip"==l)u(t,1);else if("skipThree"==l)u(t,3);else if("surround"==l){for(var e=t.getSelections(),n=0;n<e.length;n++)e[n]=A+e[n]+m;for(t.replaceSelections(e,"around"),e=t.listSelections().slice(),n=0;n<e.length;n++)e[n]=h(e[n]);t.setSelections(e)}else"both"==l?(t.replaceSelection(A+m,null),t.triggerElectric(A+m),u(t,-1)):"addFour"==l&&(t.replaceSelection(A+A+A+A,"before"),u(t,1))}))}function d(e,t){var r=e.getRange(n(t.line,t.ch-1),n(t.line,t.ch+1));return 2==r.length?r:null}function g(e,t){var r=e.getTokenAt(n(t.line,t.ch+1));return/\bstring/.test(r.type)&&r.start==t.ch&&(0==t.ch||!/\bstring/.test(e.getTokenTypeAt(t)))}o(i,"ensureBound"),i(t.pairs+"`"),o(s,"handler"),o(c,"getConfig"),o(l,"handleBackspace"),o(f,"handleEnter"),o(u,"moveSel"),o(h,"contractSelection"),o(p,"handleChar"),o(d,"charsAround"),o(g,"stringStartsAfter")}(i.a.exports);var f=l.exports,u=Object.freeze(c((r={__proto__:null},Object(a.a)(r,Symbol.toStringTag,"Module"),Object(a.a)(r,"default",f),r),[l.exports]))}}]);
//# sourceMappingURL=20.83e8bfee.chunk.js.map