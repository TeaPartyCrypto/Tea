(this["webpackJsonp@scaffold-eth/react-app"]=this["webpackJsonp@scaffold-eth/react-app"]||[]).push([[5],{827:function(e,r,t){"use strict";t.r(r),t.d(r,"b",(function(){return c}));var n,i=t(2),o=t(1592),a=Object.defineProperty,f=function(e,r){return a(e,"name",{value:r,configurable:!0})};function l(e,r){return r.forEach((function(r){r&&"string"!==typeof r&&!Array.isArray(r)&&Object.keys(r).forEach((function(t){if("default"!==t&&!(t in e)){var n=Object.getOwnPropertyDescriptor(r,t);Object.defineProperty(e,t,n.get?n:{enumerable:!0,get:function(){return r[t]}})}}))})),Object.freeze(e)}f(l,"_mergeNamespaces");var s={exports:{}};!function(e){function r(r){return function(t,n){var i=n.line,o=t.getLine(i);function a(r){for(var a,f=n.ch,l=0;;){var s=f<=0?-1:o.lastIndexOf(r[0],f-1);if(-1!=s){if(1==l&&s<n.ch)break;if(a=t.getTokenTypeAt(e.Pos(i,s+1)),!/^(comment|string)/.test(a))return{ch:s+1,tokenType:a,pair:r};f=s-1}else{if(1==l)break;l=1,f=o.length}}}function l(r){var n,o,a=1,f=t.lastLine(),l=r.ch;e:for(var s=i;s<=f;++s)for(var u=t.getLine(s),c=s==i?l:0;;){var p=u.indexOf(r.pair[0],c),g=u.indexOf(r.pair[1],c);if(p<0&&(p=u.length),g<0&&(g=u.length),(c=Math.min(p,g))==u.length)break;if(t.getTokenTypeAt(e.Pos(s,c+1))==r.tokenType)if(c==p)++a;else if(!--a){n=s,o=c;break e}++c}return null==n||i==n?null:{from:e.Pos(i,l),to:e.Pos(n,o)}}f(a,"findOpening"),f(l,"findRange");for(var s=[],u=0;u<r.length;u++){var c=a(r[u]);c&&s.push(c)}for(s.sort((function(e,r){return e.ch-r.ch})),u=0;u<s.length;u++){var p=l(s[u]);if(p)return p}return null}}f(r,"bracketFolding"),e.registerHelper("fold","brace",r([["{","}"],["[","]"]])),e.registerHelper("fold","brace-paren",r([["{","}"],["[","]"],["(",")"]])),e.registerHelper("fold","import",(function(r,t){function n(t){if(t<r.firstLine()||t>r.lastLine())return null;var n=r.getTokenAt(e.Pos(t,1));if(/\S/.test(n.string)||(n=r.getTokenAt(e.Pos(t,n.end+1))),"keyword"!=n.type||"import"!=n.string)return null;for(var i=t,o=Math.min(r.lastLine(),t+10);i<=o;++i){var a=r.getLine(i).indexOf(";");if(-1!=a)return{startCh:n.end,end:e.Pos(i,a)}}}f(n,"hasImport");var i,o=t.line,a=n(o);if(!a||n(o-1)||(i=n(o-2))&&i.end.line==o-1)return null;for(var l=a.end;;){var s=n(l.line+1);if(null==s)break;l=s.end}return{from:r.clipPos(e.Pos(o,a.startCh+1)),to:l}})),e.registerHelper("fold","include",(function(r,t){function n(t){if(t<r.firstLine()||t>r.lastLine())return null;var n=r.getTokenAt(e.Pos(t,1));return/\S/.test(n.string)||(n=r.getTokenAt(e.Pos(t,n.end+1))),"meta"==n.type&&"#include"==n.string.slice(0,8)?n.start+8:void 0}f(n,"hasInclude");var i=t.line,o=n(i);if(null==o||null!=n(i-1))return null;for(var a=i;null!=n(a+1);)++a;return{from:e.Pos(i,o+1),to:r.clipPos(e.Pos(a))}}))}(o.a.exports);var u=s.exports,c=Object.freeze(l((n={__proto__:null},Object(i.a)(n,Symbol.toStringTag,"Module"),Object(i.a)(n,"default",u),n),[s.exports]))}}]);
//# sourceMappingURL=5.a5dbc253.chunk.js.map