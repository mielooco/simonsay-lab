
(()=>{
 const root=document.getElementById('radius-one-intro');if(!root)return;
 try{
  if(!window.THREE)throw Error('造型簡圖尚未載入，請稍後重開。');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setSize(640,460);
  const material=new THREE.MeshStandardMaterial({color:0xbfc7cc,roughness:.33,metalness:.18});
  const camera=new THREE.OrthographicCamera(-69.6,69.6,50,-50,1,1000);camera.position.set(120,95,155);camera.lookAt(0,0,0);
  root.querySelectorAll('[data-radius]').forEach(canvas=>{
   const radius=Number(canvas.dataset.radius),scene=new THREE.Scene();
   scene.add(new THREE.AmbientLight(0xffffff,.7));
   [[0xffffff,1.2,[-80,140,180]],[0x00ffcc,.22,[-100,0,70]],[0xff44aa,.12,[100,-20,-90]]].forEach(([color,power,xyz])=>{const light=new THREE.DirectionalLight(color,power);light.position.set(...xyz);scene.add(light);});
   const geometry=new THREE.BoxGeometry(58,58,58,radius?32:1,radius?32:1,radius?32:1);
   if(radius){const position=geometry.attributes.position,point=new THREE.Vector3(),center=new THREE.Vector3(),inner=29-radius;for(let i=0;i<position.count;i++){point.fromBufferAttribute(position,i);center.set(THREE.MathUtils.clamp(point.x,-inner,inner),THREE.MathUtils.clamp(point.y,-inner,inner),THREE.MathUtils.clamp(point.z,-inner,inner));point.sub(center).normalize().multiplyScalar(radius).add(center);position.setXYZ(i,point.x,point.y,point.z);}geometry.computeVertexNormals();}
   scene.add(new THREE.Mesh(geometry,material));renderer.render(scene,camera);canvas.getContext('2d').drawImage(renderer.domElement,0,0);geometry.dispose();
  });
  material.dispose();renderer.dispose();renderer.forceContextLoss();
 }catch(error){root.querySelectorAll('[data-radius]').forEach(canvas=>{const ctx=canvas.getContext('2d');ctx.fillStyle='#aaa';ctx.font='24px sans-serif';ctx.fillText(error.message,20,230);});}
})();


(()=>{
 const root=document.getElementById('verified-course-intros');if(!root)return;
 // Geometry builders copied from the reviewed lesson sources; only their return interfaces are adapted.
     function getIntersectT(d1, d2, R, S_half) {
        d1 = Math.abs(d1); d2 = Math.abs(d2);
        if (d1 === 0 && d2 === 0) return Infinity;
        if (R <= 0.001) { return Math.min(d1>0?S_half/d1:Infinity, d2>0?S_half/d2:Infinity); }
        const c = S_half - R;
        if (d1 > 0) { const t1 = S_half/d1; if (d2===0||d2*t1<=c) return t1; }
        if (d2 > 0) { const t2 = S_half/d2; if (d1===0||d1*t2<=c) return t2; }
        const a=d1*d1+d2*d2, b=-2*c*(d1+d2), k=2*c*c-R*R, D=b*b-4*a*k;
        if (D >= 0) return (-b + Math.sqrt(D)) / (2*a);
        return Infinity;
    }

    function makeThree(w, h, d, topR, botR, sideR) {
        const seg = 48;
        let geometry = new THREE.BoxGeometry(w, h, d, seg, seg, seg);
        const pos = geometry.attributes.position;
        let hx=w/2, hy=h/2, hz=d/2;
        const safeSideR = Math.max(0, Math.min(sideR, hx, hz));
        const safeTopR  = Math.max(0, Math.min(topR, hx, hy, hz));
        const safeBotR  = Math.max(0, Math.min(botR, hx, hy, hz));
        for (let i = 0; i < pos.count; i++) {
            let x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i);
            let sx=Math.sign(x)||1, sy=Math.sign(y)||1, sz=Math.sign(z)||1;
            let ax=Math.abs(x), ay=Math.abs(y), az=Math.abs(z);
            let rY=y>0?safeTopR:safeBotR, rX=safeSideR, rZ=safeSideR;
            let cx=hx-rX, cy=hy-rY, cz=hz-rZ;
            let dx=Math.max(0,ax-cx), dy=Math.max(0,ay-cy), dz=Math.max(0,az-cz);
            let nx=rX<=0?0:dx/rX, ny=rY<=0?0:dy/rY, nz=rZ<=0?0:dz/rZ;
            let mapX=nx*Math.sqrt(Math.max(0,1-(ny*ny)/2-(nz*nz)/2+(ny*ny*nz*nz)/3));
            let mapY=ny*Math.sqrt(Math.max(0,1-(nx*nx)/2-(nz*nz)/2+(nx*nx*nz*nz)/3));
            let mapZ=nz*Math.sqrt(Math.max(0,1-(nx*nx)/2-(ny*ny)/2+(nx*nx*ny*ny)/3));
            pos.setXYZ(i,(Math.min(ax,cx)+mapX*rX)*sx,(Math.min(ay,cy)+mapY*rY)*sy,(Math.min(az,cz)+mapZ*rZ)*sz);
        }
        pos.needsUpdate = true;
        geometry = THREE.BufferGeometryUtils.mergeVertices(geometry);
        geometry.computeVertexNormals();
        return geometry;
    }

    function makeFour(w, h, d, rht, rhb, rv, segments) {
        const hw=w/2, hh=h/2, hd=d/2, vertices=[], eps=0.001;

        const arcTop=[], arcBot=[], arcV=[];
        for (let i=0; i<=segments; i++) {
            const a = (i/segments) * (Math.PI/2);
            arcTop.push({ ox: rht - rht*Math.cos(a), oy: rht - rht*Math.sin(a) });
            arcBot.push({ ox: rhb - rhb*Math.cos(a), oy: rhb - rhb*Math.sin(a) });
            arcV.push({ x: rv - rv*Math.cos(a), z: rv - rv*Math.sin(a) });
        }

        function getPt(sx, sz, hIdx, vIdx, isBottom=false) {
            const ph = isBottom ? arcBot[hIdx] : arcTop[hIdx];
            const pv = arcV[vIdx];
            const x = sx * (hw - pv.x - ph.ox * (rv - pv.x) / rv);
            const z = sz * (hd - pv.z - ph.ox * (rv - pv.z) / rv);
            const y = isBottom ? (-hh + ph.oy) : (hh - ph.oy);
            return new THREE.Vector3(x, y, z);
        }

        function addQuad(p1,p2,p3,p4) {
            if (p1.distanceTo(p2)>eps && p2.distanceTo(p3)>eps && p1.distanceTo(p3)>eps)
                vertices.push(p1.x,p1.y,p1.z, p2.x,p2.y,p2.z, p3.x,p3.y,p3.z);
            if (p1.distanceTo(p3)>eps && p3.distanceTo(p4)>eps && p1.distanceTo(p4)>eps)
                vertices.push(p1.x,p1.y,p1.z, p3.x,p3.y,p3.z, p4.x,p4.y,p4.z);
        }

        function addTri(p1,p2,p3) {
            if (p1.distanceTo(p2)<eps || p2.distanceTo(p3)<eps || p1.distanceTo(p3)<eps) return;
            vertices.push(p1.x,p1.y,p1.z, p2.x,p2.y,p2.z, p3.x,p3.y,p3.z);
        }

        const sidePairs = [
            {s1:[-1,1],s2:[1,1],vi:segments},
            {s1:[1,1],s2:[1,-1],vi:0},
            {s1:[1,-1],s2:[-1,-1],vi:segments},
            {s1:[-1,-1],s2:[-1,1],vi:0}
        ];

        sidePairs.forEach(side => {
            const s1=side.s1, s2=side.s2, vi=side.vi, step=(vi===segments)?-1:1, start=side.vi;
            addQuad(getPt(s1[0],s1[1],0,vi,true),getPt(s2[0],s2[1],0,vi,true),getPt(s2[0],s2[1],0,vi,false),getPt(s1[0],s1[1],0,vi,false));
            for (let v=0; v<segments; v++) {
                const vA=start+v*step, vB=start+(v+1)*step;
                addQuad(getPt(s2[0],s2[1],0,vA,true),getPt(s2[0],s2[1],0,vB,true),getPt(s2[0],s2[1],0,vB,false),getPt(s2[0],s2[1],0,vA,false));
            }
            for (let i=0; i<segments; i++) {
                addQuad(getPt(s1[0],s1[1],i,vi,false),getPt(s2[0],s2[1],i,vi,false),getPt(s2[0],s2[1],i+1,vi,false),getPt(s1[0],s1[1],i+1,vi,false));
                addQuad(getPt(s1[0],s1[1],i,vi,true),getPt(s1[0],s1[1],i+1,vi,true),getPt(s2[0],s2[1],i+1,vi,true),getPt(s2[0],s2[1],i,vi,true));
                for (let v=0; v<segments; v++) {
                    const vA=start+v*step, vB=start+(v+1)*step;
                    addQuad(getPt(s2[0],s2[1],i,vA,false),getPt(s2[0],s2[1],i,vB,false),getPt(s2[0],s2[1],i+1,vB,false),getPt(s2[0],s2[1],i+1,vA,false));
                    addQuad(getPt(s2[0],s2[1],i,vA,true),getPt(s2[0],s2[1],i+1,vA,true),getPt(s2[0],s2[1],i+1,vB,true),getPt(s2[0],s2[1],i,vB,true));
                }
            }
        });

        const last=segments;
        const iTL=getPt(-1,1,last,segments,false), iTR=getPt(1,1,last,segments,false);
        const iBR=getPt(1,-1,last,segments,false), iBL=getPt(-1,-1,last,segments,false);
        addQuad(iTL,iTR,iBR,iBL);
        addQuad(getPt(-1,1,last,segments,false),getPt(1,1,last,segments,false),iTR,iTL);
        addQuad(iTR,getPt(1,1,last,0,false),getPt(1,-1,last,0,false),iBR);
        addQuad(iBL,iBR,getPt(1,-1,last,segments,false),getPt(-1,-1,last,segments,false));
        addQuad(getPt(-1,1,last,0,false),iTL,iBL,getPt(-1,-1,last,0,false));
        for (let v=0; v<segments; v++) {
            addTri(iTR,getPt(1,1,last,v+1,false),getPt(1,1,last,v,false));
            addTri(iBR,getPt(1,-1,last,v,false),getPt(1,-1,last,v+1,false));
            addTri(iBL,getPt(-1,-1,last,v+1,false),getPt(-1,-1,last,v,false));
            addTri(iTL,getPt(-1,1,last,v,false),getPt(-1,1,last,v+1,false));
        }

        const jTL=getPt(-1,1,last,segments,true), jTR=getPt(1,1,last,segments,true);
        const jBR=getPt(1,-1,last,segments,true), jBL=getPt(-1,-1,last,segments,true);
        addQuad(jBL,jBR,jTR,jTL);
        addQuad(jTL,jTR,getPt(1,1,last,segments,true),getPt(-1,1,last,segments,true));
        addQuad(jBR,jBL,getPt(-1,-1,last,segments,true),getPt(1,-1,last,segments,true));
        addQuad(jTR,jBR,getPt(1,-1,last,0,true),getPt(1,1,last,0,true));
        addQuad(jBL,jTL,getPt(-1,1,last,0,true),getPt(-1,-1,last,0,true));
        for (let v=0; v<segments; v++) {
            addTri(jTR,getPt(1,1,last,v,true),getPt(1,1,last,v+1,true));
            addTri(jBR,getPt(1,-1,last,v+1,true),getPt(1,-1,last,v,true));
            addTri(jBL,getPt(-1,-1,last,v,true),getPt(-1,-1,last,v+1,true));
            addTri(jTL,getPt(-1,1,last,v+1,true),getPt(-1,1,last,v,true));
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geo.computeVertexNormals();
        return geo;
    }

    function makeFive(w, h, d, r1, rb, r3, r4) {
        const geometry = new THREE.BoxGeometry(w, h, d, 140, 140, 140);
        const pos = geometry.attributes.position;
        const hw=w/2, hh=h/2, hd=d/2;
        const cy1=hh-r1, cz1=hd-r1;
        const cxB=hw-rb, czB=-hd+rb;
        const cy4=hh-r4, cz4=-hd+r4;
        const cxF=hw-r3, czF=hd-r3;

        for (let i = 0; i < pos.count; i++) {
            let x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i);
            let ax=Math.abs(x), sx=Math.sign(x)||1;
            let fy=y, fz=z, fp=ax;

            if (r1>0 && fy>cy1 && fz>cz1) {
                let d1=Math.hypot(fy-cy1, fz-cz1);
                if(d1>r1){ fy=cy1+(fy-cy1)/d1*r1; fz=cz1+(fz-cz1)/d1*r1; }
            }
            if (rb>0 && fp>hw-rb && fz<czB) {
                let dB=Math.hypot(fp-(hw-rb), fz-czB);
                if(dB>rb){ fp=(hw-rb)+(fp-(hw-rb))/dB*rb; fz=czB+(fz-czB)/dB*rb; }
            }
            if (r3>0) {
                const inS01=r1>0&&fy>cy1&&fz>cz1;
                const inS02=rb>0&&fp>hw-rb&&fz<czB;
                if (fp>cxF && fz>czF && !inS01) {
                    const dist=Math.hypot(fp-cxF, fz-czF);
                    if(dist>r3){ const t=r3/dist; fp=cxF+(fp-cxF)*t; fz=czF+(fz-czF)*t; }
                } else if (inS01) {
                    const dR1=Math.hypot(fy-cy1, fz-cz1), path_d=r1-dR1, dx=hw-fp;
                    if(path_d<r3&&dx<r3){ const dc=Math.hypot(r3-dx,r3-path_d); if(dc>r3){ const ratio=r3/dc; fp=hw-r3+(r3-dx)*ratio; const push=(r3-path_d)*(1-ratio); fy-=push*(fy-cy1)/dR1; fz-=push*(fz-cz1)/dR1; } }
                } else if (inS02) {
                    const dRB=Math.hypot(fp-(hw-rb),czB-fz), path_d=rb-dRB, dy=hh-fy;
                    if(path_d<r3&&dy<r3){ const dc=Math.hypot(r3-dy,r3-path_d); if(dc>r3){ const ratio=r3/dc; fy=hh-r3+(r3-dy)*ratio; const push=(r3-path_d)*(1-ratio); fp-=push*(fp-(hw-rb))/dRB; fz+=push*(czB-fz)/dRB; } }
                } else if (fz<=cz1&&fz>=czB) {
                    const dy=hh-fy, dx=hw-fp;
                    if(dy<r3&&dx<r3){ const dc=Math.hypot(r3-dx,r3-dy); if(dc>r3){ const ratio=r3/dc; fp=hw-r3+(r3-dx)*ratio; fy=hh-r3+(r3-dy)*ratio; } }
                }
            }
            if (r4>0 && fy>cy4 && fz<cz4) {
                const d4=Math.hypot(fy-cy4, cz4-fz);
                if(d4>r4){ const t=r4/d4; fy=cy4+(fy-cy4)*t; fz=cz4-(cz4-fz)*t; }
            }
            pos.setXYZ(i, fp*sx, fy, fz);
        }
        pos.needsUpdate = true;
        geometry.computeVertexNormals();
        return geometry;
    }
 function makeTwo(S,rT,rB,rS){
  const geometry=new THREE.BoxGeometry(1,1,1,150,150,150),positions=geometry.attributes.position,S_half=S/2;
  for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i),len=Math.hypot(x,y,z);if(!len)continue;const dx=x/len,dy=y/len,dz=z/len,rY=dy>0?rT:rB,t=Math.min(getIntersectT(dy,dz,rY,S_half),getIntersectT(dx,dy,rY,S_half),getIntersectT(dx,dz,rS,S_half));if(Number.isFinite(t))positions.setXYZ(i,dx*t,dy*t,dz*t);}
  geometry.computeVertexNormals();return geometry;
 }
 const cases={
  'two-top':{lesson:2,args:[100,40,8,0]},'two-small':{lesson:2,args:[100,40,8,5]},'two-large':{lesson:2,args:[100,40,8,30]},
  'three-flat':{lesson:3,args:[120,40,180,10,2,15]},'three-long':{lesson:3,args:[45,30,220,10,2,15]},'three-solid':{lesson:3,args:[120,120,120,10,2,15]},
  'four-top':{lesson:4,args:[220,110,160,40,5,50,32]},'four-bottom':{lesson:4,args:[220,110,160,5,40,50,32]},'four-equal':{lesson:4,args:[220,110,160,20,20,50,32]},
  'four-vertical-small':{lesson:4,args:[220,110,160,10,5,15,32]},'four-vertical-large':{lesson:4,args:[220,110,160,10,5,60,32]},
  'five-original':{lesson:5,args:[120,80,180,0,0,0,0]},'five-front':{lesson:5,args:[120,80,180,56,0,0,0]},'five-back':{lesson:5,args:[120,80,180,56,33.5,0,0]},'five-chain':{lesson:5,args:[120,80,180,56,33.5,32,32]}
 };
 try{
  if(!window.THREE)throw Error('造型簡圖尚未載入，請稍後重開。');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setSize(720,480);
  const material=new THREE.MeshStandardMaterial({color:0xc0c7cc,roughness:.3,metalness:.2,side:THREE.DoubleSide});
  const builders={2:makeTwo,3:makeThree,4:makeFour,5:makeFive};
  for(const canvas of root.querySelectorAll('[data-view]')){
   const config=cases[canvas.dataset.view],geometry=builders[config.lesson](...config.args),scene=new THREE.Scene();
   const span={2:86,3:112,4:120,5:105}[config.lesson],camera=new THREE.OrthographicCamera(-span*1.5,span*1.5,span,-span,1,2000);camera.position.set(145,105,165);camera.lookAt(0,0,0);
   scene.add(new THREE.AmbientLight(0xffffff,.65));
   [[0xffffff,1.2,[-80,160,180]],[0x00ffcc,.2,[-100,0,70]],[0xff44aa,.13,[100,-40,-90]]].forEach(([color,power,xyz])=>{const light=new THREE.DirectionalLight(color,power);light.position.set(...xyz);scene.add(light);});
   scene.add(new THREE.Mesh(geometry,material));renderer.render(scene,camera);const ctx=canvas.getContext('2d');ctx.drawImage(renderer.domElement,0,0);
   if(config.lesson===2){const dir=new THREE.Vector3(1,1,1).normalize(),a=config.args,t=Math.min(getIntersectT(dir.y,dir.z,a[1],50),getIntersectT(dir.x,dir.y,a[1],50),getIntersectT(dir.x,dir.z,a[3],50));const point=dir.multiplyScalar(t).project(camera);ctx.beginPath();ctx.arc((point.x+1)*360,(1-point.y)*240,29,0,Math.PI*2);ctx.strokeStyle='#ffaa00';ctx.lineWidth=2;ctx.stroke();}
   geometry.dispose();
  }
  material.dispose();renderer.dispose();renderer.forceContextLoss();
 }catch(error){root.querySelectorAll('[data-view]').forEach(canvas=>{const ctx=canvas.getContext('2d');ctx.fillStyle='#aaa';ctx.font='24px sans-serif';ctx.fillText(error.message,15,240);});}
})();
// The lesson stays mounted while its introduction is open, preserving controls and camera state.
(() => {
 const intro=document.getElementById('lesson-intro');
 if(!intro)return;
 function show(value){
  intro.hidden=!value;
  document.body.classList.toggle('show-course-intro',value);
  if(typeof controls!=='undefined')controls.enabled=!value;
  window.scrollTo(0,0);
  window.dispatchEvent(new Event('resize'));
 }
 document.getElementById('course-intro-start').addEventListener('click',()=>show(false));
 document.querySelectorAll('[data-course-review]').forEach(button=>button.addEventListener('click',()=>show(true)));
 show(true);
})();
