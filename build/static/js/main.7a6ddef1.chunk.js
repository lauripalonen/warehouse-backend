(this["webpackJsonpwarehouse-frontend"]=this["webpackJsonpwarehouse-frontend"]||[]).push([[0],{71:function(e,t,a){},72:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a(13),c=a.n(r),s=a(18),i=a(12),u=a.n(i),o=a(16),l=a(17),d=a.n(l),b="/api/products",f={getAll:function(){var e=Object(o.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.a.get(b);case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),getBeanies:function(){var e=Object(o.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.a.get("".concat(b,"/beanies"));case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),getFacemasks:function(){var e=Object(o.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.a.get("".concat(b,"/facemasks"));case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),getGloves:function(){var e=Object(o.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.a.get("".concat(b,"/gloves"));case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},j=a(15),h=a(34),p=(a(69),a(8)),g=function(e){var t=e.beanies,a=e.gloves,n=e.facemasks,r=e.category,c="";switch(r){case"beanies":c=t;break;case"facemasks":c=n;break;case"gloves":c=a;break;default:c=""}return""===c?Object(p.jsx)("div",{}):c.length>0?Object(p.jsx)("div",{className:"product-list",children:Object(p.jsx)(h.a,{children:function(e){var t=e.width,a=e.height;return Object(p.jsxs)(j.b,{width:t,height:a,headerHeight:50,rowHeight:30,rowCount:c.length,rowGetter:function(e){var t=e.index;return c[t]},children:[Object(p.jsx)(j.a,{width:250,label:"Name",dataKey:"name"}),Object(p.jsx)(j.a,{width:150,label:"Availability",dataKey:"availability"}),Object(p.jsx)(j.a,{width:80,label:"Price",dataKey:"price"}),Object(p.jsx)(j.a,{width:150,label:"Manufacturer",dataKey:"manufacturer"}),Object(p.jsx)(j.a,{width:100,label:"Color",dataKey:"color"})]})}})}):Object(p.jsx)("div",{children:"loading..."})},v=function(e){var t=e.category,a=e.handleClick,n=e.products;if(!n)return Object(p.jsx)("div",{children:"loading..."});var r=!(n.length>0);return Object(p.jsx)("button",{disabled:r,onClick:function(e){return a(t,e)},children:t})},O=function(){var e=Object(n.useState)("beanies"),t=Object(s.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)([]),i=Object(s.a)(c,2),u=i[0],o=i[1],l=Object(n.useState)([]),d=Object(s.a)(l,2),b=d[0],j=d[1],h=Object(n.useState)([]),O=Object(s.a)(h,2),x=O[0],m=O[1];Object(n.useEffect)((function(){new EventSource("http://localhost:3001/stream").onmessage=function(e){console.log("received message: ",e);var t=e.find((function(e){return"beanies"===e.category})).products,a=e.find((function(e){return"facemasks"===e.category})).products,n=e.find((function(e){return"gloves"===e.category})).products;o(t),j(a),m(n)},f.getBeanies().then((function(e){o(e),r("beanies")})),f.getFacemasks().then((function(e){j(e)})),f.getGloves().then((function(e){m(e)}))}),[]);var w=function(e,t){t.preventDefault(),r(e)},y=function(){return Object(p.jsxs)("div",{className:"header",children:[Object(p.jsx)(v,{category:"beanies",handleClick:w,products:u}),Object(p.jsx)(v,{category:"facemasks",handleClick:w,products:b}),Object(p.jsx)(v,{category:"gloves",handleClick:w,products:x}),Object(p.jsxs)("h2",{className:"display-text",children:["Displaying: ",a]})]})};return Object(p.jsxs)("div",{className:"container",children:[Object(p.jsx)(y,{}),Object(p.jsx)(g,{beanies:u,facemasks:b,gloves:x,category:a})]})};a(71);c.a.render(Object(p.jsx)(O,{}),document.getElementById("root"))}},[[72,1,2]]]);
//# sourceMappingURL=main.7a6ddef1.chunk.js.map