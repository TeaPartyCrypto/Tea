(this["webpackJsonp@scaffold-eth/react-app"]=this["webpackJsonp@scaffold-eth/react-app"]||[]).push([[26],{1594:function(t,e,r){"use strict";r.r(e),r.d(e,"a",(function(){return h})),r.d(e,"m",(function(){return u}));var n,a=r(2),c=r(1592),i=Object.defineProperty,o=function(t,e){return i(t,"name",{value:e,configurable:!0})};function s(t,e){return e.forEach((function(e){e&&"string"!==typeof e&&!Array.isArray(e)&&Object.keys(e).forEach((function(r){if("default"!==r&&!(r in t)){var n=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:function(){return e[r]}})}}))})),Object.freeze(t)}o(s,"_mergeNamespaces");var h={exports:{}};!function(t){var e=/MSIE \d/.test(navigator.userAgent)&&(null==document.documentMode||document.documentMode<8),r=t.Pos,n={"(":")>",")":"(<","[":"]>","]":"[<","{":"}>","}":"{<","<":">>",">":"<<"};function a(t){return t&&t.bracketRegex||/[(){}[\]]/}function c(t,e,c){var o=t.getLineHandle(e.line),s=e.ch-1,h=c&&c.afterCursor;null==h&&(h=/(^| )cm-fat-cursor($| )/.test(t.getWrapperElement().className));var l=a(c),u=!h&&s>=0&&l.test(o.text.charAt(s))&&n[o.text.charAt(s)]||l.test(o.text.charAt(s+1))&&n[o.text.charAt(++s)];if(!u)return null;var f=">"==u.charAt(1)?1:-1;if(c&&c.strict&&f>0!=(s==e.ch))return null;var g=t.getTokenTypeAt(r(e.line,s+1)),m=i(t,r(e.line,s+(f>0?1:0)),f,g,c);return null==m?null:{from:r(e.line,s),to:m&&m.pos,match:m&&m.ch==u.charAt(0),forward:f>0}}function i(t,e,c,i,o){for(var s=o&&o.maxScanLineLength||1e4,h=o&&o.maxScanLines||1e3,l=[],u=a(o),f=c>0?Math.min(e.line+h,t.lastLine()+1):Math.max(t.firstLine()-1,e.line-h),g=e.line;g!=f;g+=c){var m=t.getLine(g);if(m){var d=c>0?0:m.length-1,p=c>0?m.length:-1;if(!(m.length>s))for(g==e.line&&(d=e.ch-(c<0?1:0));d!=p;d+=c){var k=m.charAt(d);if(u.test(k)&&(void 0===i||(t.getTokenTypeAt(r(g,d+1))||"")==(i||""))){var v=n[k];if(v&&">"==v.charAt(1)==c>0)l.push(k);else{if(!l.length)return{pos:r(g,d),ch:k};l.pop()}}}}}return g-c!=(c>0?t.lastLine():t.firstLine())&&null}function s(t,n,a){for(var i=t.state.matchBrackets.maxHighlightLineLength||1e3,s=a&&a.highlightNonMatching,h=[],l=t.listSelections(),u=0;u<l.length;u++){var f=l[u].empty()&&c(t,l[u].head,a);if(f&&(f.match||!1!==s)&&t.getLine(f.from.line).length<=i){var g=f.match?"CodeMirror-matchingbracket":"CodeMirror-nonmatchingbracket";h.push(t.markText(f.from,r(f.from.line,f.from.ch+1),{className:g})),f.to&&t.getLine(f.to.line).length<=i&&h.push(t.markText(f.to,r(f.to.line,f.to.ch+1),{className:g}))}}if(h.length){e&&t.state.focused&&t.focus();var m=o((function(){t.operation((function(){for(var t=0;t<h.length;t++)h[t].clear()}))}),"clear");if(!n)return m;setTimeout(m,800)}}function h(t){t.operation((function(){t.state.matchBrackets.currentlyHighlighted&&(t.state.matchBrackets.currentlyHighlighted(),t.state.matchBrackets.currentlyHighlighted=null),t.state.matchBrackets.currentlyHighlighted=s(t,!1,t.state.matchBrackets)}))}function l(t){t.state.matchBrackets&&t.state.matchBrackets.currentlyHighlighted&&(t.state.matchBrackets.currentlyHighlighted(),t.state.matchBrackets.currentlyHighlighted=null)}o(a,"bracketRegex"),o(c,"findMatchingBracket"),o(i,"scanForBracket"),o(s,"matchBrackets"),o(h,"doMatchBrackets"),o(l,"clearHighlighted"),t.defineOption("matchBrackets",!1,(function(e,r,n){n&&n!=t.Init&&(e.off("cursorActivity",h),e.off("focus",h),e.off("blur",l),l(e)),r&&(e.state.matchBrackets="object"==typeof r?r:{},e.on("cursorActivity",h),e.on("focus",h),e.on("blur",l))})),t.defineExtension("matchBrackets",(function(){s(this,!0)})),t.defineExtension("findMatchingBracket",(function(t,e,r){return(r||"boolean"==typeof e)&&(r?(r.strict=e,e=r):e=e?{strict:!0}:null),c(this,t,e)})),t.defineExtension("scanForBracket",(function(t,e,r,n){return i(this,t,e,r,n)}))}(c.a.exports);var l=h.exports,u=Object.freeze(s((n={__proto__:null},Object(a.a)(n,Symbol.toStringTag,"Module"),Object(a.a)(n,"default",l),n),[h.exports]))}}]);
//# sourceMappingURL=26.a0c49c81.chunk.js.map