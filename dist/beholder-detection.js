!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("mathjs")):"function"==typeof define&&define.amd?define(["mathjs"],e):"object"==typeof exports?exports["beholder-detection"]=e(require("mathjs")):t["beholder-detection"]=e(t.mathjs)}(window,(function(t){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(e,r){e.exports=t},function(t,e,r){"use strict";r.r(e),r.d(e,"init",(function(){return p})),r.d(e,"getAllMarkers",(function(){return v})),r.d(e,"getMarker",(function(){return E})),r.d(e,"getMarkerPair",(function(){return _})),r.d(e,"update",(function(){return b}));var n=n||{};n.Image=function(t,e,r){this.width=t||0,this.height=e||0,this.data=r||[]},n.threshold=function(t,e,r){var n,i=t.data,o=e.data,s=i.length,a=[];for(n=0;n<256;++n)a[n]=n<=r?0:255;for(n=0;n<s;++n)o[n]=a[i[n]];return e.width=t.width,e.height=t.height,e},n.otsu=function(t){var e,r,n,i=t.data,o=i.length,s=[],a=0,h=0,d=0,c=0,u=0,x=0;for(n=0;n<256;++n)s[n]=0;for(n=0;n<o;++n)s[i[n]]++;for(n=0;n<256;++n)h+=s[n]*n;for(n=0;n<256;++n)if(0!==(c+=s[n])){if(0===(u=o-c))break;(r=c*u*(e=(d+=s[n]*n)/c-(h-d)/u)*e)>x&&(x=r,a=n)}return a},n.gaussianBlur=function(t,e,r,i){var o=n.gaussianKernel(i);return e.width=t.width,e.height=t.height,r.width=t.width,r.height=t.height,n.gaussianBlurFilter(t,r,o,!0),n.gaussianBlurFilter(r,e,o,!1),e},n.findContours=function(t,e){var r,i,o,s,a,h,d,c,u,x=t.width,y=t.height,l=[];for(r=n.binaryBorder(t,e),i=n.neighborhoodDeltas(x+2),o=x+3,a=1,c=0;c<y;++c,o+=2)for(u=0;u<x;++u,++o)0!==(s=r[o])&&(h=d=!1,1===s&&0===r[o-1]?h=!0:s>=1&&0===r[o+1]&&(d=!0),(h||d)&&(++a,l.push(n.borderFollowing(r,o,a,{x:u,y:c},d,i))));return l},n.borderFollowing=function(t,e,r,i,o,s){var a,h,d,c,u,x=[];x.hole=o,c=u=o?0:4;do{if(0!==t[a=e+s[c=c-1&7]])break}while(c!==u);if(c===u)t[e]=-r,x.push({x:i.x,y:i.y});else for(h=e,4^c;;){u=c;do{d=h+s[++c]}while(0===t[d]);if((c&=7)-1>>>0<u>>>0?t[h]=-r:1===t[h]&&(t[h]=r),x.push({x:i.x,y:i.y}),c,i.x+=n.neighborhood[c][0],i.y+=n.neighborhood[c][1],d===e&&h===a)break;h=d,c=c+4&7}return x},n.neighborhood=[[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]],n.neighborhoodDeltas=function(t){for(var e=[],r=n.neighborhood.length,i=0;i<r;++i)e[i]=n.neighborhood[i][0]+n.neighborhood[i][1]*t;return e.concat(e)},n.approxPolyDP=function(t,e){var r,n,i,o,s,a,h,d,c,u,x,y={start_index:0,end_index:0},l={start_index:0,end_index:0},f=[],g=[],m=t.length;for(e*=e,x=0,c=0;c<3;++c)for(s=0,n=t[x=(x+l.start_index)%m],++x===m&&(x=0),u=1;u<m;++u)r=t[x],++x===m&&(x=0),(o=(h=r.x-n.x)*h+(d=r.y-n.y)*d)>s&&(s=o,l.start_index=u);for(s<=e?f.push({x:n.x,y:n.y}):(y.start_index=x,y.end_index=l.start_index+=y.start_index,l.start_index-=l.start_index>=m?m:0,l.end_index=y.start_index,l.end_index<l.start_index&&(l.end_index+=m),g.push({start_index:l.start_index,end_index:l.end_index}),g.push({start_index:y.start_index,end_index:y.end_index}));0!==g.length;){if(i=t[(y=g.pop()).end_index%m],n=t[x=y.start_index%m],++x===m&&(x=0),y.end_index<=y.start_index+1)a=!0;else{for(s=0,h=i.x-n.x,d=i.y-n.y,c=y.start_index+1;c<y.end_index;++c)r=t[x],++x===m&&(x=0),(o=Math.abs((r.y-n.y)*h-(r.x-n.x)*d))>s&&(s=o,l.start_index=c);a=s*s<=e*(h*h+d*d)}a?f.push({x:n.x,y:n.y}):(l.end_index=y.end_index,y.end_index=l.start_index,g.push({start_index:l.start_index,end_index:l.end_index}),g.push({start_index:y.start_index,end_index:y.end_index}))}return f},n.warp=function(t,e,r,i){var o,s,a,h,d,c,u,x,y,l,f,g,m,p,v,E,_,M,b,w,R,A,P=t.data,I=e.data,S=t.width,k=t.height,D=0;for(m=(g=n.getPerspectiveTransform(r,i-1))[8],p=g[2],v=g[5],R=0;R<i;++R)for(E=m+=g[7],_=p+=g[1],M=v+=g[4],A=0;A<i;++A)E+=g[6],s=(o=(b=(_+=g[0])/E)>>>0)===S-1?o:o+1,h=1-(a=b-o),u=1-(c=(w=(M+=g[3])/E)-(d=w>>>0)),x=y=d*S,l=f=(d===k-1?d:d+1)*S,I[D++]=u*(h*P[x+o]+a*P[y+s])+c*(h*P[l+o]+a*P[f+s])&255;return e.width=i,e.height=i,e},n.getPerspectiveTransform=function(t,e){var r=n.square2quad(t);return r[0]/=e,r[1]/=e,r[3]/=e,r[4]/=e,r[6]/=e,r[7]/=e,r},n.square2quad=function(t){var e,r,n,i,o,s,a,h=[];return e=t[0].x-t[1].x+t[2].x-t[3].x,r=t[0].y-t[1].y+t[2].y-t[3].y,0===e&&0===r?(h[0]=t[1].x-t[0].x,h[1]=t[2].x-t[1].x,h[2]=t[0].x,h[3]=t[1].y-t[0].y,h[4]=t[2].y-t[1].y,h[5]=t[0].y,h[6]=0,h[7]=0,h[8]=1):(n=t[1].x-t[2].x,i=t[3].x-t[2].x,o=t[1].y-t[2].y,a=n*(s=t[3].y-t[2].y)-i*o,h[6]=(e*s-i*r)/a,h[7]=(n*r-e*o)/a,h[8]=1,h[0]=t[1].x-t[0].x+h[6]*t[1].x,h[1]=t[3].x-t[0].x+h[7]*t[3].x,h[2]=t[0].x,h[3]=t[1].y-t[0].y+h[6]*t[1].y,h[4]=t[3].y-t[0].y+h[7]*t[3].y,h[5]=t[0].y),h},n.isContourConvex=function(t){var e,r,n,i,o,s,a,h,d=0,c=!0,u=t.length,x=0,y=0;for(r=t[u-1],o=(e=t[0]).x-r.x,s=e.y-r.y;x<u;++x){if(++y===u&&(y=0),r=e,a=(e=t[y]).x-r.x,3===(d|=(i=(h=e.y-r.y)*o)>(n=a*s)?1:i<n?2:3)){c=!1;break}o=a,s=h}return c},n.perimeter=function(t){for(var e,r,n=t.length,i=0,o=n-1,s=0;i<n;o=i++)e=t[i].x-t[o].x,r=t[i].y-t[o].y,s+=Math.sqrt(e*e+r*r);return s},n.minEdgeLength=function(t){for(var e,r,n,i=t.length,o=0,s=i-1,a=1/0;o<i;s=o++)(e=(r=t[o].x-t[s].x)*r+(n=t[o].y-t[s].y)*n)<a&&(a=e);return Math.sqrt(a)},n.countNonZero=function(t,e){var r,n,i=t.data,o=e.height,s=e.width,a=e.x+e.y*t.width,h=t.width-s,d=0;for(r=0;r<o;++r){for(n=0;n<s;++n)0!==i[a++]&&++d;a+=h}return d},n.binaryBorder=function(t,e){var r,n,i=t.data,o=t.height,s=t.width,a=0,h=0;for(n=-2;n<s;++n)e[h++]=0;for(r=0;r<o;++r){for(e[h++]=0,n=0;n<s;++n)e[h++]=0===i[a++]?0:1;e[h++]=0}for(n=-2;n<s;++n)e[h++]=0;return e};var i=n;function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function s(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach((function(e){a(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function a(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}const h={};let d={MIN_MARKER_DISTANCE:10,MIN_MARKER_PERIMETER:.2,MAX_MARKER_PERIMETER:.8,SIZE_AFTER_PERSPECTIVE_REMOVAL:49};h.setCameraParams=t=>{d=s(s({},d),t)},h.Marker=(t,e)=>{const r=(e[0].y-e[2].y)/(e[0].x-e[2].x),n=(e[1].y-e[3].y)/(e[1].x-e[3].x),i={x:0,y:0};var o,s,a;return i.x=function(t,e,r,n){return(r.y-n.y+e*n.x-t*r.x)/(e-t)}(r,n,e[0],e[1]),i.y=(o=e[0],s=r,a=i.x,s*(a-o.x)+o.y),{id:t,corners:e,center:i}},h.Detector=function(){this.grey=new i.Image,this.thres=new i.Image,this.homography=new i.Image,this.binary=[],this.contours=[],this.polys=[],this.candidates=[]},h.Detector.prototype.detect=function(t){return i.grayscale(t,this.grey),i.adaptiveThreshold(this.grey,this.thres,2,7),this.contours=i.findContours(this.thres,this.binary),this.candidates=this.findCandidates(this.contours,t.width*detectionParams.MIN_MARKER_PERIMETER,t.width*detectionParams.MAX_MARKER_PERIMETER,.05,10),this.candidates=this.clockwiseCorners(this.candidates),this.candidates=this.notTooNear(this.candidates,detectionParams.MIN_MARKER_DISTANCE),this.findMarkers(this.grey,this.candidates,detectionParams.SIZE_AFTER_PERSPECTIVE_REMOVAL)},h.Detector.prototype.findCandidates=function(t,e,r,n,o){var s,a,h,d=[],c=t.length;for(this.polys=[],h=0;h<c;++h)(s=t[h]).length>=e&&s.length<=r&&(a=i.approxPolyDP(s,s.length*n),this.polys.push(a),4===a.length&&i.isContourConvex(a)&&i.minEdgeLength(a)>=o&&d.push(a));return d},h.Detector.prototype.clockwiseCorners=function(t){var e,r,n,i,o,s=t.length;for(o=0;o<s;++o)e=t[o][1].x-t[o][0].x,n=t[o][1].y-t[o][0].y,r=t[o][2].x-t[o][0].x,e*(t[o][2].y-t[o][0].y)-n*r<0&&(i=t[o][1],t[o][1]=t[o][3],t[o][3]=i);return t},h.Detector.prototype.notTooNear=function(t,e){var r,n,o,s,a,h,d=[],c=t.length;for(s=0;s<c;++s)for(a=s+1;a<c;++a){for(r=0,h=0;h<4;++h)r+=(n=t[s][h].x-t[a][h].x)*n+(o=t[s][h].y-t[a][h].y)*o;r/4<e*e&&(i.perimeter(t[s])<i.perimeter(t[a])?t[s].tooNear=!0:t[a].tooNear=!0)}for(s=0;s<c;++s)t[s].tooNear||d.push(t[s]);return d},h.Detector.prototype.findMarkers=function(t,e,r){var n,o,s,a=[],h=e.length;for(s=0;s<h;++s)n=e[s],i.warp(t,this.homography,n,r),i.threshold(this.homography,this.homography,i.otsu(this.homography)),(o=this.getMarker(this.homography,n))&&a.push(o);return a},h.Detector.prototype.getMarker=function(t,e){var r,n,o,s,a,d=t.width/7>>>0,c=d*d>>1,u=[],x=[],y=[];for(s=0;s<7;++s)for(o=0===s||6===s?1:6,a=0;a<7;a+=o)if(r={x:a*d,y:s*d,width:d,height:d},i.countNonZero(t,r)>c)return null;for(s=0;s<5;++s)for(u[s]=[],a=0;a<5;++a)r={x:(a+1)*d,y:(s+1)*d,width:d,height:d},u[s][a]=i.countNonZero(t,r)>c?1:0;for(x[0]=u,y[0]=this.hammingDistance(x[0]),n={first:y[0],second:0},s=1;s<4;++s)x[s]=this.rotate(x[s-1]),y[s]=this.hammingDistance(x[s]),y[s]<n.first&&(n.first=y[s],n.second=s);return 0!==n.first?null:h.Marker(this.mat2id(x[n.second]),this.rotate2(e,4-n.second))},h.Detector.prototype.hammingDistance=function(t){var e,r,n,i,o,s=[[1,0,0,0,0],[1,0,1,1,1],[0,1,0,0,1],[0,1,1,1,0]],a=0;for(n=0;n<5;++n){for(r=1/0,i=0;i<4;++i){for(e=0,o=0;o<5;++o)e+=t[n][o]===s[i][o]?0:1;e<r&&(r=e)}a+=r}return a},h.Detector.prototype.mat2id=function(t){var e,r=0;for(e=0;e<5;++e)r<<=1,r|=t[e][1],r<<=1,r|=t[e][3];return r},h.Detector.prototype.rotate=function(t){var e,r,n=[],i=t.length;for(e=0;e<i;++e)for(n[e]=[],r=0;r<t[e].length;++r)n[e][r]=t[t[e].length-r-1][e];return n},h.Detector.prototype.rotate2=function(t,e){var r,n=[],i=t.length;for(r=0;r<i;++r)n[r]=t[(e+r)%i];return n};var c=h;class u{static sub(t,e){return new u(e.x-t.x,e.y-t.y)}static fromAngle(t){return new u(Math.cos(t),Math.sin(t))}static add(t,e){return new u(e.x+t.x,e.y+t.y)}static addScalar(t,e,r){const n=t.x+e.x*r,i=t.y+e.y*r;return new u(n,i)}static mag(t){return Math.sqrt(t.x*t.x+t.y*t.y)}static angleBetween(t,e){return Math.atan2(t.x*e.y-t.y*e.x,t.x*e.x+t.y*e.y)}static rotate(t,e){const r=t.x*Math.cos(e)-t.y*Math.sin(e),n=t.x*Math.sin(e)+t.y*Math.cos(e);return new u(r,n)}static scale(t,e){return new u(t.x*e,t.y*e)}static dist(t,e){return new u(e.x-t.x,e.y-t.y).mag()}static dist2(t,e){return new u(e.x-t.x,e.y-t.y).mag2()}static normalize(t){const e=t.mag();return new u(t.x/e,t.y/e)}static copy(t){return new u(t.x,t.y)}constructor(t,e){this.x=t,this.y=e}clone(){return new u(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}set(t,e){return this.x=t,this.y=e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}scale(t){return this.x*=t,this.y*=t,this}mag(){return Math.sqrt(this.x*this.x+this.y*this.y)}mag2(){return this.x*this.x+this.y*this.y}dist(t){return u.sub(this,t).mag()}dist2(t){return u.sub(this,t).mag2()}normalize(){const t=this.mag();return this.x/=t,this.y/=t,this}getAngle(){return Math.atan2(this.y,this.x)}rotate(t){const e=this.x*Math.cos(t)-this.y*Math.sin(t),r=this.x*Math.sin(t)+this.y*Math.cos(t);return this.x=e,this.y=r,this}dot(t){return this.x*t.x+this.y*t.y}}var x=class{constructor(t){this.timeout=.05,this.timestamp=this.timeout,this.present=!1,this.center={x:0,y:0},this.corners=[],this.rotation=0,this.id=t}update(t){this.timestamp=0,this.present=!0,this.center=t.center,this.corners=t.corners.map(t=>t),this.rotation=u.angleBetween(u.sub(this.corners[0],this.corners[1]),new u(1,0))}updatePresence(t){this.timestamp+=t,this.present=!(this.timestamp>=this.timeout)}},y=r(0);var l=class{constructor(t,e){this.markerA=t,this.markerB=e}get isPresent(){return this.markerA.present&&this.markerB.present}get angleBetween(){return this.markerA.rotation-this.markerB.rotation}get distance(){return u.sub(this.markerA.center,this.markerB.center).mag()}getRelativePosition(t){if(this.isPresent()){const e=[{x:-t/2,y:-t/2},{x:t/2,y:-t/2},{x:t/2,y:t/2},{x:-t/2,y:t/2}],r=function(t,e,r,n,i,o,s,a){const h=y.matrix([[i.x,i.y,1,0,0,0,-t.x*i.x,-t.x*i.y],[0,0,0,i.x,i.y,1,-t.y*i.x,-t.y*i.y],[o.x,o.y,1,0,0,0,-e.x*o.x,-e.x*o.y],[0,0,0,o.x,o.y,1,-e.y*o.x,-e.y*o.y],[s.x,s.y,1,0,0,0,-r.x*s.x,-r.x*s.y],[0,0,0,s.x,s.y,1,-r.y*s.x,-r.y*s.y],[a.x,a.y,1,0,0,0,-n.x*a.x,-n.x*a.y],[0,0,0,a.x,a.y,1,-n.y*a.x,-n.y*a.y]]),d=y.matrix([[t.x],[t.y],[e.x],[e.y],[r.x],[r.y],[n.x],[n.y]]),c=y.lusolve(h,d);return y.matrix([[y.subset(c,y.index(0,0)),y.subset(c,y.index(1,0)),y.subset(c,y.index(2,0))],[y.subset(c,y.index(3,0)),y.subset(c,y.index(4,0)),y.subset(c,y.index(5,0))],[y.subset(c,y.index(6,0)),y.subset(c,y.index(7,0)),1]])}(this.markerA.corners[0],this.markerA.corners[1],this.markerA.corners[2],this.markerA.corners[3],e[0],e[1],e[2],e[3]),n=y.inv(r),i=t=>function(t,e){const r=y.matrix([[e.x],[e.y],[1]]),n=y.multiply(t,r);return{x:y.subset(n,y.index(0,0))/y.subset(n,y.index(2,0)),y:y.subset(n,y.index(1,0))/y.subset(n,y.index(2,0))}}(n,t),o=i(this.markerA.center),s=i(this.markerB.center),a=i(this.markerA.corners[0]),h=i(this.markerA.corners[1]),d=i(this.markerB.corners[0]),c=i(this.markerB.corners[1]),x=u.sub(o,s),l=u.sub(a,h);return{distance:u.mag(x),heading:u.angleBetween(l,x),rotation:u.angleBetween(l,u.sub(d,c))}}return{distance:void 0,heading:void 0,rotation:void 0}}};let f,g=!1;const m=[];for(let t=0;t<100;t++)m.push(new x(t));const p=()=>{!function(){document.querySelector("#MIN_MARKER_DISTANCE").addEventListener("change",t=>w.setParam("MIN_MARKER_DISTANCE",t.target.value)),document.querySelector("#MIN_MARKER_PERIMETER").addEventListener("change",t=>w.setParam("MIN_MARKER_PERIMETER",t.target.value)),document.querySelector("#MAX_MARKER_PERIMETER").addEventListener("change",t=>w.setParam("MAX_MARKER_PERIMETER",t.target.value)),document.querySelector("#SIZE_AFTER_PERSPECTIVE_REMOVAL").addEventListener("change",t=>w.setParam("SIZE_AFTER_PERSPECTIVE_REMOVAL",t.target.value)),document.querySelector("#IMAGE_BRIGHTNESS").addEventListener("change",t=>{w.setParam("IMAGE_BRIGHTNESS",t.target.value),w.filterImage()}),document.querySelector("#IMAGE_CONTRAST").addEventListener("change",t=>{w.setParam("IMAGE_CONTRAST",t.target.value),w.filterImage()}),document.querySelector("#IMAGE_GRAYSCALE").addEventListener("change",t=>{w.setParam("IMAGE_GRAYSCALE",t.target.value),w.filterImage()});const t=document.querySelector("#CAMERA_INDEX");w.getCameraFeeds().then(e=>{t.innerHTML="",e.forEach((e,r)=>{if("videoinput"===e.kind){const n=document.createElement("option");n.value=e.deviceId,n.label=e.label?e.label:r,0===r&&(n.selected=!0),t.appendChild(n)}}),t.addEventListener("change",t=>{console.log(t.target.value),w.setCamera(t.target.value)})}),document.querySelector("#VIDEO_SIZE_INDEX").addEventListener("change",t=>{console.log(t.target.value),w.setVideoSize(t.target.value)}),document.querySelector("#toggleScreen").addEventListener("click",t=>{appMode=!appMode,document.querySelector("#toggleScreen").classList.toggle("active"),document.querySelector("#detectionDiv").classList.toggle("active")})}(),void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(t){var e=navigator.webkitGetUserMedia||navigator.mozGetUserMedia;return e?new Promise((function(r,n){e.call(navigator,t,r,n)})):Promise.reject(new Error("getUserMedia is not implemented in this browser"))}),navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:"environment"}}).then((function(t){"srcObject"in void 0?(void 0).srcObject=t:(void 0).src=window.URL.createObjectURL(t),f=new c.Detector,g=!0})).catch((function(t){console.log(t.name+": "+t.message)}))};const v=()=>m,E=t=>{if(!(t>m.length))return m[t]},_=(t,e)=>{new l(m[t],m[e])};let M=Date.now();const b=()=>{if(!g)return;const t=Date.now();M=t;beholder.detect();MARKER.forEach(t=>t.updatePresence(timenow))};var w=e.default={init:p,update:b,getMarker:E,getAllMarkers:v,show:show,hide:hide}}])}));