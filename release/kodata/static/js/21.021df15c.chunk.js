(this["webpackJsonp@scaffold-eth/react-app"]=this["webpackJsonp@scaffold-eth/react-app"]||[]).push([[21],{1598:function(e,n,t){"use strict";t.r(n),t.d(n,"c",(function(){return f}));var i,l=t(2),o=t(1591),r=Object.defineProperty,a=function(e,n){return r(e,"name",{value:n,configurable:!0})};function c(e,n){return n.forEach((function(n){n&&"string"!==typeof n&&!Array.isArray(n)&&Object.keys(n).forEach((function(t){if("default"!==t&&!(t in e)){var i=Object.getOwnPropertyDescriptor(n,t);Object.defineProperty(e,t,i.get?i:{enumerable:!0,get:function(){return n[t]}})}}))})),Object.freeze(e)}a(c,"_mergeNamespaces");var m={exports:{}};!function(e){var n={},t=/[^\s\u00a0]/,i=e.Pos,l=e.cmpPos;function o(e){var n=e.search(t);return-1==n?0:n}function r(e,n,t){return/\bstring\b/.test(e.getTokenTypeAt(i(n.line,0)))&&!/^[\'\"\`]/.test(t)}function c(e,n){var t=e.getMode();return!1!==t.useInnerComments&&t.innerMode?e.getModeAt(n):t}a(o,"firstNonWS"),e.commands.toggleComment=function(e){e.toggleComment()},e.defineExtension("toggleComment",(function(e){e||(e=n);for(var t=this,l=1/0,o=this.listSelections(),r=null,a=o.length-1;a>=0;a--){var c=o[a].from(),m=o[a].to();c.line>=l||(m.line>=l&&(m=i(l,0)),l=c.line,null==r?t.uncomment(c,m,e)?r="un":(t.lineComment(c,m,e),r="line"):"un"==r?t.uncomment(c,m,e):t.lineComment(c,m,e))}})),a(r,"probablyInsideString"),a(c,"getMode"),e.defineExtension("lineComment",(function(e,l,a){a||(a=n);var m=this,s=c(m,e),f=m.getLine(e.line);if(null!=f&&!r(m,e,f)){var g=a.lineComment||s.lineComment;if(g){var u=Math.min(0!=l.ch||l.line==e.line?l.line+1:l.line,m.lastLine()+1),d=null==a.padding?" ":a.padding,h=a.commentBlankLines||e.line==l.line;m.operation((function(){if(a.indent){for(var n=null,l=e.line;l<u;++l){var r=(c=m.getLine(l)).slice(0,o(c));(null==n||n.length>r.length)&&(n=r)}for(l=e.line;l<u;++l){var c=m.getLine(l),s=n.length;(h||t.test(c))&&(c.slice(0,s)!=n&&(s=o(c)),m.replaceRange(n+g+d,i(l,0),i(l,s)))}}else for(l=e.line;l<u;++l)(h||t.test(m.getLine(l)))&&m.replaceRange(g+d,i(l,0))}))}else(a.blockCommentStart||s.blockCommentStart)&&(a.fullLines=!0,m.blockComment(e,l,a))}})),e.defineExtension("blockComment",(function(e,o,r){r||(r=n);var a=this,m=c(a,e),s=r.blockCommentStart||m.blockCommentStart,f=r.blockCommentEnd||m.blockCommentEnd;if(s&&f){if(!/\bcomment\b/.test(a.getTokenTypeAt(i(e.line,0)))){var g=Math.min(o.line,a.lastLine());g!=e.line&&0==o.ch&&t.test(a.getLine(g))&&--g;var u=null==r.padding?" ":r.padding;e.line>g||a.operation((function(){if(0!=r.fullLines){var n=t.test(a.getLine(g));a.replaceRange(u+f,i(g)),a.replaceRange(s+u,i(e.line,0));var c=r.blockCommentLead||m.blockCommentLead;if(null!=c)for(var d=e.line+1;d<=g;++d)(d!=g||n)&&a.replaceRange(c+u,i(d,0))}else{var h=0==l(a.getCursor("to"),o),p=!a.somethingSelected();a.replaceRange(f,o),h&&a.setSelection(p?o:a.getCursor("from"),o),a.replaceRange(s,e)}}))}}else(r.lineComment||m.lineComment)&&0!=r.fullLines&&a.lineComment(e,o,r)})),e.defineExtension("uncomment",(function(e,l,o){o||(o=n);var r,a=this,m=c(a,e),s=Math.min(0!=l.ch||l.line==e.line?l.line:l.line-1,a.lastLine()),f=Math.min(e.line,s),g=o.lineComment||m.lineComment,u=[],d=null==o.padding?" ":o.padding;e:if(g){for(var h=f;h<=s;++h){var p=a.getLine(h),b=p.indexOf(g);if(b>-1&&!/comment/.test(a.getTokenTypeAt(i(h,b+1)))&&(b=-1),-1==b&&t.test(p))break e;if(b>-1&&t.test(p.slice(0,b)))break e;u.push(p)}if(a.operation((function(){for(var e=f;e<=s;++e){var n=u[e-f],t=n.indexOf(g),l=t+g.length;t<0||(n.slice(l,l+d.length)==d&&(l+=d.length),r=!0,a.replaceRange("",i(e,t),i(e,l)))}})),r)return!0}var v=o.blockCommentStart||m.blockCommentStart,C=o.blockCommentEnd||m.blockCommentEnd;if(!v||!C)return!1;var k=o.blockCommentLead||m.blockCommentLead,L=a.getLine(f),O=L.indexOf(v);if(-1==O)return!1;var x=s==f?L:a.getLine(s),y=x.indexOf(C,s==f?O+v.length:0),S=i(f,O+1),R=i(s,y+1);if(-1==y||!/comment/.test(a.getTokenTypeAt(S))||!/comment/.test(a.getTokenTypeAt(R))||a.getRange(S,R,"\n").indexOf(C)>-1)return!1;var T=L.lastIndexOf(v,e.ch),E=-1==T?-1:L.slice(0,e.ch).indexOf(C,T+v.length);if(-1!=T&&-1!=E&&E+C.length!=e.ch)return!1;E=x.indexOf(C,l.ch);var M=x.slice(l.ch).lastIndexOf(v,E-l.ch);return T=-1==E||-1==M?-1:l.ch+M,(-1==E||-1==T||T==l.ch)&&(a.operation((function(){a.replaceRange("",i(s,y-(d&&x.slice(y-d.length,y)==d?d.length:0)),i(s,y+C.length));var e=O+v.length;if(d&&L.slice(e,e+d.length)==d&&(e+=d.length),a.replaceRange("",i(f,O),i(f,e)),k)for(var n=f+1;n<=s;++n){var l=a.getLine(n),o=l.indexOf(k);if(-1!=o&&!t.test(l.slice(0,o))){var r=o+k.length;d&&l.slice(r,r+d.length)==d&&(r+=d.length),a.replaceRange("",i(n,o),i(n,r))}}})),!0)}))}(o.a.exports);var s=m.exports,f=Object.freeze(c((i={__proto__:null},Object(l.a)(i,Symbol.toStringTag,"Module"),Object(l.a)(i,"default",s),i),[m.exports]))}}]);
//# sourceMappingURL=21.021df15c.chunk.js.map