(this["webpackJsonp@scaffold-eth/react-app"]=this["webpackJsonp@scaffold-eth/react-app"]||[]).push([[7],{828:function(e,t,o){"use strict";o.r(t),o.d(t,"f",(function(){return c}));var n,r=o(2),i=o(1591),f=Object.defineProperty,a=function(e,t){return f(e,"name",{value:t,configurable:!0})};function l(e,t){return t.forEach((function(t){t&&"string"!==typeof t&&!Array.isArray(t)&&Object.keys(t).forEach((function(o){if("default"!==o&&!(o in e)){var n=Object.getOwnPropertyDescriptor(t,o);Object.defineProperty(e,o,n.get?n:{enumerable:!0,get:function(){return t[o]}})}}))})),Object.freeze(e)}a(l,"_mergeNamespaces");var d={exports:{}};!function(e){function t(t,n,i,f){if(i&&i.call){var l=i;i=null}else l=r(t,i,"rangeFinder");"number"==typeof n&&(n=e.Pos(n,0));var d=r(t,i,"minFoldSize");function u(e){var o=l(t,n);if(!o||o.to.line-o.from.line<d)return null;if("fold"===f)return o;for(var r=t.findMarksAt(o.from),i=0;i<r.length;++i)if(r[i].__isFold){if(!e)return null;o.cleared=!0,r[i].clear()}return o}a(u,"getRange");var c=u(!0);if(r(t,i,"scanUp"))for(;!c&&n.line>t.firstLine();)n=e.Pos(n.line-1,0),c=u(!1);if(c&&!c.cleared&&"unfold"!==f){var s=o(t,i,c);e.on(s,"mousedown",(function(t){p.clear(),e.e_preventDefault(t)}));var p=t.markText(c.from,c.to,{replacedWith:s,clearOnEnter:r(t,i,"clearOnEnter"),__isFold:!0});p.on("clear",(function(o,n){e.signal(t,"unfold",t,o,n)})),e.signal(t,"fold",t,c.from,c.to)}}function o(e,t,o){var n=r(e,t,"widget");if("function"==typeof n&&(n=n(o.from,o.to)),"string"==typeof n){var i=document.createTextNode(n);(n=document.createElement("span")).appendChild(i),n.className="CodeMirror-foldmarker"}else n&&(n=n.cloneNode(!0));return n}a(t,"doFold"),a(o,"makeWidget"),e.newFoldFunction=function(e,o){return function(n,r){t(n,r,{rangeFinder:e,widget:o})}},e.defineExtension("foldCode",(function(e,o,n){t(this,e,o,n)})),e.defineExtension("isFolded",(function(e){for(var t=this.findMarksAt(e),o=0;o<t.length;++o)if(t[o].__isFold)return!0})),e.commands.toggleFold=function(e){e.foldCode(e.getCursor())},e.commands.fold=function(e){e.foldCode(e.getCursor(),null,"fold")},e.commands.unfold=function(e){e.foldCode(e.getCursor(),{scanUp:!1},"unfold")},e.commands.foldAll=function(t){t.operation((function(){for(var o=t.firstLine(),n=t.lastLine();o<=n;o++)t.foldCode(e.Pos(o,0),{scanUp:!1},"fold")}))},e.commands.unfoldAll=function(t){t.operation((function(){for(var o=t.firstLine(),n=t.lastLine();o<=n;o++)t.foldCode(e.Pos(o,0),{scanUp:!1},"unfold")}))},e.registerHelper("fold","combine",(function(){var e=Array.prototype.slice.call(arguments,0);return function(t,o){for(var n=0;n<e.length;++n){var r=e[n](t,o);if(r)return r}}})),e.registerHelper("fold","auto",(function(e,t){for(var o=e.getHelpers(t,"fold"),n=0;n<o.length;n++){var r=o[n](e,t);if(r)return r}}));var n={rangeFinder:e.fold.auto,widget:"\u2194",minFoldSize:0,scanUp:!1,clearOnEnter:!0};function r(e,t,o){if(t&&void 0!==t[o])return t[o];var r=e.options.foldOptions;return r&&void 0!==r[o]?r[o]:n[o]}e.defineOption("foldOptions",null),a(r,"getOption"),e.defineExtension("foldOption",(function(e,t){return r(this,e,t)}))}(i.a.exports),function(e){e.defineOption("foldGutter",!1,(function(t,r,i){i&&i!=e.Init&&(t.clearGutter(t.state.foldGutter.options.gutter),t.state.foldGutter=null,t.off("gutterClick",u),t.off("changes",c),t.off("viewportChange",s),t.off("fold",p),t.off("unfold",p),t.off("swapDoc",c)),r&&(t.state.foldGutter=new o(n(r)),d(t),t.on("gutterClick",u),t.on("changes",c),t.on("viewportChange",s),t.on("fold",p),t.on("unfold",p),t.on("swapDoc",c))}));var t=e.Pos;function o(e){this.options=e,this.from=this.to=0}function n(e){return!0===e&&(e={}),null==e.gutter&&(e.gutter="CodeMirror-foldgutter"),null==e.indicatorOpen&&(e.indicatorOpen="CodeMirror-foldgutter-open"),null==e.indicatorFolded&&(e.indicatorFolded="CodeMirror-foldgutter-folded"),e}function r(e,o){for(var n=e.findMarks(t(o,0),t(o+1,0)),r=0;r<n.length;++r)if(n[r].__isFold){var i=n[r].find(-1);if(i&&i.line===o)return n[r]}}function i(e){if("string"==typeof e){var t=document.createElement("div");return t.className=e+" CodeMirror-guttermarker-subtle",t}return e.cloneNode(!0)}function f(e,o,n){var f=e.state.foldGutter.options,a=o-1,d=e.foldOption(f,"minFoldSize"),u=e.foldOption(f,"rangeFinder"),c="string"==typeof f.indicatorFolded&&l(f.indicatorFolded),s="string"==typeof f.indicatorOpen&&l(f.indicatorOpen);e.eachLine(o,n,(function(o){++a;var n=null,l=o.gutterMarkers;if(l&&(l=l[f.gutter]),r(e,a)){if(c&&l&&c.test(l.className))return;n=i(f.indicatorFolded)}else{var p=t(a,0),g=u&&u(e,p);if(g&&g.to.line-g.from.line>=d){if(s&&l&&s.test(l.className))return;n=i(f.indicatorOpen)}}(n||l)&&e.setGutterMarker(o,f.gutter,n)}))}function l(e){return new RegExp("(^|\\s)"+e+"(?:$|\\s)\\s*")}function d(e){var t=e.getViewport(),o=e.state.foldGutter;o&&(e.operation((function(){f(e,t.from,t.to)})),o.from=t.from,o.to=t.to)}function u(e,o,n){var i=e.state.foldGutter;if(i){var f=i.options;if(n==f.gutter){var a=r(e,o);a?a.clear():e.foldCode(t(o,0),f)}}}function c(e){var t=e.state.foldGutter;if(t){var o=t.options;t.from=t.to=0,clearTimeout(t.changeUpdate),t.changeUpdate=setTimeout((function(){d(e)}),o.foldOnChangeTimeSpan||600)}}function s(e){var t=e.state.foldGutter;if(t){var o=t.options;clearTimeout(t.changeUpdate),t.changeUpdate=setTimeout((function(){var o=e.getViewport();t.from==t.to||o.from-t.to>20||t.from-o.to>20?d(e):e.operation((function(){o.from<t.from&&(f(e,o.from,t.from),t.from=o.from),o.to>t.to&&(f(e,t.to,o.to),t.to=o.to)}))}),o.updateViewportTimeSpan||400)}}function p(e,t){var o=e.state.foldGutter;if(o){var n=t.line;n>=o.from&&n<o.to&&f(e,n,n+1)}}a(o,"State"),a(n,"parseOptions"),a(r,"isFolded"),a(i,"marker"),a(f,"updateFoldInfo"),a(l,"classTest"),a(d,"updateInViewport"),a(u,"onGutterClick"),a(c,"onChange"),a(s,"onViewportChange"),a(p,"onFold")}(i.a.exports);var u=d.exports,c=Object.freeze(l((n={__proto__:null},Object(r.a)(n,Symbol.toStringTag,"Module"),Object(r.a)(n,"default",u),n),[d.exports]))}}]);
//# sourceMappingURL=7.482e5420.chunk.js.map