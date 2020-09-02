!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("mathjs"),require("pixi.js")):"function"==typeof define&&define.amd?define(["mathjs","pixi.js"],t):"object"==typeof exports?exports["beholder-detection"]=t(require("mathjs"),require("pixi.js")):e["beholder-detection"]=t(e.mathjs,e.PIXI)}(window,(function(e,t){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=2)}([function(t,r){t.exports=e},function(e,r){e.exports=t},function(e,t,r){"use strict";r.r(t),r.d(t,"init",(function(){return T})),r.d(t,"show",(function(){return A})),r.d(t,"hide",(function(){return R})),r.d(t,"getAllMarkers",(function(){return z})),r.d(t,"getMarker",(function(){return B})),r.d(t,"getMarkerPair",(function(){return F})),r.d(t,"update",(function(){return V}));var n=r(1),i=i||{};i.Image=function(e,t,r){this.width=e||0,this.height=t||0,this.data=r||[]},i.threshold=function(e,t,r){var n,i=e.data,o=t.data,s=i.length,a=[];for(n=0;n<256;++n)a[n]=n<=r?0:255;for(n=0;n<s;++n)o[n]=a[i[n]];return t.width=e.width,t.height=e.height,t},i.otsu=function(e){var t,r,n,i=e.data,o=i.length,s=[],a=0,h=0,d=0,u=0,c=0,l=0;for(n=0;n<256;++n)s[n]=0;for(n=0;n<o;++n)s[i[n]]++;for(n=0;n<256;++n)h+=s[n]*n;for(n=0;n<256;++n)if(0!==(u+=s[n])){if(0===(c=o-u))break;(r=u*c*(t=(d+=s[n]*n)/u-(h-d)/c)*t)>l&&(l=r,a=n)}return a},i.gaussianBlur=function(e,t,r,n){var o=i.gaussianKernel(n);return t.width=e.width,t.height=e.height,r.width=e.width,r.height=e.height,i.gaussianBlurFilter(e,r,o,!0),i.gaussianBlurFilter(r,t,o,!1),t},i.findContours=function(e,t){var r,n,o,s,a,h,d,u,c,l=e.width,x=e.height,y=[];for(r=i.binaryBorder(e,t),n=i.neighborhoodDeltas(l+2),o=l+3,a=1,u=0;u<x;++u,o+=2)for(c=0;c<l;++c,++o)0!==(s=r[o])&&(h=d=!1,1===s&&0===r[o-1]?h=!0:s>=1&&0===r[o+1]&&(d=!0),(h||d)&&(++a,y.push(i.borderFollowing(r,o,a,{x:c,y:u},d,n))));return y},i.borderFollowing=function(e,t,r,n,o,s){var a,h,d,u,c,l=[];l.hole=o,u=c=o?0:4;do{if(0!==e[a=t+s[u=u-1&7]])break}while(u!==c);if(u===c)e[t]=-r,l.push({x:n.x,y:n.y});else for(h=t,4^u;;){c=u;do{d=h+s[++u]}while(0===e[d]);if((u&=7)-1>>>0<c>>>0?e[h]=-r:1===e[h]&&(e[h]=r),l.push({x:n.x,y:n.y}),u,n.x+=i.neighborhood[u][0],n.y+=i.neighborhood[u][1],d===t&&h===a)break;h=d,u=u+4&7}return l},i.neighborhood=[[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]],i.neighborhoodDeltas=function(e){for(var t=[],r=i.neighborhood.length,n=0;n<r;++n)t[n]=i.neighborhood[n][0]+i.neighborhood[n][1]*e;return t.concat(t)},i.approxPolyDP=function(e,t){var r,n,i,o,s,a,h,d,u,c,l,x={start_index:0,end_index:0},y={start_index:0,end_index:0},f=[],p=[],g=e.length;for(t*=t,l=0,u=0;u<3;++u)for(s=0,n=e[l=(l+y.start_index)%g],++l===g&&(l=0),c=1;c<g;++c)r=e[l],++l===g&&(l=0),(o=(h=r.x-n.x)*h+(d=r.y-n.y)*d)>s&&(s=o,y.start_index=c);for(s<=t?f.push({x:n.x,y:n.y}):(x.start_index=l,x.end_index=y.start_index+=x.start_index,y.start_index-=y.start_index>=g?g:0,y.end_index=x.start_index,y.end_index<y.start_index&&(y.end_index+=g),p.push({start_index:y.start_index,end_index:y.end_index}),p.push({start_index:x.start_index,end_index:x.end_index}));0!==p.length;){if(i=e[(x=p.pop()).end_index%g],n=e[l=x.start_index%g],++l===g&&(l=0),x.end_index<=x.start_index+1)a=!0;else{for(s=0,h=i.x-n.x,d=i.y-n.y,u=x.start_index+1;u<x.end_index;++u)r=e[l],++l===g&&(l=0),(o=Math.abs((r.y-n.y)*h-(r.x-n.x)*d))>s&&(s=o,y.start_index=u);a=s*s<=t*(h*h+d*d)}a?f.push({x:n.x,y:n.y}):(y.end_index=x.end_index,x.end_index=y.start_index,p.push({start_index:y.start_index,end_index:y.end_index}),p.push({start_index:x.start_index,end_index:x.end_index}))}return f},i.warp=function(e,t,r,n){var o,s,a,h,d,u,c,l,x,y,f,p,g,m,b,v,w,_,M,E,D,S,k=e.data,C=t.data,P=e.width,T=e.height,j=0;for(g=(p=i.getPerspectiveTransform(r,n-1))[8],m=p[2],b=p[5],D=0;D<n;++D)for(v=g+=p[7],w=m+=p[1],_=b+=p[4],S=0;S<n;++S)v+=p[6],s=(o=(M=(w+=p[0])/v)>>>0)===P-1?o:o+1,h=1-(a=M-o),c=1-(u=(E=(_+=p[3])/v)-(d=E>>>0)),l=x=d*P,y=f=(d===T-1?d:d+1)*P,C[j++]=c*(h*k[l+o]+a*k[x+s])+u*(h*k[y+o]+a*k[f+s])&255;return t.width=n,t.height=n,t},i.getPerspectiveTransform=function(e,t){var r=i.square2quad(e);return r[0]/=t,r[1]/=t,r[3]/=t,r[4]/=t,r[6]/=t,r[7]/=t,r},i.square2quad=function(e){var t,r,n,i,o,s,a,h=[];return t=e[0].x-e[1].x+e[2].x-e[3].x,r=e[0].y-e[1].y+e[2].y-e[3].y,0===t&&0===r?(h[0]=e[1].x-e[0].x,h[1]=e[2].x-e[1].x,h[2]=e[0].x,h[3]=e[1].y-e[0].y,h[4]=e[2].y-e[1].y,h[5]=e[0].y,h[6]=0,h[7]=0,h[8]=1):(n=e[1].x-e[2].x,i=e[3].x-e[2].x,o=e[1].y-e[2].y,a=n*(s=e[3].y-e[2].y)-i*o,h[6]=(t*s-i*r)/a,h[7]=(n*r-t*o)/a,h[8]=1,h[0]=e[1].x-e[0].x+h[6]*e[1].x,h[1]=e[3].x-e[0].x+h[7]*e[3].x,h[2]=e[0].x,h[3]=e[1].y-e[0].y+h[6]*e[1].y,h[4]=e[3].y-e[0].y+h[7]*e[3].y,h[5]=e[0].y),h},i.isContourConvex=function(e){var t,r,n,i,o,s,a,h,d=0,u=!0,c=e.length,l=0,x=0;for(r=e[c-1],o=(t=e[0]).x-r.x,s=t.y-r.y;l<c;++l){if(++x===c&&(x=0),r=t,a=(t=e[x]).x-r.x,3===(d|=(i=(h=t.y-r.y)*o)>(n=a*s)?1:i<n?2:3)){u=!1;break}o=a,s=h}return u},i.perimeter=function(e){for(var t,r,n=e.length,i=0,o=n-1,s=0;i<n;o=i++)t=e[i].x-e[o].x,r=e[i].y-e[o].y,s+=Math.sqrt(t*t+r*r);return s},i.minEdgeLength=function(e){for(var t,r,n,i=e.length,o=0,s=i-1,a=1/0;o<i;s=o++)(t=(r=e[o].x-e[s].x)*r+(n=e[o].y-e[s].y)*n)<a&&(a=t);return Math.sqrt(a)},i.countNonZero=function(e,t){var r,n,i=e.data,o=t.height,s=t.width,a=t.x+t.y*e.width,h=e.width-s,d=0;for(r=0;r<o;++r){for(n=0;n<s;++n)0!==i[a++]&&++d;a+=h}return d},i.binaryBorder=function(e,t){var r,n,i=e.data,o=e.height,s=e.width,a=0,h=0;for(n=-2;n<s;++n)t[h++]=0;for(r=0;r<o;++r){for(t[h++]=0,n=0;n<s;++n)t[h++]=0===i[a++]?0:1;t[h++]=0}for(n=-2;n<s;++n)t[h++]=0;return t};var o=i;function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){h(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function h(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const d={};let u={MIN_MARKER_DISTANCE:10,MIN_MARKER_PERIMETER:.2,MAX_MARKER_PERIMETER:.8,SIZE_AFTER_PERSPECTIVE_REMOVAL:49};d.setCameraParams=e=>{u=a(a({},u),e)},d.Marker=(e,t)=>{const r=(t[0].y-t[2].y)/(t[0].x-t[2].x),n=(t[1].y-t[3].y)/(t[1].x-t[3].x),i={x:0,y:0};var o,s,a;return i.x=function(e,t,r,n){return(r.y-n.y+t*n.x-e*r.x)/(t-e)}(r,n,t[0],t[1]),i.y=(o=t[0],s=r,a=i.x,s*(a-o.x)+o.y),{id:e,corners:t,center:i}},d.Detector=function(){this.grey=new o.Image,this.thres=new o.Image,this.homography=new o.Image,this.binary=[],this.contours=[],this.polys=[],this.candidates=[]},d.Detector.prototype.detect=function(e,t){return this.contours=o.findContours(e,this.binary),this.candidates=this.findCandidates(this.contours,e.width*u.MIN_MARKER_PERIMETER,e.width*u.MAX_MARKER_PERIMETER,.05,10),this.candidates=this.clockwiseCorners(this.candidates),this.candidates=this.notTooNear(this.candidates,u.MIN_MARKER_DISTANCE),this.findMarkers(t,this.candidates,u.SIZE_AFTER_PERSPECTIVE_REMOVAL)},d.Detector.prototype.findCandidates=function(e,t,r,n,i){var s,a,h,d=[],u=e.length;for(this.polys=[],h=0;h<u;++h)(s=e[h]).length>=t&&s.length<=r&&(a=o.approxPolyDP(s,s.length*n),this.polys.push(a),4===a.length&&o.isContourConvex(a)&&o.minEdgeLength(a)>=i&&d.push(a));return d},d.Detector.prototype.clockwiseCorners=function(e){var t,r,n,i,o,s=e.length;for(o=0;o<s;++o)t=e[o][1].x-e[o][0].x,n=e[o][1].y-e[o][0].y,r=e[o][2].x-e[o][0].x,t*(e[o][2].y-e[o][0].y)-n*r<0&&(i=e[o][1],e[o][1]=e[o][3],e[o][3]=i);return e},d.Detector.prototype.notTooNear=function(e,t){var r,n,i,s,a,h,d=[],u=e.length;for(s=0;s<u;++s)for(a=s+1;a<u;++a){for(r=0,h=0;h<4;++h)r+=(n=e[s][h].x-e[a][h].x)*n+(i=e[s][h].y-e[a][h].y)*i;r/4<t*t&&(o.perimeter(e[s])<o.perimeter(e[a])?e[s].tooNear=!0:e[a].tooNear=!0)}for(s=0;s<u;++s)e[s].tooNear||d.push(e[s]);return d},d.Detector.prototype.findMarkers=function(e,t,r){var n,i,s,a=[],h=t.length;for(s=0;s<h;++s)n=t[s],o.warp(e,this.homography,n,r),o.threshold(this.homography,this.homography,o.otsu(this.homography)),(i=this.getMarker(this.homography,n))&&a.push(i);return a},d.Detector.prototype.getMarker=function(e,t){var r,n,i,s,a,h=e.width/7>>>0,u=h*h>>1,c=[],l=[],x=[];for(s=0;s<7;++s)for(i=0===s||6===s?1:6,a=0;a<7;a+=i)if(r={x:a*h,y:s*h,width:h,height:h},o.countNonZero(e,r)>u)return null;for(s=0;s<5;++s)for(c[s]=[],a=0;a<5;++a)r={x:(a+1)*h,y:(s+1)*h,width:h,height:h},c[s][a]=o.countNonZero(e,r)>u?1:0;for(l[0]=c,x[0]=this.hammingDistance(l[0]),n={first:x[0],second:0},s=1;s<4;++s)l[s]=this.rotate(l[s-1]),x[s]=this.hammingDistance(l[s]),x[s]<n.first&&(n.first=x[s],n.second=s);return 0!==n.first?null:d.Marker(this.mat2id(l[n.second]),this.rotate2(t,4-n.second))},d.Detector.prototype.hammingDistance=function(e){var t,r,n,i,o,s=[[1,0,0,0,0],[1,0,1,1,1],[0,1,0,0,1],[0,1,1,1,0]],a=0;for(n=0;n<5;++n){for(r=1/0,i=0;i<4;++i){for(t=0,o=0;o<5;++o)t+=e[n][o]===s[i][o]?0:1;t<r&&(r=t)}a+=r}return a},d.Detector.prototype.mat2id=function(e){var t,r=0;for(t=0;t<5;++t)r<<=1,r|=e[t][1],r<<=1,r|=e[t][3];return r},d.Detector.prototype.rotate=function(e){var t,r,n=[],i=e.length;for(t=0;t<i;++t)for(n[t]=[],r=0;r<e[t].length;++r)n[t][r]=e[e[t].length-r-1][t];return n},d.Detector.prototype.rotate2=function(e,t){var r,n=[],i=e.length;for(r=0;r<i;++r)n[r]=e[(t+r)%i];return n};var c=d;var l=class{constructor(e,t){this.width=e,this.height=t,this.size=e*t,this.data=[],this.data.length=this.size}sampleFrom(e,t,r,n){for(let n=0;n<this.height;n++){for(let i=0;i<this.width;i++){let o=i+r;this.data[n*this.width+i]=e[4*(n*t+o)]}}}};new n.Filter("","\n  varying vec2 vTextureCoord;\n  uniform sampler2D uSampler;\n  void main(void)\n  {\n    // vec4 color = texture2D(uSampler, vTextureCoord);\n    // float thres = color.r > 0.6 ? 1.0 : 0.0;\n    // gl_FragColor = vec4(thres, thres, thres, 1.0);\n  }\n",{});const x=new n.Filter("","\n    varying vec2 vTextureCoord;\n    uniform sampler2D uSampler;\n    void main(void)\n    {\n      vec4 color = texture2D(uSampler, vTextureCoord);\n      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));\n      gl_FragColor = vec4(vec3(gray), 1.0);\n    }\n  ",{}),y=new n.Filter("","\n  varying vec2 vTextureCoord;\n  uniform sampler2D uSampler;  // Texture that will be blurred by this shader\n\n  uniform float blurSize;\n\n  void main() {\n    float blurDiv = (blurSize * 2.0 + 1.0) * (blurSize * 2.0 + 1.0);\n    float pixelX = 1.0 / 480.0;\n    float pixelY = 1.0 / 360.0;\n    float source = texture2D(uSampler, vTextureCoord).r;\n    float blurredVal = 0.0;\n\n    for (float x = 0.0; x <= 1000.0; x++) {\n      if (x > blurSize + blurSize) break;\n      float xCoord = x - blurSize;\n\n      for (float y = 0.0; y <= 1000.0; y++) {\n        if (y > blurSize + blurSize) break;\n\n        float yCoord = y - blurSize;\n        float neighbor = texture2D(uSampler, vec2(vTextureCoord.x + (pixelX * xCoord), vTextureCoord.y + (pixelY * yCoord))).r;\n        blurredVal += neighbor;\n      }\n    }\n\n    blurredVal = blurredVal / blurDiv;  \n    blurredVal = (source - blurredVal < -0.035) ? 1.0 : 0.0;\n    // blurredVal = texture2D(uSampler, vec2(vTextureCoord.x + (pixelX * 30.0), vTextureCoord.y + (pixelY * 30.0))).r;\n\n    gl_FragColor = vec4(blurredVal, blurredVal, blurredVal, 1.0);\n  }",{blurSize:2});class f{static sub(e,t){return new f(t.x-e.x,t.y-e.y)}static fromAngle(e){return new f(Math.cos(e),Math.sin(e))}static add(e,t){return new f(t.x+e.x,t.y+e.y)}static addScalar(e,t,r){const n=e.x+t.x*r,i=e.y+t.y*r;return new f(n,i)}static angleBetween(e,t){return Math.atan2(e.x*t.y-e.y*t.x,e.x*t.x+e.y*t.y)}static rotate(e,t){const r=e.x*Math.cos(t)-e.y*Math.sin(t),n=e.x*Math.sin(t)+e.y*Math.cos(t);return new f(r,n)}static scale(e,t){return new f(e.x*t,e.y*t)}static dist(e,t){return new f(t.x-e.x,t.y-e.y).mag()}static dist2(e,t){return new f(t.x-e.x,t.y-e.y).mag2()}static normalize(e){const t=e.mag();return new f(e.x/t,e.y/t)}static copy(e){return new f(e.x,e.y)}constructor(e,t){this.x=e,this.y=t}clone(){return new f(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}set(e,t){return this.x=e,this.y=t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}scale(e){return this.x*=e,this.y*=e,this}mag(){return Math.sqrt(this.x*this.x+this.y*this.y)}mag2(){return this.x*this.x+this.y*this.y}dist(e){return f.sub(this,e).mag()}dist2(e){return f.sub(this,e).mag2()}normalize(){const e=this.mag();return this.x/=e,this.y/=e,this}getAngle(){return Math.atan2(this.y,this.x)}rotate(e){const t=this.x*Math.cos(e)-this.y*Math.sin(e),r=this.x*Math.sin(e)+this.y*Math.cos(e);return this.x=t,this.y=r,this}dot(e){return this.x*e.x+this.y*e.y}}var p=class{constructor(e){this.timeout=.05,this.timestamp=this.timeout,this.present=!1,this.center={x:0,y:0},this.corners=[],this.rotation=0,this.id=e}update(e){this.timestamp=0,this.present=!0,this.center=e.center,this.corners=e.corners.map(e=>e),this.rotation=f.angleBetween(f.sub(this.corners[0],this.corners[1]),new f(1,0))}updatePresence(e){this.timestamp+=e,this.present=!(this.timestamp>=this.timeout)}},g=r(0);var m=class{constructor(e,t){this.markerA=e,this.markerB=t}get isPresent(){return this.markerA.present&&this.markerB.present}get angleBetween(){return this.markerA.rotation-this.markerB.rotation}get distance(){return f.sub(this.markerA.center,this.markerB.center).mag()}getRelativePosition(e){if(this.isPresent()){const t=[{x:-e/2,y:-e/2},{x:e/2,y:-e/2},{x:e/2,y:e/2},{x:-e/2,y:e/2}],r=function(e,t,r,n,i,o,s,a){const h=g.matrix([[i.x,i.y,1,0,0,0,-e.x*i.x,-e.x*i.y],[0,0,0,i.x,i.y,1,-e.y*i.x,-e.y*i.y],[o.x,o.y,1,0,0,0,-t.x*o.x,-t.x*o.y],[0,0,0,o.x,o.y,1,-t.y*o.x,-t.y*o.y],[s.x,s.y,1,0,0,0,-r.x*s.x,-r.x*s.y],[0,0,0,s.x,s.y,1,-r.y*s.x,-r.y*s.y],[a.x,a.y,1,0,0,0,-n.x*a.x,-n.x*a.y],[0,0,0,a.x,a.y,1,-n.y*a.x,-n.y*a.y]]),d=g.matrix([[e.x],[e.y],[t.x],[t.y],[r.x],[r.y],[n.x],[n.y]]),u=g.lusolve(h,d);return g.matrix([[g.subset(u,g.index(0,0)),g.subset(u,g.index(1,0)),g.subset(u,g.index(2,0))],[g.subset(u,g.index(3,0)),g.subset(u,g.index(4,0)),g.subset(u,g.index(5,0))],[g.subset(u,g.index(6,0)),g.subset(u,g.index(7,0)),1]])}(this.markerA.corners[0],this.markerA.corners[1],this.markerA.corners[2],this.markerA.corners[3],t[0],t[1],t[2],t[3]),n=g.inv(r),i=e=>function(e,t){const r=g.matrix([[t.x],[t.y],[1]]),n=g.multiply(e,r);return{x:g.subset(n,g.index(0,0))/g.subset(n,g.index(2,0)),y:g.subset(n,g.index(1,0))/g.subset(n,g.index(2,0))}}(n,e),o=i(this.markerA.center),s=i(this.markerB.center),a=i(this.markerA.corners[0]),h=i(this.markerA.corners[1]),d=i(this.markerB.corners[0]),u=i(this.markerB.corners[1]),c=vecSub(o,s),l=vecSub(a,h);return{distance:vecMag(c),heading:vecAngleBetween(l,c),rotation:vecAngleBetween(l,vecSub(d,u))}}return{distance:void 0,heading:void 0,rotation:void 0}}};let b,v,w,_,M,E,D,S=!1;let k,C;const P=[];for(let e=0;e<100;e++)P.push(new p(e));const T=()=>{_=document.createElement("div"),_.id="beholder-container",_.style="\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    left: 0;\n    top: 0;\n    width: 100vw;\n    z-index: 10;\n    display: none;\n  ",document.body.appendChild(_),b=document.createElement("video"),b.autoplay="true",b.style="display:none;",_.appendChild(b),M=document.createElement("canvas"),M.id="pixi-container",M.style="\n    position: absolute;\n    left: 0;\n    top: 0;\n  ",_.appendChild(M),void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(e){var t=navigator.webkitGetUserMedia||navigator.mozGetUserMedia;return t?new Promise((function(r,n){t.call(navigator,e,r,n)})):Promise.reject(new Error("getUserMedia is not implemented in this browser"))});let e="WebGL";n.utils.isWebGLSupported()||(e="canvas"),D=new n.Application({width:1280,height:480,antialias:!1,transparent:!1,resolution:1,view:M,autoStart:!1});var t=n.Texture.from(b),r=n.Texture.from(b);k=new n.Sprite(t),C=new n.Sprite(r),k.width=640,k.height=480,C.width=640,C.height=480,k.filters=[x,y],C.filters=[x],D.stage.addChild(k),k.position.x=640,D.stage.addChild(C),E=new n.Graphics,D.stage.addChild(E),navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:"environment"}}).then((function(e){"srcObject"in b?b.srcObject=e:b.src=window.URL.createObjectURL(e),w=new c.Detector,S=!0})).catch((function(e){console.log(e.name+": "+e.message)}))};let j=!1;const A=()=>{j=!0,_.style="\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    left: 0;\n    top: 0;\n    width: 100vw;\n    z-index: 10;\n    display: block;\n  "},R=()=>{j=!1,_.style="\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    left: 0;\n    top: 0;\n    width: 100vw;\n    z-index: 10;\n    display: none;\n  "};let O=new l(640,480),I=new l(640,480);const z=()=>P,B=e=>{if(!(e>P.length))return P[e]},F=(e,t)=>{new m(P[e],P[t])};let N=Date.now();const V=()=>{if(!S)return;const e=Date.now(),t=(e-N)/1e3;N=e,((e,t)=>{t.forEach(e=>{e.id<P.length&&P[e.id].update(e)}),P.forEach(t=>t.updatePresence(e))})(t,(D.render(),v=D.renderer.plugins.extract.pixels(D.stage),O.sampleFrom(v,1280,640,0),I.sampleFrom(v,1280,0,0),w.detect(O,I))),j&&(E.clear(),P.forEach(e=>{if(!e.present)return;E.endFill();const t=e.center,r=e.corners;e.rotation;E.lineStyle(3,16711850),E.moveTo(r[0].x,r[0].y),E.lineTo(r[1].x,r[1].y),E.lineTo(r[2].x,r[2].y),E.lineTo(r[3].x,r[3].y),E.lineTo(r[0].x,r[0].y),E.drawRect(t.x-1,t.y-1,2,2),E.lineStyle(3,170),E.drawRect(r[0].x-2,r[0].y-2,4,4)}))};t.default={init:T,update:V,getMarker:B,getAllMarkers:z,show:A,hide:R}}])}));