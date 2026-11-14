
(async()=>{
 const root=document.getElementById('l15-spatial-build');let D;
 try{const response=await fetch('../assets/level-15-data.json?v=20261114-operations');if(!response.ok)throw Error('data');D=await response.json();}catch(e){document.querySelector('[data-loading]').textContent='模型資料載入失敗，請重新整理後再試。';return;}
 const canvas=root.querySelector('[data-gl]'),labels=root.querySelector('[data-labels]'),lc=labels.getContext('2d'),gl=canvas.getContext('webgl',{antialias:true,alpha:true});
 async function unzip64(s){const bytes=Uint8Array.from(atob(s),c=>c.charCodeAt(0));return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();}
 async function unpack(m){if(!m.p)return m;const[a,b,c]=await Promise.all([unzip64(m.p),unzip64(m.i),unzip64(m.n)]);const vs=new Int16Array(a),ix=m.it===4?new Uint32Array(b):new Uint16Array(b),ns=new Int8Array(c);m.v=Array.from({length:m.vc},(_,i)=>[vs[i*3]/100,vs[i*3+1]/100,vs[i*3+2]/100]);m.f=Array.from({length:m.tc},(_,i)=>[ix[i*3],ix[i*3+1],ix[i*3+2]]);m.n=Array.from({length:m.vc},(_,i)=>[ns[i*3]/127,ns[i*3+1]/127,ns[i*3+2]/127]);return m;}
 try{await Promise.all([D.band,D.capMesh,D.loft2.mesh,D.loft3.mesh,...Object.values(D.historyMeshes),...Object.values(D.finishMeshes).flat(),...Object.values(D.detailMeshes)].map(unpack));}catch(e){document.querySelector('[data-loading]').textContent='3D資料載入失敗，請重新整理後再試。';return;}
 if(!gl){document.querySelector('[data-loading]').textContent='此裝置無法顯示 WebGL 三維畫面，請使用支援 3D 的瀏覽器。';return;}
 const storageKey='simon-l15-modeling-v1';
 function readState(){try{return JSON.parse(localStorage.getItem(storageKey)||'null');}catch(e){return null;}}
 function saveState(value){try{localStorage.setItem(storageKey,JSON.stringify(value));}catch(e){}return Promise.resolve();}
 const steps=[
 ['尺寸基準','先建立長、寬、高的定位範圍，後面的曲線才有位置依據。','原檔尺寸基準 99 × 60 × 39 mm'],
 ['底視定位點','先看輪廓的重要位置，再看曲線如何通過這些點。','原始「正底-曲線」擬合曲線的通過點'],
 ['底視輪廓','兩條輪廓安排不同區域的寬窄，端點會成為後續銜接的依據。','原始底視曲線；保留半側建構'],
 ['側視輪廓','加入高度方向；寬窄與高低需要在同一個空間裡互相對照。','原始「正側」擬合曲線'],
 ['上視輪廓','換一個方向確認位置，不是完成一個視圖就獨立決定整個造型。','原始「正上」擬合曲線'],
 ['滾輪位置','滾輪草圖在主要放樣前已安排，功能位置與外形一起規劃。','原始滾輪草圖，置於原 YZ 草圖平面'],
 ['交叉投影：得到空間曲線','將不同視圖的輪廓作交叉投影：同時保留平面上的寬窄與側面的高低，產生這條空間曲線。','交叉投影結果作為建面導軌；不是另畫一條自由曲線'],
 ['前後端截面','先看這片面在前後兩端，如何接到上下兩條輪廓。','放樣1 的兩個端部截面；其餘截面接著加入'],
 ['後側截面','加入後側弧度，讓前後端之間有更明確的形狀依據。','後側截面：原檔實際世界座標'],
 ['中間截面','中間截面的兩端前後位置不同，不能把它攤平成同一個 Y 位置。','原始中間投影線；端點約 Y58 與 Y56.5 mm'],
 ['前側截面','加入前側截面，補充曲面在這個區域應維持的弧度。','前側截面：原檔實際世界座標'],
 ['前側第二截面','靠近端部再補一個截面，讓這一區的過渡也有依據。','前側第二截面：原檔實際世界座標'],
 ['確認這次的建面輸入','六個截面安排沿途形狀，兩條導軌限制上下邊界。','原檔放樣1：6截面＋2導軌；可旋轉查看它們的關係'],
 ['形成第一片曲面','線不再只是外觀輪廓：它們一起限定了這片帶狀面的範圍與弧度。','原檔放樣1當時的曲面；尚未加厚'],
 ['第二組：截面與導軌從哪裡來','前後端取自「正側」，沿途加入後側建構線、中間投影線與前側建構線，共五個截面；上下導軌取自交叉投影。','截面端點接在上下導軌上：導軌定邊界，截面定沿途弧度'],
 ['第二片：形成側面帶','沿著這組截面與邊界，讓側面帶逐步接上前面的過渡帶。','原檔放樣2當時的曲面；尚未鏡射'],
 ['第三組：底部兩條輪廓','底部銜接使用兩個輪廓路徑，這次沒有導軌。','原檔放樣3：2截面，無導軌'],
 ['第三片：底部銜接','把底部輪廓之間的範圍補起來，讓側壁接向底部。','原檔放樣3當時的曲面；尚未鏡射'],
 ['上蓋：左右邊界','左右邊界圍出上蓋的範圍；先看清楚要填的是哪一區。','原始上蓋面片輸入：2條邊界'],
 ['上蓋：中央拱線','加入中央拱線，讓上蓋的隆起也有明確的形狀依據。','原始中央導線；不是第三條橫向截面'],
 ['建立上蓋','邊界與拱線共同參與建面，從線架走到可辨識的滑鼠造型。','原檔曲面面片2：尚未切除與加入按鍵曲面'],
 ['按鍵輪廓：投影到上蓋','把平面上的按鍵輪廓沿 Z 方向投影到上蓋，得到貼在曲面上的裁切邊界。','原始按鍵投影曲線；此段改採先裁切再鋪面的教學順序'],
 ['中間定位：畫截面弧線','由輪廓端點對照中間位置，畫出控制下凹弧度的截面線。','原檔 R500 截面弧；定位點用來說明截面位置'],
 ['截面線：取得內部導線','把截面弧線形成輔助面，再取得凹面內部的空間導線。','外圈限制邊界，內部導線限制下凹形狀'],
 ['先裁切：形成兩個按鍵孔','沿投影到上蓋的輪廓裁切，先拿掉原上蓋的兩個區域。','顯示原檔裁切結果；此處尚未填入按鍵曲面'],
 ['再鋪面：建立單側下凹面','用開口邊界與內部導線鋪出下凹面，觀察它如何接回上蓋。','原檔單側按鍵面；教學次序先裁切、後鋪面'],
 ['鏡射按鍵曲面','將完成的單側下凹面鏡射，補齊另一側按鍵開口。','左右按鍵面完成，接著回到側面與整體組合'],
 ['鏡射三片側面','把同一側的三組放樣曲面一起鏡射，得到另一側的對應曲面。','原檔38：鏡像1，輸入為放樣1、2、3的結果'],
 ['縫合上蓋與按鍵','把裁切後的上蓋，和左右兩片按鍵曲面縫合為同一組。','原檔39：曲面縫合3；幾何位置保留，改變的是接合關係'],
 ['補上底部面片','補上由四條邊界圍出的底部區域，準備接合側面。','原檔40：曲面面片3，沒有內部導線'],
 ['縫合側壁與底部','左右側壁、底部銜接與底部面片合成另一組曲面。','原檔41：曲面縫合1，共五個輸入曲面體'],
 ['縫合左右過渡帶','左右過渡帶另外縫合成一組，與上蓋、側壁分組處理。','原檔42：曲面縫合2；接著進入分件與厚度'],
 ['電池蓋分件：建立工具面','從側面看電池蓋輪廓：先拉伸成工具面，再延伸到足以穿過待分割的區域，讓後續分件有切分依據。','原檔43–44：拉伸17、曲面延伸5；這是分件工具面，不是新增外殼'],
 ['分件與側壁厚度：流程位置','原檔先完成實體準備、偏移、分割與抽殼，才輪到上蓋厚度及中央開孔。','原檔45–52概覽；此步保留曲面外形，未逐項演示內部加工'],
 ['曲面偏移：形成上蓋厚度','保留外表面，向內偏移 1.50 mm，再連接邊緣形成有厚度的上蓋。','偏移中間影格為示意；最後顯示原檔加厚1的結果'],
 ['中央滾輪孔：切除輪廓','使用上按鍵輪廓中的中央封閉區域，往上拉伸作切除；不是把滾輪圓形直接投影。','原檔54：拉伸12；中央輪廓與前端分縫，55mm切除'],
 ['切出滾輪孔與前端分縫','中央孔現在真正穿過上蓋；左右凹面保留，前端按鍵分縫也一起形成。','原檔54的實際裁切結果；未放入滾輪，方便看清開孔'],
 ['整理前端按鍵區域','接著從側面輪廓切除上蓋的局部區域；比較前後結果，觀察切除範圍。','原檔55：拉伸13，正側輪廓，40mm切除'],
 ['底部：淺切除','只保留底蓋，選取加工輪廓，再沿厚度方向切除 0.15 mm。','原檔56：拉伸14；可切到底視或自由旋轉'],
 ['底部：加入材料','用另一組底部輪廓加入材料，局部結構會接著影響下一次切除。','原檔57：拉伸15，Join加料，-0.2mm方向設定'],
 ['底部：繼續局部切除','依底部造型輪廓再切除局部區域，建立不同深度的底部細節。','原檔58：拉伸16，3mm切除'],
 ['底部：切到指定面','先看底部輪廓與內側終止面，再沿厚度方向切除，直到指定面停止。','原檔拉伸18：以面作為終止條件；只顯示底蓋'],
 ['分出電池蓋','用電池蓋輪廓作對稱切除，結果分成底蓋與電池蓋兩個實體。','原檔60：拉伸19；兩個實際結果都保留在場景'],
 ['建立滾輪基本體','回到前面已定位的滾輪草圖，以對稱拉伸建立基本體，對照它與中央孔的位置。','原檔61：拉伸20，滾輪草圖，NewBody'],
 ['建立旋轉軸','用輪軸方向作為後續圓周陣列的基準，重複的細節才會繞著正確的位置排列。','原檔62：軸1；軸心Y23、Z17.5mm，方向沿X'],
 ['滾輪：先處理主要圓角','先把滾輪的主要邊緣做圓角，基本體的斷面形狀也隨之改變。','原檔63：圓角11，R3mm'],
 ['滾輪：局部切除','先處理一處局部切除，之後才把相關細節繞軸重複。','原檔64：拉伸21，滾輪草圖，2.30mm對稱設定'],
 ['滾輪：細部圓角','在重複之前，先處理局部的R0.5圓角，讓這個細節以相同條件被複製。','原檔65：圓角13，R0.5mm'],
 ['滾輪：圓周陣列','繞前面建立的軸重複細節，從一處局部造型形成一整圈的滾輪紋理。','原檔66：C-陣列1，36個、360度'],
 ['底部邊緣倒角','滾輪完成後，原檔繼續處理底部邊緣；旋轉到底視比較倒角前後。','原檔67：倒角1，0.5mm；不是滾輪倒角'],
 ['最後的圓角收尾','原檔接著以十個圓角操作處理收尾；這一步合併比較它們完成後的整體造型。','原檔68–77合併展示；非十個操作逐項播放'],
 ['從點、線、面到完整滑鼠','模型完成後，切換爆炸圖查看五個零件；選取零件並旋轉，檢查厚度、開孔與彼此的接合位置。','原檔完成模型五個可見實體；組合與爆炸圖皆可自由旋轉']
 ];
 let S={step:0,yaw:Math.PI*.75,pitch:Math.PI/4,zoom:1},playing=false,playAll=false,progress=1,anim=0,timer=0,last=0,drag=null,w=0,h=0,dpr=1;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,probe=document.createElement('span');probe.hidden=true;root.append(probe);
 function rgb(token){probe.style.color='var('+token+')';let s=getComputedStyle(probe).color,nums=s.match(/[\d.]+/g)||[];return nums.slice(0,3).map(Number).map(x=>x/255);}
 function palette(){return{fg:rgb('--foreground'),muted:rgb('--muted-foreground'),line:rgb('--viz-series-1'),section:rgb('--viz-series-2'),grid:rgb('--border')};}
 const vs='attribute vec3 aPos;attribute vec3 aNormal;attribute vec2 aOffset;uniform vec4 uCamera;uniform vec2 uScreen;uniform float uZoom;uniform vec3 uColor;uniform vec3 uShift;uniform float uNormalOffset;uniform vec3 uSweepAxis;uniform float uSweep;varying vec3 vWorld;uniform float uLit;varying vec3 vColor;void main(){vec3 world=aPos+normalize(aNormal+vec3(.00001))*uNormalOffset;world+=uSweepAxis*(uSweep-1.)*dot(world,uSweepAxis);world+=uShift;vWorld=world;vec3 q=world-vec3(0.,49.5,19.5);float ca=uCamera.x,sa=uCamera.y,cp=uCamera.z,sp=uCamera.w;float xx=q.x*ca-q.y*sa,dd=q.x*sa+q.y*ca;float yy=q.z*cp-dd*sp,zz=dd*cp+q.z*sp;float sc=min(uScreen.x,uScreen.y)/125.*uZoom;gl_PointSize=6.;gl_Position=vec4(xx*2.*sc/uScreen.x,yy*2.*sc/uScreen.y,-zz/160.,1.);gl_Position.xy+=aOffset*vec2(2./uScreen.x,2./uScreen.y);vec3 n=normalize(aNormal+vec3(.00001));float lighting=.30+.63*abs(dot(n,normalize(vec3(-.35,-.5,1.))));vColor=uColor*mix(1.,lighting,uLit);}';
 const fs='precision mediump float;varying vec3 vColor;varying vec3 vWorld;uniform vec4 uClip;uniform float uClipSide;uniform float uAlpha;void main(){if(uClipSide*(dot(vWorld,uClip.xyz)-uClip.w)>.0001)discard;gl_FragColor=vec4(vColor,uAlpha);}';
 function shader(type,s){const q=gl.createShader(type);gl.shaderSource(q,s);gl.compileShader(q);if(!gl.getShaderParameter(q,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(q));return q;}
 const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('3D shader link failed');gl.useProgram(program);
 const offset=gl.getAttribLocation(program,'aOffset');const linePos=gl.createBuffer(),lineOff=gl.createBuffer();
 const pos=gl.getAttribLocation(program,'aPos'),normal=gl.getAttribLocation(program,'aNormal'),uniform=k=>gl.getUniformLocation(program,k),U={clip:uniform('uClip'),clipSide:uniform('uClipSide'),normalOffset:uniform('uNormalOffset'),sweepAxis:uniform('uSweepAxis'),sweep:uniform('uSweep'),shift:uniform('uShift'),cam:uniform('uCamera'),screen:uniform('uScreen'),zoom:uniform('uZoom'),color:uniform('uColor'),lit:uniform('uLit'),alpha:uniform('uAlpha')};
 function geometry(pts,normals){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pts.flat()),gl.STATIC_DRAW);const n=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,n);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normals?normals.flat():pts.flatMap(()=>[0,0,1])),gl.STATIC_DRAW);return{b,n,count:pts.length,pts};}
 function drawGeo(g,mode,col,alpha=1,lit=0,count=g.count){if(mode===gl.LINE_STRIP||mode===gl.LINES){drawWideLine(g,mode,col,alpha,count);return;}gl.disableVertexAttribArray(offset);gl.vertexAttrib2f(offset,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,g.b);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(pos);gl.bindBuffer(gl.ARRAY_BUFFER,g.n);gl.vertexAttribPointer(normal,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(normal);gl.uniform3fv(U.color,col);gl.uniform1f(U.alpha,alpha);gl.uniform1f(U.lit,lit);gl.drawArrays(mode,0,Math.min(count,g.count));}
 function drawWideLine(g,mode,col,alpha,count){const pp=[],oo=[],limit=Math.min(count,g.count),stride=mode===gl.LINES?2:1,width=mode===gl.LINES?.65:1.5;for(let i=0;i+1<limit;i+=stride){const a=g.pts[i],b=g.pts[i+1],pa=project(a),pb=project(b),dx=pb[0]-pa[0],dy=pb[1]-pa[1],l=Math.hypot(dx,dy);if(l<.01)continue;const nx=-dy/l*width/2,ny=-dx/l*width/2;for(const[k,sign]of[[0,-1],[0,1],[1,1],[0,-1],[1,1],[1,-1]]){pp.push(...(k?b:a));oo.push(nx*sign,ny*sign);}}if(!pp.length)return;gl.bindBuffer(gl.ARRAY_BUFFER,linePos);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pp),gl.DYNAMIC_DRAW);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(pos);gl.bindBuffer(gl.ARRAY_BUFFER,lineOff);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(oo),gl.DYNAMIC_DRAW);gl.vertexAttribPointer(offset,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(offset);gl.disableVertexAttribArray(normal);gl.vertexAttrib3f(normal,0,0,1);gl.uniform3fv(U.color,col);gl.uniform1f(U.alpha,alpha);gl.uniform1f(U.lit,0);gl.drawArrays(gl.TRIANGLES,0,pp.length/3);}
 const curves={};for(const key of['bottom','side','top','wheel'])curves[key]=D[key].map(q=>geometry(q));
 const rails=[geometry(D.upper),geometry(D.lower)],base=geometry(D.base),crown=geometry(D.crown),secs=D.sections.map(s=>geometry(s.points));
 const bbox=[];for(const x of[-30,30])for(const y of[0,99])for(const z of[0,39])bbox.push([x,y,z]);let edges=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if(bbox[i].filter((v,k)=>v!==bbox[j][k]).length===1)edges.push(bbox[i],bbox[j]);const box=geometry(edges);
 let gridpts=[];for(let y=0;y<=100;y+=10)gridpts.push([-35,y,0],[35,y,0]);for(let x=-30;x<=30;x+=10)gridpts.push([x,0,0],[x,100,0]);const grid=geometry(gridpts);
 const band=makeMesh(D.band);
 function makeMesh(m,mirror=false){let pts=[],norms=[];for(const f of m.f){let q=f.map(i=>mirror?[-m.v[i][0],m.v[i][1],m.v[i][2]]:m.v[i]),a=q[1].map((v,i)=>v-q[0][i]),b=q[2].map((v,i)=>v-q[0][i]),nn=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];pts.push(...q);for(const i of f)norms.push(m.n?(mirror?[-m.n[i][0],m.n[i][1],m.n[i][2]]:m.n[i]):nn);}return geometry(pts,norms);}
 const loft2Mesh=makeMesh(D.loft2.mesh),loft3Mesh=makeMesh(D.loft3.mesh),capMesh=makeMesh(D.capMesh),loft2Sections=D.loft2.sections.map(q=>geometry(q)),loft2Rails=D.loft2.rails.map(q=>geometry(q)),loft3Bounds=D.loft3.sections.map(q=>geometry(q)),upperMirror=geometry(D.upper.map(q=>[-q[0],q[1],q[2]]));
 const native33=makeMesh(D.historyMeshes['33']),native35=makeMesh(D.historyMeshes['35']),native36=makeMesh(D.historyMeshes['36']),native40=makeMesh(D.historyMeshes['40']),mirror35=makeMesh(D.historyMeshes['35'],true),mirrorBand=makeMesh(D.band,true),mirrorSide=makeMesh(D.loft2.mesh,true),mirrorBase=makeMesh(D.loft3.mesh,true);
 const native44=makeMesh(D.historyMeshes['44']),native53=makeMesh(D.historyMeshes['53']),native54=makeMesh(D.historyMeshes['54']),thicknessSection=D.thicknessSection.map(q=>geometry(q)),wheelTools=D.wheelToolLines.map(q=>geometry(q));
 const finishGeometry={};function finishList(key){if(!finishGeometry[key])finishGeometry[key]=D.finishMeshes[key].map(m=>makeMesh(m));return finishGeometry[key];}
 const finishProfiles={};for(const[k,lines]of Object.entries(D.finishProfiles))finishProfiles[k]=lines.map(q=>geometry(q));
 const rotationAxis=geometry([[-8,23,17.5],[8,23,17.5]]);
 const cutEdges=D.cutEdges.map(q=>geometry(q));const keyLines={};for(const[k,curves]of Object.entries(D.keyCurves))keyLines[k]=curves.map(q=>geometry(q));
 const points=[];for(const c of D.bottom)for(const frac of[0,.25,.5,.75,1])points.push(c[Math.round(frac*(c.length-1))]);const pointGeo=geometry(D.fitPoints||points);
 function size(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);for(const c of[canvas,labels]){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);}gl.viewport(0,0,canvas.width,canvas.height);lc.setTransform(dpr,0,0,dpr,0,0);}
 function sceneZoom(){return S.step===51?S.zoom+(Math.min(S.zoom,.72)-S.zoom)*explode:S.zoom;}
 function project(q){const a=q[0],b=q[1]-49.5,c=q[2]-19.5,xx=a*Math.cos(S.yaw)-b*Math.sin(S.yaw),dd=a*Math.sin(S.yaw)+b*Math.cos(S.yaw),sc=Math.min(w,h)/125*sceneZoom();return[w/2+xx*sc,h/2+(dd*Math.sin(S.pitch)-c*Math.cos(S.pitch))*sc];}
 function text(txt,p,off=[0,0]){const q=project(p);lc.fillText(txt,q[0]+off[0],q[1]+off[1]);}
 const partInfo=[
 {name:'底蓋／側壁',shift:[0,0,-12],center:[0,50,9],why:'側壁與底部構成下半殼，與上蓋及過渡帶對應接合。'},
 {name:'飾板／過渡帶',shift:[0,0,6],center:[0,55,23],why:'沿側邊環繞的獨立過渡帶，位於上蓋與側壁之間。'},
 {name:'上蓋與按鍵',shift:[0,0,25],center:[0,47,32],why:'保留加厚後的內外表面、下凹按鍵與中央滾輪開孔。'},
 {name:'電池蓋',shift:[0,0,-34],center:[0,72,2],why:'由底部後段分出的獨立蓋件，可觀察它與底蓋開口的關係。'},
 {name:'滾輪',shift:[0,0,65],center:[0,23,17.5],why:'滾輪沿 Z 方向從中央孔正上方抬起，保留原本的前後位置與輪軸方向。'}
 ];
 let explode=0,explodeTarget=0,explodeAnim=0,selectedPart='all';
 function setAssembly(value){stop();cancelAnimationFrame(explodeAnim);explodeTarget=value;const start=explode,now=performance.now();for(const [key,v]of[['assembled',0],['exploded',1]])root.querySelector('[data-'+key+']').setAttribute('aria-pressed',String(value===v));function tick(t){let f=reduced?1:Math.min(1,(t-now)/750);f=f*f*(3-2*f);explode=start+(value-start)*f;draw();if(f<1)explodeAnim=requestAnimationFrame(tick);}explodeAnim=requestAnimationFrame(tick);}
 root.querySelector('[data-assembled]').onclick=()=>setAssembly(0);
 root.querySelector('[data-exploded]').onclick=()=>setAssembly(1);
 root.querySelector('[data-part]').onchange=e=>{selectedPart=e.target.value;root.querySelector('[data-part-note]').textContent=selectedPart==='all'?'原檔五個可見實體；爆炸圖以位移展開，不改變零件形狀與厚度。':partInfo[Number(selectedPart)].why;draw();};
 // Focused operations keep only the part currently being built or machined.
 const capSurface=makeMesh(D.detailMeshes.capSurface),bottomBefore=makeMesh(D.detailMeshes.bottomBefore),stopFace=makeMesh(D.detailMeshes.stopFace);
 const profileGeo=Object.fromEntries(Object.entries(D.finishProfiles).map(([k,v])=>[k,v.map(q=>geometry(q))]));
 const offsetWalls=(()=>{const m=D.detailMeshes.capSurface,ids=new Map(),weld=m.v.map(q=>{const k=q.map(v=>v.toFixed(2)).join(',');if(!ids.has(k))ids.set(k,ids.size);return ids.get(k);}),edges=new Map();for(const f of m.f)for(const [a,b]of[[f[0],f[1]],[f[1],f[2]],[f[2],f[0]]]){const i=weld[a],j=weld[b];if(i===j)continue;const key=i<j?i+':'+j:j+':'+i;const old=edges.get(key);if(old)old.count++;else edges.set(key,{a,b,count:1});}const pts=[];for(const e of edges.values())if(e.count===1){const a=m.v[e.a],b=m.v[e.b],aa=a.map((v,k)=>v-m.n[e.a][k]*1.5),bb=b.map((v,k)=>v-m.n[e.b][k]*1.5);pts.push(a,b,bb,a,bb,aa);}return geometry(pts);})();
 const projectionInputs=D.keyCurves['按鍵投影線'],projectionBoth=projectionInputs.concat(projectionInputs.map(a=>a.map(q=>[-q[0],q[1],q[2]])));
 const projectionFrames=new Map(),toolCache=new Map();
 function projectionGeometry(t){const frame=Math.round(t*40);if(!projectionFrames.has(frame))projectionFrames.set(frame,projectionBoth.map(curve=>geometry(curve.map(q=>[q[0],q[1],q[2]*frame/40]))));return projectionFrames.get(frame);}
 function toolFor(lines,axis,depth){const key=JSON.stringify([axis,depth,lines]);if(toolCache.has(key))return toolCache.get(key);const pts=[];for(const line of lines)for(let i=0;i<line.length-1;i++){const a=line[i],b=line[i+1],aa=a.map((v,k)=>v+(k===axis?depth:0)),bb=b.map((v,k)=>v+(k===axis?depth:0));pts.push(a,b,bb,a,bb,aa);}const g=geometry(pts);toolCache.set(key,g);return g;}
 function paint(g,c,alpha=1,count=g.count){gl.depthMask(alpha>.8);drawGeo(g,gl.TRIANGLES,c,alpha,1,count);gl.depthMask(true);}
 function outline(curves,c,alpha=1){gl.disable(gl.DEPTH_TEST);for(const g of curves)drawGeo(g,gl.LINE_STRIP,c,alpha);gl.enable(gl.DEPTH_TEST);}
 function showTool(lines,axis,depth,t,c){gl.uniform3fv(U.sweepAxis,[axis===0?1:0,axis===1?1:0,axis===2?1:0]);gl.uniform1f(U.sweep,t);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);drawGeo(toolFor(lines,axis,depth),gl.TRIANGLES,c,.18,0);gl.depthMask(true);gl.enable(gl.DEPTH_TEST);gl.uniform1f(U.sweep,1);gl.uniform3f(U.sweepAxis,0,0,0);}
 function wipe(before,after,axis,start,end,t,c){if(t<=0){paint(before,c);return;}if(t>=1){paint(after,c);return;}const dir=end>=start?1:-1,plane=start+(end-start)*t,normal=[0,0,0];normal[axis]=1;gl.uniform4f(U.clip,...normal,plane);gl.uniform1f(U.clipSide,-dir);paint(before,c);gl.uniform1f(U.clipSide,dir);paint(after,c);gl.uniform1f(U.clipSide,0);}
 function curveLabels(refs){const rows=refs.map(r=>({...r,screen:project(r.q)})).sort((a,b)=>a.screen[1]-b.screen[1]);const gap=26,low=48,high=h-82;let last=low-gap;for(const r of rows){r.y=Math.max(low,Math.min(high,r.screen[1]),last+gap);last=r.y;}if(last>high){const shift=last-high;for(const r of rows)r.y-=shift;}lc.textAlign='left';for(const r of rows){const width=lc.measureText(r.name).width,x=12,start=x+width+10;lc.globalAlpha=1;lc.fillText(r.name,x,r.y);lc.strokeStyle=lc.fillStyle;lc.lineWidth=.65;lc.globalAlpha=.5;lc.beginPath();lc.moveTo(start,r.y-4);lc.lineTo(r.screen[0],r.screen[1]);lc.stroke();lc.globalAlpha=1;lc.beginPath();lc.arc(r.screen[0],r.screen[1],2,0,Math.PI*2);lc.fill();}}
 function processCaption(title,detail){lc.save();lc.textAlign='right';lc.fillText(title,w-12,h-42);lc.globalAlpha=.7;lc.fillText(detail,w-12,h-20);lc.restore();}
 function depthInset(depth,t,join=false,action=null){const width=Math.min(170,w*.36),x=w-width-12,y=h-105;lc.save();lc.globalAlpha=.85;lc.strokeStyle=lc.fillStyle;lc.lineWidth=.75;lc.strokeRect(x,y,width,32);const ratio=Math.max(.05,t);lc.globalAlpha=.25;lc.fillRect(x+width*.25,y+(join?32:0),width*.5,(join?-1:1)*24*ratio);lc.globalAlpha=1;lc.textAlign='right';lc.fillText((action||(join?'加入':'切除'))+' '+depth+' mm',w-12,y-9);lc.globalAlpha=.65;lc.fillText('深度放大示意',w-12,y+52);lc.restore();}
 const directionArrows=new Map();
 function machiningArrow(key,c){if(!directionArrows.has(key)){const op=D.teachingOperations[key],lines=D.finishProfiles[key],all=lines.flat(),q=[0,1,2].map(k=>(Math.min(...all.map(p=>p[k]))+Math.max(...all.map(p=>p[k])))/2),axis=op.axis,sign=Math.sign(op.end)||1,a=q.slice(),b=q.slice();if(key==='57')b[axis]-=12;else a[axis]-=12*sign;const v=b.map((x,k)=>x-a[k]),length=Math.hypot(...v),unit=v.map(x=>x/length),side=axis===0?[0,0,1]:[1,0,0],left=b.map((x,k)=>x-unit[k]*3+side[k]*1.5),right=b.map((x,k)=>x-unit[k]*3-side[k]*1.5);directionArrows.set(key,geometry([a,b,left,b,right]));}outline([directionArrows.get(key)],c);}
 function focusedStep(s,p,c){
  const t=Math.max(0,Math.min(1,(p-.18)/.65));
  if(s>=21&&s<=26){
   if(s<=23)paint(capMesh,c.fg,.4);else if(s!==24)paint(native36,c.fg);
   if(s===21){const q=Math.min(1,p/.78);outline(projectionGeometry(q),c.line);if(q<1){gl.disable(gl.DEPTH_TEST);for(const curve of projectionBoth)for(const k of[0,Math.floor(curve.length/2),curve.length-1]){const a=curve[k];drawGeo(geometry([[a[0],a[1],0],a]),gl.LINES,c.muted,.35);}gl.enable(gl.DEPTH_TEST);}processCaption('輪廓線 → 上蓋曲面','沿 Z 方向投影');}
   if(s===22){outline(keyLines['按鍵投影線'],c.line);outline(keyLines['按鍵投影線２'],c.section,p);const pts=D.keyCurves['按鍵投影線２'][0],q=pts[Math.floor(pts.length/2)];drawGeo(geometry([q]),gl.POINTS,c.line);curveLabels([{q,name:'截面定位點'}]);processCaption('定位中間位置 → 畫截面弧線','R500 截面弧');}
   if(s===23){paint(native33,c.section,.12);outline(keyLines['按鍵投影線'],c.line);outline(keyLines['按鍵投影線３'],c.section);curveLabels([{q:D.keyCurves['按鍵投影線３'][0][4],name:'凹面內部導線'}]);processCaption('由截面取得空間導線','外圈定範圍，導線定下凹弧度');}
   if(s===24){gl.clear(gl.DEPTH_BUFFER_BIT);wipe(capMesh,native36,2,0,40,t,c.fg);outline(cutEdges,c.line,.9);if(t<1)showTool(projectionBoth,2,-35,t,c.section);processCaption(t<1?'沿投影輪廓裁切':'兩個按鍵開口已完成','先移除原上蓋，再鋪下凹面');}
   if(s===25){outline(keyLines['按鍵投影線'],c.line);outline(keyLines['按鍵投影線３'],c.section);paint(native35,c.fg,1,Math.floor(native35.count/3*Math.min(1,p/.82))*3);curveLabels(projectionInputs.map((a,i)=>({q:a[Math.floor(a.length/2)],name:'開口邊界 '+(i+1)})).concat([{q:D.keyCurves['按鍵投影線３'][0][4],name:'內部導線'}]));processCaption('開口邊界＋內部導線 → 鋪面','先完成單側下凹曲面');}
   if(s===26){paint(native35,c.fg);paint(mirror35,c.fg,1,Math.floor(mirror35.count/3*p)*3);processCaption('鏡射單側按鍵曲面','左右下凹曲面接回上蓋');}
   return;
  }
  if(s===34){
   if(t<1){paint(capSurface,c.fg,.25);gl.uniform1f(U.normalOffset,-1.5*t);paint(capSurface,c.line,.65);gl.uniform1f(U.normalOffset,0);if(t>.72)paint(offsetWalls,c.section,.8,Math.floor(offsetWalls.count/3*(t-.72)/.28)*3);}else{paint(native53,c.fg);outline(thicknessSection,c.line,.8);}
   depthInset('1.50',t,false,'向內偏移');processCaption(t<.72?'保留外表面 → 曲面向內偏移':t<1?'連接內外表面的邊緣':'上蓋厚度完成','向內 1.50 mm；動態為偏移示意');return;
  }
  if(s===35){paint(native53,c.fg,.75);outline(wheelTools,c.line,.7);showTool(D.wheelCutProfiles.flat(2),2,55,t,c.line);processCaption('選取中央封閉輪廓','下一步切穿上蓋');return;}
  if(s===36){wipe(native53,native54,2,0,55,t,c.fg);if(t<1){showTool(D.wheelCutProfiles.flat(2),2,55,t,c.line);}processCaption(t<1?'中央輪廓向上切除':'滾輪孔與前端分縫完成','只顯示上蓋，其他零件暫隱');return;}
  if(s===37){const lines=D.finishProfiles['55'];wipe(native54,finishList('55')[0],0,-40,40,t,c.fg);outline(profileGeo['55'],c.line,.85);machiningArrow('55',c.line);if(t<1){showTool(lines,0,40,t,c.line);showTool(lines,0,-40,t,c.line);}processCaption(t<1?'側視輪廓 → 橫向對稱裁切':'上蓋前端修整完成','只顯示上蓋；原檔對稱切除設定 40 mm');return;}
  const key={38:'56',39:'57',40:'58',41:'59'}[s];if(!key)return;
  const op=D.teachingOperations[key],before=s===38?bottomBefore:finishList(String(Number(key)-1))[0],after=finishList(key)[0];
  wipe(before,after,op.axis,op.start,op.end,t,c.fg);machiningArrow(key,c.line);outline(profileGeo[key],c.line,.95);if(t<1)showTool(D.finishProfiles[key],op.axis,op.end,t,c.section);
  if(s===41){paint(stopFace,c.section,.25);curveLabels([{q:[0,70,1.5],name:'內側終止面'}]);processCaption(t<1?'由底部輪廓切到指定面':'裁切在指定面停止','終止位置跟著內側面決定');}else{depthInset(s===38?'0.15':s===39?'0.20':'3.00',t,s===39);processCaption(t<1?(s===39?'依輪廓加入材料':'依輪廓移除材料'):'加工完成',op.label+'；其他零件暫隱');}
 }

 function draw(){if(!w)size();gl.uniform1f(U.clipSide,0);gl.uniform1f(U.normalOffset,0);gl.uniform3f(U.sweepAxis,0,0,0);gl.uniform1f(U.sweep,1);gl.uniform3f(U.shift,0,0,0);let c=palette();gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.uniform4f(U.cam,Math.cos(S.yaw),Math.sin(S.yaw),Math.cos(S.pitch),Math.sin(S.pitch));gl.uniform2f(U.screen,w,h);gl.uniform1f(U.zoom,sceneZoom());if(S.step<50){if(S.step===0)drawGeo(grid,gl.LINES,c.muted,.09);if(S.step===0)drawGeo(box,gl.LINES,c.muted,.12);}lc.clearRect(0,0,w,h);lc.font=getComputedStyle(root).fontSize+' '+getComputedStyle(root).fontFamily;probe.style.color='var(--foreground)';lc.fillStyle=getComputedStyle(probe).color;
  const s=S.step,p=progress,thresholds=[7,8,9,10,11,7];
 if(s<50&&!((s>=21&&s<=26)||(s>=34&&s<=41))){
  function lines(key,min){if(s<min||s>=8)return;for(const g of curves[key])drawGeo(g,gl.LINE_STRIP,s===min?c.line:c.muted,s===min?1:(s>=21?.10:.4),0,s===min?Math.max(2,Math.ceil(g.count*p)):g.count);}
  if(s>=1&&s<=5){gl.disable(gl.DEPTH_TEST);drawGeo(pointGeo,gl.POINTS,c.line,1);gl.enable(gl.DEPTH_TEST);}
  lines('bottom',2);lines('side',3);lines('top',4);lines('wheel',5);
  if(s>=6&&s<34){for(const g of rails)drawGeo(g,gl.LINE_STRIP,s===6||s>=12?c.line:c.muted,s===6||s>=12?1:.7,0,s===6?Math.max(2,Math.ceil(g.count*p)):g.count);if(s<8)drawGeo(base,gl.LINE_STRIP,c.muted,.45);drawGeo(crown,gl.LINE_STRIP,c.muted,.35);}
  if(s>=7&&s<34)secs.forEach((g,i)=>{let t=thresholds[i];if(s<t)return;drawGeo(g,gl.LINE_STRIP,(s===t||s>=12)?c.section:c.muted,(s===t||s>=12)?1:.7,0,s===t?Math.max(2,Math.ceil(g.count*p)):g.count);});
  if(s>=13){gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);let count=Math.floor(D.band.f.length*(s===13?p:1))*3;drawGeo(band,gl.TRIANGLES,s===13||s===31?c.fg:c.fg.map(v=>v*.68),s===32?.12:1,1,count);gl.disable(gl.POLYGON_OFFSET_FILL);gl.disable(gl.DEPTH_TEST);if(s<34)for(const g of rails)drawGeo(g,gl.LINE_STRIP,s===13?c.line:c.muted,s===13?.95:.35);if(s===13)secs.forEach(g=>drawGeo(g,gl.LINE_STRIP,c.section,.7));gl.enable(gl.DEPTH_TEST);}
  if(s>=14&&s<34){for(const g of loft2Rails)drawGeo(g,gl.LINE_STRIP,s<=15?c.line:c.muted,s<=15?1:.35);for(const g of loft2Sections)drawGeo(g,gl.LINE_STRIP,s<=15?c.section:c.muted,s<=15?.95:.3);}
  function showSurface(g,when){if(s<when)return;gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);const count=Math.floor(g.count/3*(s===when&&![25,36].includes(s)?p:1))*3;const grouped=(s===28&&[native36,native35,mirror35].includes(g))||(s===30&&[loft2Mesh,loft3Mesh,mirrorSide,mirrorBase,native40].includes(g))||(s===31&&g===mirrorBand);if(s===32)gl.depthMask(false);drawGeo(g,gl.TRIANGLES,s===when||grouped?c.fg:c.fg.map(v=>v*.68),s===32?.12:1,1,count);gl.depthMask(true);gl.disable(gl.POLYGON_OFFSET_FILL);}
  if(s<38)showSurface(loft2Mesh,15);
  if(s>=16&&s<34)for(const g of loft3Bounds)drawGeo(g,gl.LINE_STRIP,s<=17?c.line:c.muted,s<=17?1:.4);
  if(s<38)showSurface(loft3Mesh,17);
  if(s>=18&&s<34){for(const g of[rails[0],upperMirror])drawGeo(g,gl.LINE_STRIP,c.line,1,0,s===18?Math.max(2,Math.ceil(g.count*p)):g.count);}
  if(s>=19&&s<=20)drawGeo(crown,gl.LINE_STRIP,c.section,1,0,s===19?Math.max(2,Math.ceil(crown.count*p)):crown.count);
  if(s===20)showSurface(capMesh,20);if(s>=21&&s<25){gl.depthMask(false);drawGeo(capMesh,gl.TRIANGLES,c.fg,.10,1);gl.depthMask(true);}
  if(s>=25&&s<34)showSurface(native36,25);
  function keyDraw(name,active){for(const g of keyLines[name])drawGeo(g,gl.LINE_STRIP,active?c.section:c.muted,active?1:.25);}
  if(s>=21&&s<28){gl.disable(gl.DEPTH_TEST);keyDraw('按鍵投影線',s<=24);keyDraw('按鍵投影線２',s===21||s===22);gl.enable(gl.DEPTH_TEST);}
  if(s===22||s===23){gl.depthMask(false);drawGeo(native33,gl.TRIANGLES,c.line,.22,1);gl.depthMask(true);}
  if(s>=23&&s<28){gl.disable(gl.DEPTH_TEST);keyDraw('按鍵投影線３',s===23||s===24);gl.enable(gl.DEPTH_TEST);}
  if(s>=24&&s!==25&&s<34)showSurface(native35,24);
  if(s===25){gl.disable(gl.DEPTH_TEST);for(const g of cutEdges)drawGeo(g,gl.LINE_STRIP,c.section,1);gl.enable(gl.DEPTH_TEST);}
  if(s>=26&&s<34)showSurface(mirror35,26);
  if(s>=27){showSurface(mirrorBand,27);if(s<38){showSurface(mirrorSide,27);showSurface(mirrorBase,27);}}
  if(s>=29&&s<38)showSurface(native40,29);
  if(s===32){gl.disable(gl.DEPTH_TEST);gl.depthMask(false);drawGeo(native44,gl.TRIANGLES,c.section,.65,1);gl.depthMask(true);keyDraw('電池蓋',true);gl.enable(gl.DEPTH_TEST);}
  if(s===34||s===35){showSurface(native53,34);if(s===34){gl.disable(gl.DEPTH_TEST);for(const g of thicknessSection)drawGeo(g,gl.LINE_STRIP,c.section,1);gl.enable(gl.DEPTH_TEST);}}
  if(s===35){gl.disable(gl.DEPTH_TEST);for(const g of wheelTools)drawGeo(g,gl.LINE_STRIP,c.section,.7);gl.enable(gl.DEPTH_TEST);}
  if(s===36)showSurface(native54,36);


  if(s===32){lc.textAlign='left';const q=project([0,80,4]);lc.fillText('電池蓋分件工具面',12,30);lc.globalAlpha=.5;lc.strokeStyle=lc.fillStyle;lc.beginPath();lc.moveTo(145,26);lc.lineTo(q[0],q[1]);lc.stroke();lc.globalAlpha=1;}
  if(s>=37){let cap=finishList('55')[0];if(s>=38&&s<=48){gl.depthMask(false);drawGeo(cap,gl.TRIANGLES,c.fg,.12,1);gl.depthMask(true);}else drawGeo(cap,gl.TRIANGLES,c.fg.map(v=>v*.85),1,1);}
  if(s>=38){let key=s===38?'56':s===39?'57':s===40?'58':s===41?'59':'60';let parts=finishList(key);if(s>=49)parts=[finishList('67')[0],...finishList('60').slice(1)];for(const g of parts)drawGeo(g,gl.TRIANGLES,c.fg.map(v=>v*.66),1,1);if(s<=42){gl.disable(gl.DEPTH_TEST);for(const g of finishProfiles[{'38':'56','39':'57','40':'58','41':'59','42':'60'}[String(s)]]||[])drawGeo(g,gl.LINE_STRIP,c.section,.75);gl.enable(gl.DEPTH_TEST);}}
  if(s>=43){const key=s<=44?'61':s===45?'63':s===46?'64':s===47?'65':'66';for(const g of finishList(key))drawGeo(g,gl.TRIANGLES,c.fg.map(v=>v*.88),1,1);if(s===44||s===48){gl.disable(gl.DEPTH_TEST);drawGeo(rotationAxis,gl.LINE_STRIP,c.section,1);gl.enable(gl.DEPTH_TEST);}}
  if(s===37){gl.disable(gl.DEPTH_TEST);for(const g of finishProfiles['55'])drawGeo(g,gl.LINE_STRIP,c.section,.7);gl.enable(gl.DEPTH_TEST);}
 }
 if((s>=21&&s<=26)||(s>=34&&s<=41))focusedStep(s,p,c);
 if(s>=50){const parts=finishList('final'),active=s===51,order=parts.map((_,i)=>i);if(active&&selectedPart!=='all'){const k=Number(selectedPart);order.splice(order.indexOf(k),1);order.push(k);}for(const i of order){const factor=i===4?.5:i===2?.9:.7,shift=partInfo[i].shift.map(v=>v*(active?explode:0)),dim=active&&selectedPart!=='all'&&i!==Number(selectedPart);gl.uniform3fv(U.shift,shift);gl.depthMask(!dim);drawGeo(parts[i],gl.TRIANGLES,c.fg.map(v=>v*factor),dim?.12:1,1);}gl.depthMask(true);gl.uniform3f(U.shift,0,0,0);if(active&&explode>.85)curveLabels(partInfo.map((part,i)=>({q:part.center.map((v,k)=>v+part.shift[k]*explode),name:part.name})));}

  if(s===0){lc.textAlign='center';text('長 99 mm',[-30,49.5,0],[-25,15]);text('寬 60 mm',[0,0,0],[0,22]);text('高 39 mm',[30,99,28],[22,0]);}
  if(s>=7&&s<=12){lc.textAlign='left';D.sections.forEach((sec,i)=>{if(s>=thresholds[i]){const q=sec.points[Math.floor(sec.points.length/2)];const names=['後端','後側','中間','前側','前側2','前端'];if(s===12||s===thresholds[i])text(names[i],q,[8,-8]);}});}
 }
 let measuredWidth=0;
 function stabilizeLayout(){
  const width=root.getBoundingClientRect().width;if(!width||Math.abs(width-measuredWidth)<1)return;measuredWidth=width;
  const measure=document.createElement('div');Object.assign(measure.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',width:width+'px',left:'0',top:'0'});root.append(measure);
  function reserve(selector,values,variable){const original=root.querySelector(selector),clone=original.cloneNode(true);clone.removeAttribute('hidden');clone.style.minHeight='0';clone.style.height='auto';measure.style.width=original.getBoundingClientRect().width+'px';measure.replaceChildren(clone);let max=0;for(const value of values){if(selector==='.l15-step-heading'){clone.querySelector('[data-count]').textContent='52 / 52';clone.querySelector('h3').textContent=value;}else if(value!==null)clone.textContent=value;max=Math.max(max,clone.getBoundingClientRect().height);}root.style.setProperty(variable,Math.ceil(max)+'px');}
  reserve('.l15-step-heading',steps.map(s=>s[0]),'--step-heading-height');
  reserve('[data-input-sources]',[null],'--source-height');
  reserve('[data-why]',steps.map(s=>s[1]),'--why-height');
  reserve('[data-note]',steps.map(s=>s[2]),'--note-height');
  reserve('[data-part-note]',[...partInfo.map(p=>p.why),'原檔五個可見實體；爆炸圖以位移展開，不改變零件形狀與厚度。'],'--part-note-height');
  measure.remove();
 }
 new ResizeObserver(stabilizeLayout).observe(root);
 let stateRevision=0;
 function persist(){stateRevision=Math.max(Date.now(),stateRevision+1);saveState({modelContent:{preview:'l15-native-history-v3',step:S.step,title:steps[S.step][0],revision:stateRevision},privateContent:{yaw:S.yaw,pitch:S.pitch,zoom:S.zoom,viewRoute:2}}).catch(()=>{});}
 function stop(){playing=false;playAll=false;clearTimeout(timer);cancelAnimationFrame(anim);root.querySelector('[data-play]').textContent='播放';const all=root.querySelector('[data-play-all]');all.disabled=false;all.textContent='全部播放（接續）';all.setAttribute('aria-pressed','false');}
 const longerSteps=new Set([13,15,17,20,23,24,25,26,27,34,36,43,45,46,47,48,50]);
 const detailedSteps=new Set([21,22,23,24,25,26,34,35,36,37,38,39,40,41]);
 function stepDuration(index){return index===steps.length-1?4000:detailedSteps.has(index)?4300:longerSteps.has(index)?3000:1900;}
 function schedule(){clearTimeout(timer);if(playing)timer=setTimeout(()=>{if(S.step===steps.length-1){stop();return;}S.step++;update(true);persist();schedule();},stepDuration(S.step));}
 // Camera faces the model from (sin(yaw), cos(yaw), elevation).
 // Original model: front is Y=0; the constructed half is X>0.
 const teachingViews=[
 [0,0,Math.PI*.75,Math.PI/4],
 [1,2,Math.PI,Math.PI/2-.001],
 [3,3,Math.PI/2,.10],[4,4,Math.PI,Math.PI/2-.001],
 [5,5,Math.PI*.75,.40],
 [6,12,1.70,.38],[13,13,1.70,.35],
 [14,15,Math.PI/2,.20],[16,17,1.70,-.24],
 [18,20,Math.PI*.75,.82],
 [21,24,2.05,.55],[25,25,Math.PI*.75,.95],
 [26,28,Math.PI*.75,.65],[29,30,Math.PI*.75,-.80],
 [31,31,1.70,.26],[32,32,Math.PI/2,0],
 [33,33,Math.PI*.75,-.65],[34,34,Math.PI/2,.12],[35,36,Math.PI*.75,.85],
 [37,37,Math.PI/2,.10],[38,42,Math.PI*.75,-.75],
 [43,48,Math.PI*.75,.55],[49,49,Math.PI*.75,-.65],
 [50,51,Math.PI*.75,Math.PI/4]
 ];
 let cameraStep=-1;
 function stepView(){return teachingViews.find(v=>S.step>=v[0]&&S.step<=v[1]);}
 function update(animate=false){cancelAnimationFrame(anim);const from={yaw:S.yaw,pitch:S.pitch},target=stepView(),move=cameraStep!==S.step&&cameraStep>=0;cameraStep=S.step;root.querySelector('[data-assembly]').hidden=S.step!==51;root.querySelector('[data-input-sources]').hidden=![14,15].includes(S.step);const cameraStart=performance.now();if(move)root.querySelector('[data-view]').value='free';progress=animate&&!reduced?0:1;last=performance.now();root.querySelector('[data-title]').textContent=steps[S.step][0];root.querySelector('[data-count]').textContent=String(S.step+1).padStart(2,'0')+' / '+steps.length;root.querySelector('[data-why]').textContent=steps[S.step][1];root.querySelector('[data-note]').textContent=steps[S.step][2];root.querySelector('[data-prev]').disabled=S.step===0;root.querySelector('[data-next]').disabled=S.step===steps.length-1;root.querySelector('.progress-bar').style.width=(S.step+1)/steps.length*100+'%';root.querySelector('.progress').setAttribute('aria-valuenow',S.step+1);if(progress===1&&(!move||reduced)){if(move){S.yaw=target[2];S.pitch=target[3];}draw();}else{function tick(t){if(move){let f=Math.min(1,(t-cameraStart)/650);f=f*f*(3-2*f);let delta=((target[2]-from.yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;S.yaw=from.yaw+delta*f;S.pitch=from.pitch+(target[3]-from.pitch)*f;}progress=animate&&!reduced?Math.min(1,(t-last)/Math.min(detailedSteps.has(S.step)?3500:[13,15,17,20,24,25,26,27,29,34].includes(S.step)?2350:1200,stepDuration(S.step)-550)):1;draw();if(progress<1||(move&&t-cameraStart<650))anim=requestAnimationFrame(tick);else if(move)persist();}anim=requestAnimationFrame(tick);}}
 root.querySelector('[data-play-all]').onclick=()=>{stop();playing=true;playAll=true;const all=root.querySelector('[data-play-all]');all.disabled=true;all.textContent='接續播放中';all.setAttribute('aria-pressed','true');root.querySelector('[data-play]').textContent='暫停';update(true);persist();schedule();};
 root.querySelector('[data-prev]').onclick=()=>{stop();S.step=Math.max(0,S.step-1);update(false);persist();};root.querySelector('[data-next]').onclick=()=>{stop();S.step=Math.min(steps.length-1,S.step+1);update(true);persist();};root.querySelector('[data-play]').onclick=()=>{if(playing){stop();return;}if(S.step===steps.length-1)S.step=0;playing=true;root.querySelector('[data-play]').textContent='暫停';update(true);schedule();};root.querySelector('[data-replay]').onclick=()=>{stop();S.step=0;playing=true;root.querySelector('[data-play]').textContent='暫停';update(true);persist();schedule();};
 for(const[key,factor]of[['plus',1.15],['minus',1/1.15]])root.querySelector('[data-'+key+']').onclick=()=>{S.zoom=Math.max(.6,Math.min(2,S.zoom*factor));draw();persist();};
 const view=root.querySelector('[data-view]');view.onchange=()=>{if(view.value==='top'){S.yaw=0;S.pitch=Math.PI/2-.001;}else if(view.value==='side'){S.yaw=Math.PI/2;S.pitch=0;}else if(view.value==='bottom'){S.yaw=0;S.pitch=-Math.PI/2+.001;}else{S.yaw=Math.PI*.75;S.pitch=Math.PI/4;}draw();persist();};
 canvas.addEventListener('pointerdown',e=>{stop();cancelAnimationFrame(anim);progress=1;drag={x:e.clientX,y:e.clientY,yaw:S.yaw,pitch:S.pitch};canvas.setPointerCapture(e.pointerId);draw();});canvas.addEventListener('pointermove',e=>{if(!drag)return;S.yaw=drag.yaw+(e.clientX-drag.x)*.008;S.pitch=Math.max(-Math.PI/2+.001,Math.min(Math.PI/2-.001,drag.pitch+(e.clientY-drag.y)*.007));view.value='free';draw();});const end=()=>{if(drag){drag=null;persist();}};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 function restore(saved){const m=saved?.modelContent,p=saved?.privateContent;if(m?.preview==='l15-native-history-v3'){if(Number.isFinite(m.revision))stateRevision=m.revision;S.step=Math.max(0,Math.min(steps.length-1,Number(m.step)||0));for(const k of['yaw','pitch','zoom'])if(Number.isFinite(p?.[k]))S[k]=p[k];S.zoom=Math.max(.6,Math.min(2,S.zoom));S.pitch=Math.max(-Math.PI/2+.001,Math.min(Math.PI/2-.001,S.pitch));}if(p?.viewRoute!==2){const v=stepView();S.yaw=v[2];S.pitch=v[3];}stabilizeLayout();size();update();}
 document.querySelector('[data-loading]').hidden=true;root.hidden=false;restore(readState());new ResizeObserver(()=>{size();draw();}).observe(root.querySelector('.l15-view'));new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-theme']});
})();
