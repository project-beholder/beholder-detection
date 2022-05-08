!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("mathjs")):"function"==typeof define&&define.amd?define(["mathjs"],t):"object"==typeof exports?exports["beholder-detection"]=t(require("mathjs")):e["beholder-detection"]=t(e.mathjs)}(window,(function(e){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(t,n){t.exports=e},function(e,t,n){"use strict";var r=n(2),i=n.n(r)()((function(e){return e[1]}));i.push([e.i,"#beholder-overlay {\n  top: 0;\n  left: 0;\n  position: absolute;\n}\n\n#beholder-video {\n  display: none;\n}\n\n.hidden {\n  display: none;\n}\n\n#detection-panel {\n  width: min(90vw, 800px);\n  height: 90vh;\n  margin: 5vh calc(50vw - 0.5 * min(90vw, 800px));\n  box-sizing: border-box;\n  z-index: 999;\n  /* display: none; */\n  background: black;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  color: white;\n  \n  font-family: monospace;\n  font-size: 12px;\n  position: relative;\n}\n\n#detection-panel #full-video-div {\n  position: relative;\n  float: left;\n  width: 100%;\n}\n\n#full-video-div canvas {\n  position: relative;\n  width: 100%;\n}\n\n#full-video-div #detection-area {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n  border: 1px solid #00FF00;\n}\n\n#detection-panel #detection-video-div {\n  position: relative;\n  float: left;\n  width: 100%;\n}\n\n#detection-video-div #detection-canvas {\n  position: relative;\n  width: 100%;\n}\n\n#area-buttons {\n  position: relative;\n  float: left;\n  width: 100%;\n  height: 5em;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n#area-buttons button {\n  padding: 0.5em 1em;\n  margin: 1em;\n}\n\n#detection-video-div #debug-canvas {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n#detection-panel #parameters-menu {\n  position: relative;\n  float: left;\n  clear: both;\n  margin: 1em 0 1em 0em;\n  padding: 1em 1.5em 1em 1.5em;\n  background: black;\n}\n\n#detection-panel #parameters-menu .parameter-item {\n  position: relative;\n  float: left;\n  clear: both;\n  margin: 0.25em 0 0.25em 0;\n}\n\n#detection-panel #parameters-menu .parameter-item span {\n  position: relative;\n  float: left;\n  width: 18em;\n  font-weight: 600;\n  color: white;\n}\n\n\n#toggle-screen {\n  position: absolute;\n  left: 10px;\n  top: 10px;\n  width: 60px;\n  height: 60px;\n  background: #000;\n  z-index: 9999;\n  color: white;\n  text-align: center;\n  font-size: 20px;\n  font-weight: 400;\n  padding: 18px 0;\n  border-radius: 30px;\n  box-sizing: border-box;\n  cursor: pointer;\n  transition: all 100ms ease-in;\n}\n\n#toggle-screen:hover, #toggle-screen:active {\n  background: white;\n  color: black;\n}\n\n#beholder-video {\n  display: none;\n}\n",""]),t.a=i},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=e(t);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var i={};if(r)for(var a=0;a<this.length;a++){var s=this[a][0];null!=s&&(i[s]=!0)}for(var o=0;o<e.length;o++){var c=[].concat(e[o]);r&&i[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),t.push(c))}},t}},function(e,t,n){"use strict";n.r(t),n.d(t,"update",(function(){return z})),n.d(t,"getAllMarkers",(function(){return N})),n.d(t,"getMarker",(function(){return H})),n.d(t,"getMarkerPair",(function(){return G}));const r=[{width:320,height:240},{width:640,height:360},{width:1280,height:720},{width:1920,height:1080}];var i=class{constructor(e){this.video=e,this.vStream=null;const t=document.querySelector("#camera_param_id");t.innerHTML="",navigator.mediaDevices.enumerateDevices().then(e=>{e.forEach((e,n)=>{if("videoinput"===e.kind){const r=document.createElement("option");r.value=e.deviceId,r.label=e.label?e.label:n,0===n&&(r.selected=!0),t.appendChild(r)}})})}startCameraFeed(e){let t=e.videoSize,n=e.camID,i=e.rearCamera,a=e.torch;const s=r[t];return this.vStream&&this.vStream.getTracks().forEach(e=>{e.stop()}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(e){var t=navigator.webkitGetUserMedia||navigator.mozGetUserMedia;return t?new Promise((function(n,r){t.call(navigator,e,n,r)})):Promise.reject(new Error("getUserMedia is not implemented in this browser"))}),navigator.mediaDevices.getUserMedia({video:{width:s.width,height:s.height,deviceId:0===n||i?{}:{exact:n},facingMode:i?{exact:"environment"}:{}}}).then(e=>{if("srcObject"in this.video?this.video.srcObject=e:this.video.src=window.URL.createObjectURL(e),this.video.width=e.getVideoTracks()[0].getSettings().width,this.video.height=e.getVideoTracks()[0].getSettings().height,this.video.play(),this.vStream=e,console.log("BEHOLDER: new video stream established"),a)if(ImageCapture){const t=e.getVideoTracks()[0];new ImageCapture(t).getPhotoCapabilities().then(()=>{void 0!==t.getCapabilities().torch&&t.applyConstraints({advanced:[{torch:a}]})})}else console.warn("**BEHOLDER WARNING** Flahslight/Torch functionality is not supported on this device or platform")})}},a=a||{};a.Image=function(e,t,n){this.width=e||0,this.height=t||0,this.data=n||[]},a.grayscale=function(e,t){for(var n=e.data,r=t.data,i=n.length,a=0,s=0;a<i;a+=4)r[s++]=.299*n[a]+.587*n[a+1]+.114*n[a+2]+.5&255;return t.width=e.width,t.height=e.height,t},a.threshold=function(e,t,n){var r,i=e.data,a=t.data,s=i.length,o=[];for(r=0;r<256;++r)o[r]=r<=n?0:255;for(r=0;r<s;++r)a[r]=o[i[r]];return t.width=e.width,t.height=e.height,t},a.adaptiveThreshold=function(e,t,n,r){var i,s=e.data,o=t.data,c=s.length,d=[];for(a.stackBoxBlur(e,t,n),i=0;i<768;++i)d[i]=i-255<=-r?255:0;for(i=0;i<c;++i)o[i]=d[s[i]-o[i]+255];return t.width=e.width,t.height=e.height,t},a.otsu=function(e){var t,n,r,i=e.data,a=i.length,s=[],o=0,c=0,d=0,h=0,l=0,u=0;for(r=0;r<256;++r)s[r]=0;for(r=0;r<a;++r)s[i[r]]++;for(r=0;r<256;++r)c+=s[r]*r;for(r=0;r<256;++r)if(0!==(h+=s[r])){if(0===(l=a-h))break;(n=h*l*(t=(d+=s[r]*r)/h-(c-d)/l)*t)>u&&(u=n,o=r)}return o},a.stackBoxBlurMult=[1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265],a.stackBoxBlurShift=[0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13],a.BlurStack=function(){this.color=0,this.next=null},a.stackBoxBlur=function(e,t,n){var r,i,s,o,c,d,h,l,u,p,m=e.data,y=t.data,x=e.height,v=e.width,g=x-1,f=v-1,b=n+n+1,_=n+1,w=a.stackBoxBlurMult[n],S=a.stackBoxBlurShift[n];for(r=i=new a.BlurStack,p=1;p<b;++p)r=r.next=new a.BlurStack;for(r.next=i,c=0,u=0;u<x;++u){for(d=c,o=_*(s=m[c]),r=i,p=0;p<_;++p)r.color=s,r=r.next;for(p=1;p<_;++p)r.color=m[c+p],o+=r.color,r=r.next;for(r=i,l=0;l<v;++l)y[c++]=o*w>>>S,h=d+((h=l+_)<f?h:f),o-=r.color-m[h],r.color=m[h],r=r.next}for(l=0;l<v;++l){for(d=(c=l)+v,o=_*(s=y[c]),r=i,p=0;p<_;++p)r.color=s,r=r.next;for(p=1;p<_;++p)r.color=y[d],o+=r.color,r=r.next,d+=v;for(r=i,u=0;u<x;++u)y[c]=o*w>>>S,h=l+((h=u+_)<g?h:g)*v,o-=r.color-y[h],r.color=y[h],r=r.next,c+=v}return t},a.gaussianBlur=function(e,t,n,r){var i=a.gaussianKernel(r);return t.width=e.width,t.height=e.height,n.width=e.width,n.height=e.height,a.gaussianBlurFilter(e,n,i,!0),a.gaussianBlurFilter(n,t,i,!1),t},a.findContours=function(e,t){var n,r,i,s,o,c,d,h,l,u=e.width,p=e.height,m=[];for(n=a.binaryBorder(e,t),r=a.neighborhoodDeltas(u+2),i=u+3,o=1,h=0;h<p;++h,i+=2)for(l=0;l<u;++l,++i)0!==(s=n[i])&&(c=d=!1,1===s&&0===n[i-1]?c=!0:s>=1&&0===n[i+1]&&(d=!0),(c||d)&&(++o,m.push(a.borderFollowing(n,i,o,{x:l,y:h},d,r))));return m},a.borderFollowing=function(e,t,n,r,i,s){var o,c,d,h,l,u=[];u.hole=i,h=l=i?0:4;do{if(0!==e[o=t+s[h=h-1&7]])break}while(h!==l);if(h===l)e[t]=-n,u.push({x:r.x,y:r.y});else for(c=t,4^h;;){l=h;do{d=c+s[++h]}while(0===e[d]);if((h&=7)-1>>>0<l>>>0?e[c]=-n:1===e[c]&&(e[c]=n),u.push({x:r.x,y:r.y}),h,r.x+=a.neighborhood[h][0],r.y+=a.neighborhood[h][1],d===t&&c===o)break;c=d,h=h+4&7}return u},a.neighborhood=[[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]],a.neighborhoodDeltas=function(e){for(var t=[],n=a.neighborhood.length,r=0;r<n;++r)t[r]=a.neighborhood[r][0]+a.neighborhood[r][1]*e;return t.concat(t)},a.approxPolyDP=function(e,t){var n,r,i,a,s,o,c,d,h,l,u,p={start_index:0,end_index:0},m={start_index:0,end_index:0},y=[],x=[],v=e.length;for(t*=t,u=0,h=0;h<3;++h)for(s=0,r=e[u=(u+m.start_index)%v],++u===v&&(u=0),l=1;l<v;++l)n=e[u],++u===v&&(u=0),(a=(c=n.x-r.x)*c+(d=n.y-r.y)*d)>s&&(s=a,m.start_index=l);for(s<=t?y.push({x:r.x,y:r.y}):(p.start_index=u,p.end_index=m.start_index+=p.start_index,m.start_index-=m.start_index>=v?v:0,m.end_index=p.start_index,m.end_index<m.start_index&&(m.end_index+=v),x.push({start_index:m.start_index,end_index:m.end_index}),x.push({start_index:p.start_index,end_index:p.end_index}));0!==x.length;){if(i=e[(p=x.pop()).end_index%v],r=e[u=p.start_index%v],++u===v&&(u=0),p.end_index<=p.start_index+1)o=!0;else{for(s=0,c=i.x-r.x,d=i.y-r.y,h=p.start_index+1;h<p.end_index;++h)n=e[u],++u===v&&(u=0),(a=Math.abs((n.y-r.y)*c-(n.x-r.x)*d))>s&&(s=a,m.start_index=h);o=s*s<=t*(c*c+d*d)}o?y.push({x:r.x,y:r.y}):(m.end_index=p.end_index,p.end_index=m.start_index,x.push({start_index:m.start_index,end_index:m.end_index}),x.push({start_index:p.start_index,end_index:p.end_index}))}return y},a.warp=function(e,t,n,r){var i,s,o,c,d,h,l,u,p,m,y,x,v,g,f,b,_,w,S,M,k,E,P=e.data,A=t.data,D=e.width,O=e.height,R=0;for(v=(x=a.getPerspectiveTransform(n,r-1))[8],g=x[2],f=x[5],k=0;k<r;++k)for(b=v+=x[7],_=g+=x[1],w=f+=x[4],E=0;E<r;++E)b+=x[6],s=(i=(S=(_+=x[0])/b)>>>0)===D-1?i:i+1,c=1-(o=S-i),l=1-(h=(M=(w+=x[3])/b)-(d=M>>>0)),u=p=d*D,m=y=(d===O-1?d:d+1)*D,A[R++]=l*(c*P[u+i]+o*P[p+s])+h*(c*P[m+i]+o*P[y+s])&255;return t.width=r,t.height=r,t},a.getPerspectiveTransform=function(e,t){var n=a.square2quad(e);return n[0]/=t,n[1]/=t,n[3]/=t,n[4]/=t,n[6]/=t,n[7]/=t,n},a.square2quad=function(e){var t,n,r,i,a,s,o,c=[];return t=e[0].x-e[1].x+e[2].x-e[3].x,n=e[0].y-e[1].y+e[2].y-e[3].y,0===t&&0===n?(c[0]=e[1].x-e[0].x,c[1]=e[2].x-e[1].x,c[2]=e[0].x,c[3]=e[1].y-e[0].y,c[4]=e[2].y-e[1].y,c[5]=e[0].y,c[6]=0,c[7]=0,c[8]=1):(r=e[1].x-e[2].x,i=e[3].x-e[2].x,a=e[1].y-e[2].y,o=r*(s=e[3].y-e[2].y)-i*a,c[6]=(t*s-i*n)/o,c[7]=(r*n-t*a)/o,c[8]=1,c[0]=e[1].x-e[0].x+c[6]*e[1].x,c[1]=e[3].x-e[0].x+c[7]*e[3].x,c[2]=e[0].x,c[3]=e[1].y-e[0].y+c[6]*e[1].y,c[4]=e[3].y-e[0].y+c[7]*e[3].y,c[5]=e[0].y),c},a.isContourConvex=function(e){var t,n,r,i,a,s,o,c,d=0,h=!0,l=e.length,u=0,p=0;for(n=e[l-1],a=(t=e[0]).x-n.x,s=t.y-n.y;u<l;++u){if(++p===l&&(p=0),n=t,o=(t=e[p]).x-n.x,3===(d|=(i=(c=t.y-n.y)*a)>(r=o*s)?1:i<r?2:3)){h=!1;break}a=o,s=c}return h},a.perimeter=function(e){for(var t,n,r=e.length,i=0,a=r-1,s=0;i<r;a=i++)t=e[i].x-e[a].x,n=e[i].y-e[a].y,s+=Math.sqrt(t*t+n*n);return s},a.minEdgeLength=function(e){for(var t,n,r,i=e.length,a=0,s=i-1,o=1/0;a<i;s=a++)(t=(n=e[a].x-e[s].x)*n+(r=e[a].y-e[s].y)*r)<o&&(o=t);return Math.sqrt(o)},a.countNonZero=function(e,t){var n,r,i=e.data,a=t.height,s=t.width,o=t.x+t.y*e.width,c=e.width-s,d=0;for(n=0;n<a;++n){for(r=0;r<s;++r)0!==i[o++]&&++d;o+=c}return d},a.binaryBorder=function(e,t){var n,r,i=e.data,a=e.height,s=e.width,o=0,c=0;for(r=-2;r<s;++r)t[c++]=0;for(n=0;n<a;++n){for(t[c++]=0,r=0;r<s;++r)t[c++]=0===i[o++]?0:1;t[c++]=0}for(r=-2;r<s;++r)t[c++]=0;return t};var s=a;function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}const h={};let l={MIN_MARKER_DISTANCE:10,MIN_MARKER_PERIMETER:.2,MAX_MARKER_PERIMETER:.8,SIZE_AFTER_PERSPECTIVE_REMOVAL:49};h.setCameraParams=e=>{l=c(c({},l),e)},h.Marker=(e,t)=>{const n=(t[0].y-t[2].y)/(t[0].x-t[2].x),r=(t[1].y-t[3].y)/(t[1].x-t[3].x),i={x:0,y:0};var a,s,o;return i.x=function(e,t,n,r){return(n.y-r.y+t*r.x-e*n.x)/(t-e)}(n,r,t[0],t[1]),i.y=(a=t[0],s=n,o=i.x,s*(o-a.x)+a.y),{id:e,corners:t,center:i}},h.Detector=function(){this.grey=new s.Image,this.thres=new s.Image,this.homography=new s.Image,this.binary=[],this.contours=[],this.polys=[],this.candidates=[]},h.Detector.prototype.detect=function(e,t){return s.grayscale(e,this.grey),s.adaptiveThreshold(this.grey,this.thres,2,7),this.contours=s.findContours(this.thres,this.binary),this.candidates=this.findCandidates(this.contours,e.width*t.minMarkerPerimeter,e.width*t.maxMarkerPerimeter,.05,10),this.candidates=this.clockwiseCorners(this.candidates),this.candidates=this.notTooNear(this.candidates,t.minMarkerDistance),this.findMarkers(this.grey,this.candidates,t.sizeAfterPerspectiveRemoval)},h.Detector.prototype.findCandidates=function(e,t,n,r,i){var a,o,c,d=[],h=e.length;for(this.polys=[],c=0;c<h;++c)(a=e[c]).length>=t&&a.length<=n&&(o=s.approxPolyDP(a,a.length*r),this.polys.push(o),4===o.length&&s.isContourConvex(o)&&s.minEdgeLength(o)>=i&&d.push(o));return d},h.Detector.prototype.clockwiseCorners=function(e){var t,n,r,i,a,s=e.length;for(a=0;a<s;++a)t=e[a][1].x-e[a][0].x,r=e[a][1].y-e[a][0].y,n=e[a][2].x-e[a][0].x,t*(e[a][2].y-e[a][0].y)-r*n<0&&(i=e[a][1],e[a][1]=e[a][3],e[a][3]=i);return e},h.Detector.prototype.notTooNear=function(e,t){var n,r,i,a,o,c,d=[],h=e.length;for(a=0;a<h;++a)for(o=a+1;o<h;++o){for(n=0,c=0;c<4;++c)n+=(r=e[a][c].x-e[o][c].x)*r+(i=e[a][c].y-e[o][c].y)*i;n/4<t*t&&(s.perimeter(e[a])<s.perimeter(e[o])?e[a].tooNear=!0:e[o].tooNear=!0)}for(a=0;a<h;++a)e[a].tooNear||d.push(e[a]);return d},h.Detector.prototype.findMarkers=function(e,t,n){var r,i,a,o=[],c=t.length;for(a=0;a<c;++a)r=t[a],s.warp(e,this.homography,r,n),s.threshold(this.homography,this.homography,s.otsu(this.homography)),(i=this.getMarker(this.homography,r))&&o.push(i);return o},h.Detector.prototype.getMarker=function(e,t){var n,r,i,a,o,c=e.width/7>>>0,d=c*c>>1,l=[],u=[],p=[];for(a=0;a<7;++a)for(i=0===a||6===a?1:6,o=0;o<7;o+=i)if(n={x:o*c,y:a*c,width:c,height:c},s.countNonZero(e,n)>d)return null;for(a=0;a<5;++a)for(l[a]=[],o=0;o<5;++o)n={x:(o+1)*c,y:(a+1)*c,width:c,height:c},l[a][o]=s.countNonZero(e,n)>d?1:0;for(u[0]=l,p[0]=this.hammingDistance(u[0]),r={first:p[0],second:0},a=1;a<4;++a)u[a]=this.rotate(u[a-1]),p[a]=this.hammingDistance(u[a]),p[a]<r.first&&(r.first=p[a],r.second=a);return 0!==r.first?null:h.Marker(this.mat2id(u[r.second]),this.rotate2(t,4-r.second))},h.Detector.prototype.hammingDistance=function(e){var t,n,r,i,a,s=[[1,0,0,0,0],[1,0,1,1,1],[0,1,0,0,1],[0,1,1,1,0]],o=0;for(r=0;r<5;++r){for(n=1/0,i=0;i<4;++i){for(t=0,a=0;a<5;++a)t+=e[r][a]===s[i][a]?0:1;t<n&&(n=t)}o+=n}return o},h.Detector.prototype.mat2id=function(e){var t,n=0;for(t=0;t<5;++t)n<<=1,n|=e[t][1],n<<=1,n|=e[t][3];return n},h.Detector.prototype.rotate=function(e){var t,n,r=[],i=e.length;for(t=0;t<i;++t)for(r[t]=[],n=0;n<e[t].length;++n)r[t][n]=e[e[t].length-n-1][t];return r},h.Detector.prototype.rotate2=function(e,t){var n,r=[],i=e.length;for(n=0;n<i;++n)r[n]=e[(t+n)%i];return r};var u=h;var p=class{constructor(e,t){this.canvas=e,this.ctx=this.canvas.getContext("2d"),this.video=t,this.detector=new u.Detector}detect(e,t,n){if(this.video&&4===this.video.readyState){const r=n.area.end.x-n.area.start.x,i=n.area.end.y-n.area.start.y;this.video.width>20&&this.canvas.width!==this.video.width*r&&(this.canvas.width=this.video.width*r,this.canvas.height=this.video.height*i),this.ctx.filter=`contrast(${(100+Math.floor(t.contrast))/100})\n      brightness(${(100+Math.floor(t.brightness))/100})\n      grayscale(${Math.floor(t.grayscale)/100})`,t.flip?(this.ctx.save(),this.ctx.translate(this.canvas.width,0),this.ctx.scale(-1,1),this.ctx.drawImage(this.video,n.area.start.x*this.video.width,n.area.start.y*this.video.height,this.canvas.width,this.canvas.height,0,0,this.canvas.width,this.canvas.height),this.ctx.restore()):this.ctx.drawImage(this.video,n.area.start.x*this.video.width,n.area.start.y*this.video.height,this.canvas.width,this.canvas.height,0,0,this.canvas.width,this.canvas.height);let a=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);return[this.detector.detect(a,n),e,this.canvas.width,this.canvas.height]}return[[],e,this.canvas.width,this.canvas.height]}};class m{static sub(e,t){return new m(t.x-e.x,t.y-e.y)}static fromAngle(e){return new m(Math.cos(e),Math.sin(e))}static add(e,t){return new m(t.x+e.x,t.y+e.y)}static addScalar(e,t,n){const r=e.x+t.x*n,i=e.y+t.y*n;return new m(r,i)}static mag(e){return Math.sqrt(e.x*e.x+e.y*e.y)}static angleBetween(e,t){return Math.atan2(e.x*t.y-e.y*t.x,e.x*t.x+e.y*t.y)}static rotate(e,t){const n=e.x*Math.cos(t)-e.y*Math.sin(t),r=e.x*Math.sin(t)+e.y*Math.cos(t);return new m(n,r)}static scale(e,t){return new m(e.x*t,e.y*t)}static dist(e,t){return new m(t.x-e.x,t.y-e.y).mag()}static dist2(e,t){return new m(t.x-e.x,t.y-e.y).mag2()}static normalize(e){const t=e.mag();return new m(e.x/t,e.y/t)}static copy(e){return new m(e.x,e.y)}constructor(e,t){this.x=e,this.y=t}clone(){return new m(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}set(e,t){return this.x=e,this.y=t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}scale(e){return this.x*=e,this.y*=e,this}mag(){return Math.sqrt(this.x*this.x+this.y*this.y)}mag2(){return this.x*this.x+this.y*this.y}dist(e){return m.sub(this,e).mag()}dist2(e){return m.sub(this,e).mag2()}normalize(){const e=this.mag();return this.x/=e,this.y/=e,this}getAngle(){return Math.atan2(this.y,this.x)}rotate(e){const t=this.x*Math.cos(e)-this.y*Math.sin(e),n=this.x*Math.sin(e)+this.y*Math.cos(e);return this.x=t,this.y=n,this}dot(e){return this.x*e.x+this.y*e.y}angleBetween(e){return Math.atan2(this.x*e.y-this.y*e.x,this.x*e.x+this.y*e.y)}}const y=new m(1,0);var x=class{constructor(e){this.timeout=50,this.timestamp=this.timeout,this.present=!1,this.center=new m(0,0),this.position=new m(0,0),this.rawPosition=new m(0,0),this.deltaPosition=new m(0,0),this.corners=[],this.rawRotation=0,this.rotation=0,this.deltaRotation=0,this.scale=29/640,this.enable3D=!1,this.avgSideLength=0,this.deltaAvgSideLength=0,this.id=e,this.positionSmoothing=0,this.rotationSmoothing=0}setScale(e,t){this.scale=e/t}update(e){this.timestamp=0,this.present=!0,this.deltaPosition.copy(this.position);let t=this.center.clone();this.center.x=this.center.x*this.positionSmoothing+e.center.x*(1-this.positionSmoothing),this.center.y=this.center.y*this.positionSmoothing+e.center.y*(1-this.positionSmoothing),this.position.copy(this.center),this.rawPosition.copy(e.center),this.deltaPosition.sub(this.position).scale(-1),(isNaN(this.center.x)||isNaN(this.center.y))&&(this.center.set(t.x,t.y),this.position.set(t.x,t.y),this.deltaPosition.set(0,0),this.rawP,console.warn("BEHOLDER: Detection Broke Momentarily")),this.corners=e.corners.map(e=>e),this.rawRotation=y.angleBetween(m.sub(this.corners[0],this.corners[1]));const n=m.fromAngle(this.rotation),r=m.fromAngle(this.rawRotation),i=new m(n.x*this.rotationSmoothing+(1*r.x-this.rotationSmoothing),n.y*this.rotationSmoothing+(1*r.y-this.rotationSmoothing));this.rotation=i.getAngle(),this.deltaRotation=m.angleBetween(n,i);const a=this.corners.map((e,t,n)=>{const r=e.x-n[(t+1)%n.length].x,i=e.y-n[(t+1)%n.length].y;return Math.sqrt(r*r+i*i)});this.deltaAvgSideLength=-this.avgSideLength,this.avgSideLength=(a[0]+a[1]+a[2]+a[3])/4,this.deltaAvgSideLength+=this.avgSideLength,this.enable3D&&(this.center.z=this.avgPerim/this.scale)}updatePresence(e){this.timestamp+=e>30?30:e,this.present=!(this.timestamp>=this.timeout)}},v=n(0);var g=class{constructor(e,t){this.markerA=e,this.markerB=t}get isPresent(){return this.markerA.present&&this.markerB.present}get angleBetween(){return this.markerA.rotation-this.markerB.rotation}get distance(){return m.sub(this.markerA.center,this.markerB.center).mag()}getRelativePosition(e){if(this.isPresent()){const t=[{x:-e/2,y:-e/2},{x:e/2,y:-e/2},{x:e/2,y:e/2},{x:-e/2,y:e/2}],n=function(e,t,n,r,i,a,s,o){const c=v.matrix([[i.x,i.y,1,0,0,0,-e.x*i.x,-e.x*i.y],[0,0,0,i.x,i.y,1,-e.y*i.x,-e.y*i.y],[a.x,a.y,1,0,0,0,-t.x*a.x,-t.x*a.y],[0,0,0,a.x,a.y,1,-t.y*a.x,-t.y*a.y],[s.x,s.y,1,0,0,0,-n.x*s.x,-n.x*s.y],[0,0,0,s.x,s.y,1,-n.y*s.x,-n.y*s.y],[o.x,o.y,1,0,0,0,-r.x*o.x,-r.x*o.y],[0,0,0,o.x,o.y,1,-r.y*o.x,-r.y*o.y]]),d=v.matrix([[e.x],[e.y],[t.x],[t.y],[n.x],[n.y],[r.x],[r.y]]),h=v.lusolve(c,d);return v.matrix([[v.subset(h,v.index(0,0)),v.subset(h,v.index(1,0)),v.subset(h,v.index(2,0))],[v.subset(h,v.index(3,0)),v.subset(h,v.index(4,0)),v.subset(h,v.index(5,0))],[v.subset(h,v.index(6,0)),v.subset(h,v.index(7,0)),1]])}(this.markerA.corners[0],this.markerA.corners[1],this.markerA.corners[2],this.markerA.corners[3],t[0],t[1],t[2],t[3]),r=v.inv(n),i=e=>function(e,t){const n=v.matrix([[t.x],[t.y],[1]]),r=v.multiply(e,n);return{x:v.subset(r,v.index(0,0))/v.subset(r,v.index(2,0)),y:v.subset(r,v.index(1,0))/v.subset(r,v.index(2,0))}}(r,e),a=i(this.markerA.center),s=i(this.markerB.center),o=i(this.markerA.corners[0]),c=i(this.markerA.corners[1]),d=i(this.markerB.corners[0]),h=i(this.markerB.corners[1]),l=m.sub(a,s),u=m.sub(o,c);return{distance:m.mag(l),heading:m.angleBetween(u,l),rotation:m.angleBetween(u,m.sub(d,h))}}return{distance:void 0,heading:void 0,rotation:void 0}}},f=n(1);function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function _(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach((function(t){w(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function w(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function S(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,i=!1,a=void 0;try{for(var s,o=e[Symbol.iterator]();!(r=(s=o.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(e){i=!0,a=e}finally{try{r||null==o.return||o.return()}finally{if(i)throw a}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return M(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return M(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function M(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}const k={camera_params:{camID:void 0,videoSize:1,torch:!1,rearCamera:!1},detection_params:{minMarkerDistance:10,minMarkerPerimeter:.02,maxMarkerPerimeter:.8,sizeAfterPerspectiveRemoval:49,area:{start:{x:0,y:0},end:{x:1,y:1}}},feed_params:{contrast:0,brightness:0,grayscale:0,flip:!1},overlay_params:{present:!0,hide:!0}};let E=!1,P=[],A=!1;const D=[];let O,R,j,L,q,I,C,T,B,F={};let $=Date.now();const z=()=>{const e=Date.now(),t=e-$;if($=e,O.videoLoaded){(e=>{const t=S(e,2),n=t[0],r=t[1];I.width!==q.width&&(I.width=q.width,I.height=q.height),A||(C.drawImage(q,0,0,I.width,I.height),C.strokeStyle="#00FF00",C.beginPath(),C.moveTo(I.width*F.detection_params.area.start.x,I.height*F.detection_params.area.start.y),C.lineTo(I.width*F.detection_params.area.end.x,I.height*F.detection_params.area.start.y),C.lineTo(I.width*F.detection_params.area.end.x,I.height*F.detection_params.area.end.y),C.lineTo(I.width*F.detection_params.area.start.x,I.height*F.detection_params.area.end.y),C.closePath(),C.stroke()),T.width=j.width,T.height=j.height,A||B.clearRect(0,0,T.width,T.height),n.forEach(e=>{const t=D.find(t=>t.id===e.id);if(void 0===t)return;if(t.update(e),A)return;const n=t.center,r=t.corners,i=t.rotation;B.strokeStyle="#FF00AA",B.beginPath(),r.forEach((e,t)=>{B.moveTo(e.x,e.y);let n=r[(t+1)%r.length];B.lineTo(n.x,n.y)}),B.stroke(),B.closePath(),B.strokeStyle="blue",B.strokeRect(r[0].x-2,r[0].y-2,4,4),B.strokeStyle="#FF00AA",B.strokeRect(n.x-1,n.y-1,2,2),B.font="12px monospace",B.textAlign="center",B.fillStyle="#FF55AA",B.fillText("ID="+t.id,n.x,n.y-7),B.fillText(i.toFixed(2),n.x,n.y+15)}),D.forEach(e=>e.updatePresence(r))})(R.detect(t,F.feed_params,F.detection_params))}},N=()=>D,H=e=>D.find(t=>t.id===e),G=(e,t)=>new g(D[e],D[t]);t.default={init:(e,t,n)=>{if(n)n.length<=0&&console.warn("BEHOLDER WARNING: your provided list of markers is empty, no markers will be tracked"),n.forEach(e=>D.push(new x(e)));else for(let e=0;e<100;e++)D.push(new x(e));const r=document.querySelector(e);F=k,t&&(t.camera_params&&(F.camera_params=_(_({},F.camera_params),t.camera_params)),t.detection_params&&(F.detection_params=_(_({},F.detection_params),t.detection_params)),t.feed_params&&(F.feed_params=_(_({},F.feed_params),t.feed_params)),t.overlay_params&&(F.overlay_params=_(_({},F.overlay_params),t.overlay_params))),r.innerHTML=((e,t)=>`\n<div id="beholder-overlay" class="active">\n  <style type="text/css">\n  ${t}\n  </style>\n\n  <div id="toggle-screen">\n  ☰\n  </div>\n\n  <div id="detection-panel" ${e.overlay_params.hide?'class="hidden"':""}>\n    \n    <div id="full-video-div">\n      <video id="beholder-video" playsinline="true"></video>\n      <canvas id="detection-canvas-overlay"></canvas>\n    </div>\n    \n    <div id="area-buttons">\n      <button id="set-area" class="parameter-item">Set Detection Area</button>\n      <div id="set-area-instructions"></div>\n      <button id="clear-area" class="parameter-item">Clear Detection Area</button>\n    </div>\n    \n    <div id="detection-video-div">\n      <canvas id="detection-canvas"></canvas>\n      <canvas id="debug-canvas"></canvas>\n    </div>\n\n    <div id="parameters-menu" >\n      <div class="parameter-item">\n        <span>Camera Feed ID</span>\n        <select name="CAMERA_INDEX" id="camera_param_id" class="param-input">\n          <option value="0" label="0" selected></option>\n        </select>\n      </div>\n\n      <div class="parameter-item">\n        <span>Video Size</span>\n        <select name="VIDEO_SIZE_INDEX" id="camera_param_videoSize" class="param-input">\n          <option value="0" label="320&times;240" ${0==e.camera_params.videoSize?"selected":""}></option>\n          <option value="1" label="640&times;480" ${1==e.camera_params.videoSize?"selected":""}></option>\n          <option value="2" label="1280&times;720" ${2==e.camera_params.videoSize?"selected":""}></option>\n          <option value="2" label="1920&times;1080" ${3==e.camera_params.videoSize?"selected":""}></option>\n        </select>\n      </div>\n\n      <div class="parameter-item">\n        <span>Min Marker Distance</span>\n        <input\n          id="detection_params-minMarkerDistance"\n          class="param-input"\n          type="number"\n          name="MIN_MARKER_DISTANCE"\n          min="1"\n          max="50"\n          value="${e.detection_params.minMarkerDistance}"\n          step="1"\n        />\n      </div>\n\n      <div class="parameter-item">\n        <span>Min Marker Perimeter</span>\n        <input\n          id="detection_params-minMarkerPerimeter"\n          class="param-input"\n          type="number"\n          name="MIN_MARKER_PERIMETER"\n          min="0.01"\n          max="0.99"\n          value="${e.detection_params.minMarkerPerimeter}"\n          step="0.01"\n        />\n      </div>\n      <div class="parameter-item">\n        <span>Max Marker Perimeter</span>\n        <input\n          id="detection_params-maxMarkerPerimeter"\n          class="param-input"\n          type="number"\n          name="MAX_MARKER_PERIMETER"\n          min="0.01"\n          max="4.00"\n          value="${e.detection_params.maxMarkerPerimeter}"\n          step="0.01"\n        />\n      </div>\n\n      <div class="parameter-item">\n        <span>Size After Perspective Removal</span>\n        <input\n          id="detection_params-sizeAfterPerspectiveRemoval"\n          class="param-input"\n          type="number"\n          name="SIZE_AFTER_PERSPECTIVE_REMOVAL"\n          min="1"\n          max="200"\n          value="${e.detection_params.sizeAfterPerspectiveRemoval}"\n          step="1"\n        />\n      </div>\n\n      <div class="parameter-item">\n        <span>Contrast</span>\n        <input\n          id="detection_params-contrast"\n          class="param-input"\n          type="number"\n          name="IMAGE_CONTRAST"\n          min="-100"\n          max="100"\n          value="${e.feed_params.contrast}"\n          step="1"\n        />\n      </div>\n\n      <div class="parameter-item">\n        <span>Brightness</span>\n        <input\n          id="detection_params-brightness"\n          class="param-input"\n          type="number"\n          name="IMAGE_BRIGHTNESS"\n          min="-100"\n          max="100"\n          value="${e.feed_params.brightness}"\n          step="1"\n        />\n      </div>\n\n      <div class="parameter-item">\n        <span>Grayscale</span>\n        <input\n          id="detection_params-grayscale"\n          class="param-input"\n          type="number"\n          name="IMAGE_GRAYSCALE"\n          min="0"\n          max="100"\n          value="${e.feed_params.grayscale}"\n          step="1"\n        />\n      </div>\n\n      <div class="parameter-item">\n        <span>Torch</span>\n        <input\n          id="detection_params-torch"\n          class="param-input isCheck"\n          type="checkbox"\n          name="torch"\n          ${e.camera_params.torch?"checked":""}\n        />\n      </div>\n\n      <div class="parameter-item">\n        <span>Mirror Camera</span>\n        <input\n          id="detection_params-flip"\n          class="param-input isCheck"\n          type="checkbox"\n          name="Mirror"\n          ${e.feed_params.flip?"checked":""}\n        />\n      </div>\n    </div>\n  </div>\n</div>`)(F,f.a),q=r.querySelector("#beholder-video"),q.setAttribute("playsinline","playsinline"),document.querySelector("#set-area-instructions").innerHTML=`\n          start=x:${F.detection_params.area.start.x.toFixed(2)},y:${F.detection_params.area.start.y.toFixed(2)}&nbsp;&nbsp;&nbsp;\n          end=x:${F.detection_params.area.end.x.toFixed(2)},y:${F.detection_params.area.end.y.toFixed(2)}\n          `,r.querySelector("#toggle-screen").addEventListener("click",()=>{A?r.querySelector("#detection-panel").classList.remove("hidden"):r.querySelector("#detection-panel").classList.add("hidden"),A=!A}),A=F.overlay_params.hide,A&&r.querySelector("#detection-panel").classList.add("hidden"),r.querySelector("#set-area").addEventListener("click",()=>{E=!0,P=[],document.querySelector("#set-area-instructions").innerHTML="Select top-left corner."}),r.querySelector("#detection-canvas-overlay").addEventListener("click",e=>{E&&(P.push({x:e.offsetX/e.target.clientWidth,y:e.offsetY/e.target.clientHeight}),P.length>1?(E=!1,F.detection_params.area={start:{x:Math.min(P[0].x,P[1].x),y:Math.min(P[0].y,P[1].y)},end:{x:Math.max(P[0].x,P[1].x),y:Math.max(P[0].y,P[1].y)}},document.querySelector("#set-area-instructions").innerHTML=`\n          start=x:${F.detection_params.area.start.x.toFixed(2)},y:${F.detection_params.area.start.y.toFixed(2)}&nbsp;&nbsp;&nbsp;\n          end=x:${F.detection_params.area.end.x.toFixed(2)},y:${F.detection_params.area.end.y.toFixed(2)}\n          `):1===P.length&&(document.querySelector("#set-area-instructions").innerHTML="Select bottom-right corner."))}),r.querySelector("#clear-area").addEventListener("click",()=>{F.detection_params.area={start:{x:0,y:0},end:{x:1,y:1}},document.querySelector("#set-area-instructions").innerHTML=`\n          start=x:${F.detection_params.area.start.x.toFixed(2)},y:${F.detection_params.area.start.y.toFixed(2)}&nbsp;&nbsp;&nbsp;\n          end=x:${F.detection_params.area.end.x.toFixed(2)},y:${F.detection_params.area.end.y.toFixed(2)}\n          `}),r.querySelector("#camera_param_id").addEventListener("change",e=>{F.camera_params.camID=e.target.value,O.startCameraFeed(F.camera_params)}),r.querySelector("#camera_param_videoSize").addEventListener("change",e=>{F.camera_params.videoSize=e.target.value,O.startCameraFeed(F.camera_params)}),r.querySelector("#detection_params-minMarkerDistance").addEventListener("change",e=>F.detection_params.minMarkerDistance=e.target.value),r.querySelector("#detection_params-minMarkerPerimeter").addEventListener("change",e=>F.detection_params.minMarkerPerimeter=e.target.value),r.querySelector("#detection_params-maxMarkerPerimeter").addEventListener("change",e=>F.detection_params.maxMarkerPerimeter=e.target.value),r.querySelector("#detection_params-sizeAfterPerspectiveRemoval").addEventListener("change",e=>F.detection_params.sizeAfterPerspectiveRemoval=e.target.value),r.querySelector("#detection_params-contrast").addEventListener("change",e=>F.feed_params.contrast=e.target.value),r.querySelector("#detection_params-brightness").addEventListener("change",e=>F.feed_params.brightness=e.target.value),r.querySelector("#detection_params-grayscale").addEventListener("change",e=>F.feed_params.grayscale=e.target.value),r.querySelector("#detection_params-flip").addEventListener("change",e=>F.feed_params.flip=e.target.checked),r.querySelector("#detection_params-torch").addEventListener("change",e=>{F.camera_params.torch=e.target.checked,O.startCameraFeed(F.camera_params)}),O=new i(r.querySelector("#beholder-video")),R=new p(r.querySelector("#detection-canvas"),r.querySelector("#beholder-video")),I=r.querySelector("#detection-canvas-overlay"),C=I.getContext("2d"),j=r.querySelector("#detection-canvas"),L=j.getContext("2d"),T=r.querySelector("#debug-canvas"),B=T.getContext("2d"),window.addEventListener("resize",()=>O.startCameraFeed(F.camera_params)),O.startCameraFeed(F.camera_params)},update:z,getMarker:H,getMarkerPair:G,getAllMarkers:N,hide:()=>{document.querySelector("#detection-panel").classList.add("hidden")},show:()=>{document.querySelector("#detection-panel").classList.remove("hidden")},getVideo:()=>O.video}}])}));