webpackJsonp([1],{0:function(n,t,e){n.exports=e("cDNt")},Z2Gu:function(n,t){AFRAME.registerComponent("sphere-shader",{schema:{color:{type:"color"}},init:function(){var n=this;this.material=new THREE.ShaderMaterial({uniforms:{time:{value:0},color:{value:new THREE.Color(this.data.color)},brightness:{value:1.1},scale:{value:1},speed:{value:1}},vertexShader:"\nprecision highp float;\nprecision highp int;\n\nuniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\n\nuniform vec3 cameraPosition;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n\nuniform float speed;\nuniform float time;\nuniform float scale;\n\nvarying vec3 vTexCoord3D;\nvarying vec3 vNormal;\nvarying vec3 vViewPosition;\nvarying vec3 vPosition;\n\nvoid main( void ) {\n\n  vPosition = position;\n\tvec4 mPosition = modelMatrix * vec4( position, 1.0 );\n\tvNormal = normalize( normalMatrix * normal );\n\tvViewPosition = cameraPosition - mPosition.xyz;\n\n\tvTexCoord3D = scale * ( position.xyz + cameraPosition * 0.1 * time );\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n".replace(/uniform (mat4|mat3|vec3) (modelMatrix|modelViewMatrix|projectionMatrix|viewMatrix|normalMatrix|cameraPosition);/g,"").replace(/attribute (vec[32]) (position|normal|uv);/g,""),fragmentShader:"\n// Adapted from http://alteredqualia.com/three/examples/webgl_shader_fireball.html\nprecision highp float;\nprecision highp int;\n\n//\n// Description : Array and textureless GLSL 3D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110409 (stegu)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//\n\nuniform float time;\nuniform mat4 viewMatrix;\nuniform float brightness;\n\nvarying vec3 vTexCoord3D;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\nuniform vec3 cameraPosition;\nuniform vec3 color;\n\nvec4 permute( vec4 x ) {\n\n\treturn mod( ( ( x * 34.0 ) + 1.0 ) * x, 289.0 );\n\n}\n\nvec4 taylorInvSqrt( vec4 r ) {\n\n\treturn 1.79284291400159 - 0.85373472095314 * r;\n\n}\n\nfloat snoise( vec3 v ) {\n\n\tconst vec2 C = vec2( 1.0 / 6.0, 1.0 / 3.0 );\n\tconst vec4 D = vec4( 0.0, 0.5, 1.0, 2.0 );\n\n\t// First corner\n\n\tvec3 i  = floor( v + dot( v, C.yyy ) );\n\tvec3 x0 = v - i + dot( i, C.xxx );\n\n\t// Other corners\n\n\tvec3 g = step( x0.yzx, x0.xyz );\n\tvec3 l = 1.0 - g;\n\tvec3 i1 = min( g.xyz, l.zxy );\n\tvec3 i2 = max( g.xyz, l.zxy );\n\n\t//  x0 = x0 - 0. + 0.0 * C\n\tvec3 x1 = x0 - i1 + 1.0 * C.xxx;\n\tvec3 x2 = x0 - i2 + 2.0 * C.xxx;\n\tvec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n\t// Permutations\n\n\ti = mod( i, 289.0 );\n\tvec4 p = permute( permute( permute(\n\t\t\t i.z + vec4( 0.0, i1.z, i2.z, 1.0 ) )\n\t\t   + i.y + vec4( 0.0, i1.y, i2.y, 1.0 ) )\n\t\t   + i.x + vec4( 0.0, i1.x, i2.x, 1.0 ) );\n\n\t// Gradients\n\t// ( N*N points uniformly over a square, mapped onto an octahedron.)\n\n\tfloat n_ = 1.0 / 7.0; // N=7\n\n\tvec3 ns = n_ * D.wyz - D.xzx;\n\n\tvec4 j = p - 49.0 * floor( p * ns.z *ns.z );  //  mod(p,N*N)\n\n\tvec4 x_ = floor( j * ns.z );\n\tvec4 y_ = floor( j - 7.0 * x_ );    // mod(j,N)\n\n\tvec4 x = x_ *ns.x + ns.yyyy;\n\tvec4 y = y_ *ns.x + ns.yyyy;\n\tvec4 h = 1.0 - abs( x ) - abs( y );\n\n\tvec4 b0 = vec4( x.xy, y.xy );\n\tvec4 b1 = vec4( x.zw, y.zw );\n\n\tvec4 s0 = floor( b0 ) * 2.0 + 1.0;\n\tvec4 s1 = floor( b1 ) * 2.0 + 1.0;\n\tvec4 sh = -step( h, vec4( 0.0 ) );\n\n\tvec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n\tvec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n\tvec3 p0 = vec3( a0.xy, h.x );\n\tvec3 p1 = vec3( a0.zw, h.y );\n\tvec3 p2 = vec3( a1.xy, h.z );\n\tvec3 p3 = vec3( a1.zw, h.w );\n\n\t// Normalise gradients\n\n\tvec4 norm = taylorInvSqrt( vec4( dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3) ) );\n\tp0 *= norm.x;\n\tp1 *= norm.y;\n\tp2 *= norm.z;\n\tp3 *= norm.w;\n\n\t// Mix final noise value\n\n\tvec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3) ), 0.0 );\n\tm = m * m;\n\treturn 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n\t\t\t\t\t\t\t\tdot(p2,x2), dot(p3,x3) ) );\n\n}\n\nfloat heightMap( vec3 coord ) {\n\n\tfloat n = abs( snoise( coord ) );\n\n\tn += 0.25   * abs( snoise( coord * 2.0 ) );\n\tn += 0.25   * abs( snoise( coord * 4.0 ) );\n\tn += 0.125  * abs( snoise( coord * 8.0 ) );\n\tn += 0.0625 * abs( snoise( coord * 16.0 ) );\n\n\treturn n;\n\n}\n\nvoid main( void ) {\n\n\t// height\n\n\tfloat n = heightMap( vTexCoord3D );\n\n\t// color\n\n\tvec3 baseColor = color * 1.2 - n;\n\n\t// normal\n\n\tconst float e = 0.001;\n\n\tfloat nx = heightMap( vTexCoord3D + vec3( e, 0.0, 0.0 ) );\n\tfloat ny = heightMap( vTexCoord3D + vec3( 0.0, e, 0.0 ) );\n\tfloat nz = heightMap( vTexCoord3D + vec3( 0.0, 0.0, e ) );\n\n\tvec3 normal = normalize( vNormal + 0.05 * vec3( n - nx, n - ny, n - nz ) / e );\n\n\t// diffuse light\n\n\tvec3 vLightWeighting = vec3( 0.1 );\n\n\tvec4 lDirection = viewMatrix * vec4( normalize( cameraPosition ), 0.0 );\n\tfloat directionalLightWeighting = dot( normal, normalize( lDirection.xyz ) ) * 0.25 + 0.75;\n\tvLightWeighting += vec3( brightness ) * directionalLightWeighting;\n\n\tgl_FragColor = vec4( baseColor * vLightWeighting, 1.0 );\n}\n".replace(/uniform (mat4|vec3) (viewMatrix|cameraPosition);/g,"")}),this.applyToMesh(),this.el.addEventListener("model-loaded",function(){return n.applyToMesh()})},update:function(){this.material.uniforms.color.value.set(this.data.color)},applyToMesh:function(){var n=this.el.getObject3D("mesh");n&&(n.material=this.material)},tick:function(n){this.material.uniforms.time.value=n/1e3}})},cDNt:function(n,t,e){"use strict";function l(n){return M._17(0,[(n()(),M._4(0,null,null,0,"a-box",[["depth","20"],["height","0.1"],["width","0.2"]],[[1,"color",0],[1,"position",0]],null,null,null,null))],null,function(n,t){var e=t.component;n(t,0,0,t.context.$implicit,e.getPosition(t.context.index))})}function i(n){return M._17(0,[(n()(),M._4(0,null,null,8,"a-entity",[["position","0 0 -20"]],null,null,null,null,null)),(n()(),M._16(null,["\n    "])),(n()(),M._4(0,null,null,1,"a-sphere",[["radius","0.5"]],[[1,"position",0],[1,"color",0],[1,"sphere-shader",0]],null,null,null,null)),(n()(),M._16(null,["\n    "])),(n()(),M._16(null,["\n    "])),(n()(),M._4(0,null,null,0,"a-animation",[["attribute","position"],["dur","2500"],["easing","linear"],["to","0 0 0"]],null,null,null,null,null)),(n()(),M._16(null,["\n    "])),(n()(),M._4(0,null,null,0,"a-animation",[["attribute","position"],["begin","2500"],["dur","3000"],["from","0 0 0"],["to","0 999 0"]],null,[[null,"animationend"]],function(n,t,e){var l=!0,i=n.component;if("animationend"===t){l=!1!==i.removeSphere(n.context.$implicit)&&l}return l},null,null)),(n()(),M._16(null,["\n  "]))],null,function(n,t){n(t,2,0,t.context.$implicit.position,t.context.$implicit.color,"color: "+t.context.$implicit.color)})}function o(n){return M._17(0,[(n()(),M._4(0,null,null,1,"button",[],null,[[null,"click"]],function(n,t,e){var l=!0,i=n.component;if("click"===t){l=!1!==i.clicks.next()&&l}return l},null,null)),(n()(),M._16(null,["Drop"])),(n()(),M._16(null,["\n"])),(n()(),M._4(0,null,null,29,"a-scene",[],null,null,null,null,null)),(n()(),M._16(null,["\n  "])),(n()(),M._4(0,null,null,0,"a-entity",[["environment",""]],null,null,null,null,null)),(n()(),M._16(null,["\n  "])),(n()(),M._4(0,null,null,0,"a-entity",[["light","type:ambient; color:#bbb"]],null,null,null,null,null)),(n()(),M._16(null,["\n  "])),(n()(),M._4(0,null,null,3,"a-entity",[["id","shadow_light"],["light","type:directional; color:#333; intensity:1; castShadow:true; target:#shadow_target"],["position","1.5 4 4"]],null,null,null,null,null)),(n()(),M._16(null,["\n    "])),(n()(),M._4(0,null,null,0,"a-entity",[["id","shadow_target"],["position","0 -4 0"]],null,null,null,null,null)),(n()(),M._16(null,["\n  "])),(n()(),M._16(null,["\n\n  "])),(n()(),M.Y(16777216,null,null,1,null,l)),M._2(802816,null,0,C.c,[M.N,M.K,M.t],{ngForOf:[0,"ngForOf"]},null),(n()(),M._16(null,["\n\n  "])),(n()(),M.Y(16777216,null,null,1,null,i)),M._2(802816,null,0,C.c,[M.N,M.K,M.t],{ngForOf:[0,"ngForOf"]},null),(n()(),M._16(null,["\n\n  "])),(n()(),M._4(0,null,null,11,"a-camera",[["id","cam"],["position","1.5 0 4"],["rotation","0 0 0"]],null,null,null,null,null)),(n()(),M._16(null,["\n    "])),(n()(),M._4(0,null,null,3,"a-entity",[["id","spec_1"],["light","type:directional; color:#ffc; intensity:0.3; target:#spec_1_target"],["position","2 2 0"]],null,null,null,null,null)),(n()(),M._16(null,["\n      "])),(n()(),M._4(0,null,null,0,"a-entity",[["id","spec_1_target"],["position","-2 -2 0"]],null,null,null,null,null)),(n()(),M._16(null,["\n    "])),(n()(),M._16(null,["\n    "])),(n()(),M._4(0,null,null,3,"a-entity",[["id","spec_2"],["light","type:directional; color:#cff; intensity:0.3; target:#spec_2_target"],["position","-2 2 0"]],null,null,null,null,null)),(n()(),M._16(null,["\n      "])),(n()(),M._4(0,null,null,0,"a-entity",[["id","spec_2_target"],["position","2 -2 0"]],null,null,null,null,null)),(n()(),M._16(null,["\n    "])),(n()(),M._16(null,["\n  "])),(n()(),M._16(null,["\n"])),(n()(),M._16(null,["\n"]))],function(n,t){var e=t.component;n(t,15,0,e.lines),n(t,18,0,e.spheres)},null)}function r(n){return M._17(0,[(n()(),M._4(0,null,null,1,"app-root",[],null,null,null,o,D)),M._2(114688,null,0,w,[d],null,null)],function(n,t){n(t,1,0)},null)}Object.defineProperty(t,"__esModule",{value:!0});var u={production:!0},a=function(){function n(){}return n}(),c=e("rlar"),s=(e.n(c),e("HHMy")),v=(e.n(s),e("bdO8")),p=(e.n(v),e("0yuy")),m=(e.n(p),e("5v8a")),h=(e.n(m),{apiKey:"AIzaSyAeef6ppzfZI3kLGiUkXPrE2sBGeyochnY",authDomain:"vr-hero-app.firebaseapp.com",databaseURL:"https://vr-hero-app.firebaseio.com",projectId:"vr-hero-app",messagingSenderId:"729035450276"}),d=function(){function n(){var n=this;this.users$=new c.Subject,s.initializeApp(h),this.db=s.firestore();var t=new c.Subject;this.users=this.db.collection("users"),this.users.onSnapshot(t),t.map(function(n){return n.docs.map(function(n){return n.data()})}).subscribe(this.users$),s.auth().signInAnonymously(),s.auth().onAuthStateChanged(function(t){n.user=n.users.doc(s.auth().currentUser.uid),n.user.set({lastSeen:s.firestore.FieldValue.serverTimestamp(),color:"red"},{merge:!0})})}return n.ctorParameters=function(){return[]},n}(),x=e("rlar"),f=(e.n(x),e("bKpL")),_=(e.n(f),e("ACG2")),y=(e.n(_),e("JNTq")),g=(e.n(y),e("Pic8")),b=(e.n(g),e("Z2Gu")),w=(e.n(b),function(){function n(n){this.datastore=n,this.clicks=new x.Subject,this.lines=["red","pink","orange","green","blue","purple"],this.spheres=[]}return n.prototype.ngOnInit=function(){var n=this,t=f.Observable.interval(500).switchMap(function(n){return f.Observable.interval(600*Math.random()+100)});f.Observable.merge(t,this.clicks).subscribe(function(t){var e=Math.floor(6*Math.random()),l=n.lines[e];n.spheres.push({color:l,position:e-2+" 0.5 0"})})},n.prototype.getPosition=function(n){return n-2+" 0 -10"},n.prototype.removeSphere=function(n){this.spheres=this.spheres.filter(function(t){return t!==n})},n.ctorParameters=function(){return[{type:d}]},n}()),z=[""],M=e("/oeL"),C=e("qbdv"),P=[z],D=M._1({encapsulation:0,styles:P,data:{}}),L=M.Z("app-root",w,r,{},{},[]),S=e("/oeL"),j=e("qbdv"),N=e("fc+i"),A=S._0(a,[w],function(n){return S._13([S._14(512,S.i,S.W,[[8,[L]],[3,S.i],S.x]),S._14(5120,S.v,S._12,[[3,S.v]]),S._14(4608,j.e,j.d,[S.v]),S._14(4608,S.h,S.h,[]),S._14(5120,S.a,S._5,[]),S._14(5120,S.t,S._10,[]),S._14(5120,S.u,S._11,[]),S._14(4608,N.b,N.s,[j.b]),S._14(6144,S.H,null,[N.b]),S._14(4608,N.e,N.f,[]),S._14(5120,N.c,function(n,t,e,l){return[new N.k(n),new N.o(t),new N.n(e,l)]},[j.b,j.b,j.b,N.e]),S._14(4608,N.d,N.d,[N.c,S.z]),S._14(135680,N.m,N.m,[j.b]),S._14(4608,N.l,N.l,[N.d,N.m]),S._14(6144,S.F,null,[N.l]),S._14(6144,N.p,null,[N.m]),S._14(4608,S.L,S.L,[S.z]),S._14(4608,N.g,N.g,[j.b]),S._14(4608,N.i,N.i,[j.b]),S._14(4608,d,d,[]),S._14(512,j.a,j.a,[]),S._14(1024,S.l,N.q,[]),S._14(1024,S.b,function(n,t){return[N.r(n,t)]},[[2,N.h],[2,S.y]]),S._14(512,S.c,S.c,[[2,S.b]]),S._14(131584,S._3,S._3,[S.z,S.X,S.r,S.l,S.i,S.c]),S._14(2048,S.e,null,[S._3]),S._14(512,S.d,S.d,[S.e]),S._14(512,N.a,N.a,[[3,N.a]]),S._14(512,a,a,[])])}),T=e("/oeL"),O=e("fc+i");u.production&&Object(T.R)(),Object(O.j)().bootstrapModuleFactory(A)},gFIY:function(n,t){function e(n){return new Promise(function(t,e){e(new Error("Cannot find module '"+n+"'."))})}e.keys=function(){return[]},e.resolve=e,n.exports=e,e.id="gFIY"}},[0]);