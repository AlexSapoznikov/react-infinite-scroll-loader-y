(this["webpackJsonpreact-infinite-scroll-loader-y-example"]=this["webpackJsonpreact-infinite-scroll-loader-y-example"]||[]).push([[0],{12:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),c=n(4),a=n.n(c),l=n(1),i=n.n(l),u=n(5),s=n(2);var d=Object(r.forwardRef)((function(e,t){var n=e.children,c=e.dataLength,a=e.loadMore,l=e.hasMore,i=e.loader,u=e.threshold,s=e.parentRef,d=e.startPage,m=e.loadFirstSetOnInit,f=e.resetDependencies,v=e.disabled,h=Object(r.createRef)(),g=Object(r.useState)(d&&d>=0?d:0),p=g[0],b=g[1],E=Object(r.useState)(p),O=E[0],w=E[1],j=Object(r.useState)(c),y=j[0],S=j[1],H=Object(r.useState)([]),L=H[0],x=H[1],I=Array.isArray(f)?f:[f],M=function(e){void 0===e&&(e={});var t=e.startPage;Number.isInteger(t)&&t>=0?(b(t),w(t)):w(p),S(c),x([])};return Object(r.useImperativeHandle)(t,(function(){return{reset:M}})),Object(r.useEffect)((function(){M()}),I),Object(r.useEffect)((function(){Number.isInteger(y)||console.error("InfiniteScroll: dataLength prop is not a number",y),c>y&&w(O+1),S(c)}),[c]),Object(r.useEffect)((function(){if(!v){var e=null===s||void 0===s?void 0:s.current,t=function(){var t,n,r=e?e.scrollTop+e.offsetHeight:Math.max(document.documentElement&&document.documentElement.scrollTop,document.body&&document.body.scrollTop,document.scrollingElement&&document.scrollingElement.scrollTop)+window.innerHeight,o=e?e.scrollHeight:Math.max(document.documentElement&&document.documentElement.scrollHeight,document.body&&document.body.scrollHeight,document.scrollingElement&&document.scrollingElement.scrollHeight),c=m&&O===p,i=o-r<(u||250),s=L.includes(O),d=0===(null===h||void 0===h||null===(t=h.current)||void 0===t||null===(n=t.parentElement)||void 0===n?void 0:n.offsetHeight);!(c||l&&i)||s||d||(x([].concat(L,[O])),a(O))};return t(),(e||window).addEventListener("scroll",t),(e||window).addEventListener("resize",t),function(){(e||window).removeEventListener("scroll",t),(e||window).removeEventListener("resize",t)}}}),[O,L,l,v]),o.a.createElement(r.Fragment,null,o.a.createElement("div",{ref:h,style:{display:"none"}}),n,l&&i)}));function m(e){var t=e.offset,n=e.limit;return new Promise((function(e){setTimeout((function(){e({data:Array(500).fill(null).map((function(e,t){return"item-".concat(t+1)})).slice(t,t+n),total:500})}),500)}))}var f=function(){var e=Object(r.useState)([]),t=Object(s.a)(e,2),n=t[0],c=t[1],a=Object(r.useState)(!0),l=Object(s.a)(a,2),f=l[0],v=l[1],h=function(){var e=Object(u.a)(i.a.mark((function e(t){var r,o,a,l;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m({offset:20*t,limit:20});case 2:r=e.sent,o=r.data,a=r.total,l=n.concat(o||[]),v(!!(null===o||void 0===o?void 0:o.length)&&a>l.length),c(l);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return o.a.createElement(d,{dataLength:n.length,loadMore:function(e){return h(e)},hasMore:f,loader:o.a.createElement("div",null,"Loading..."),loadFirstSetOnInit:!n.length,startPage:Math.ceil(n.length/20)},n.map((function(e){return o.a.createElement("div",null,e)})))};a.a.render(o.a.createElement(f,null),document.getElementById("root"))},6:function(e,t,n){e.exports=n(12)}},[[6,1,2]]]);
//# sourceMappingURL=main.dcde0cfd.chunk.js.map