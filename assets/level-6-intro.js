
(()=>{
 const root=document.getElementById('sixth-course-intro');if(!root)return;
 function select(value){root.querySelectorAll('[data-page]').forEach(page=>page.hidden=Number(page.dataset.page)!==value);root.querySelectorAll('[data-step]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.step)===value)));}
 select(1);root.addEventListener('click',event=>{const button=event.target.closest('[data-step]');if(button)select(Number(button.dataset.step));});
    function makeSix(w, h, d, d1, d2) {

        const hw=w/2, hh=h/2, hd=d/2;
        const bh=-hh, sh=hh-d2, th=hh, tw=hw-d1, td=hd-d1;

        if (d1 <= 0.1 || d2 <= 0.1) {
            return new THREE.BoxGeometry(w,h,d);
        }

        const P = [
            new THREE.Vector3(-hw, bh, -hd), new THREE.Vector3( hw, bh, -hd),
            new THREE.Vector3( hw, bh,  hd), new THREE.Vector3(-hw, bh,  hd),
            new THREE.Vector3(-hw, sh, -hd), new THREE.Vector3( hw, sh, -hd),
            new THREE.Vector3( hw, sh,  hd), new THREE.Vector3(-hw, sh,  hd),
            new THREE.Vector3(-tw, th, -td), new THREE.Vector3( tw, th, -td),
            new THREE.Vector3( tw, th,  td), new THREE.Vector3(-tw, th,  td),
        ];

        const verts = [], norms = [];

        function quad(a, b, c, dd, nx, ny, nz) {
            verts.push(
                P[a].x,P[a].y,P[a].z, P[b].x,P[b].y,P[b].z, P[c].x,P[c].y,P[c].z,
                P[a].x,P[a].y,P[a].z, P[c].x,P[c].y,P[c].z, P[dd].x,P[dd].y,P[dd].z
            );
            for (let i=0; i<6; i++) norms.push(nx, ny, nz);
        }

        const L=Math.hypot(d1,d2), nb=d1/L, na=d2/L;

        quad(0,1,2,3,   0,-1, 0);
        quad(4,5,1,0,   0, 0,-1);
        quad(5,6,2,1,   1, 0, 0);
        quad(6,7,3,2,   0, 0, 1);
        quad(7,4,0,3,  -1, 0, 0);
        quad(8,9,5,4,   0,na,-nb);
        quad(9,10,6,5,  nb,na, 0);
        quad(10,11,7,6, 0,na, nb);
        quad(11,8,4,7, -nb,na, 0);
        quad(11,10,9,8, 0, 1, 0);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        geo.setAttribute('normal',   new THREE.Float32BufferAttribute(norms, 3));

        return geo;
    }

 try{
  if(!window.THREE)throw Error('造型簡圖尚未載入，請稍後重開。');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setSize(720,440);
  const material=new THREE.MeshStandardMaterial({color:0xbfc6cc,roughness:.34,metalness:.18,side:THREE.DoubleSide});
  const camera=new THREE.OrthographicCamera(-163.64,163.64,100,-100,1,2000);camera.position.set(145,105,165);camera.lookAt(0,0,0);
  const cases={'inset-small':[10,20],'inset-large':[40,20],'depth-small':[20,10],'depth-large':[20,50]};
  for(const canvas of root.querySelectorAll('[data-demo]')){
   const [d1,d2]=cases[canvas.dataset.demo],scene=new THREE.Scene(),geometry=makeSix(120,80,150,d1,d2);
   scene.add(new THREE.AmbientLight(0xffffff,.65));[[0xffffff,1.2,[-80,160,180]],[0x00ffcc,.2,[-100,0,70]],[0xff44aa,.13,[100,-40,-90]]].forEach(([color,power,xyz])=>{const light=new THREE.DirectionalLight(color,power);light.position.set(...xyz);scene.add(light);});
   scene.add(new THREE.Mesh(geometry,material));
   scene.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry,15),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.25})));
   for(const top of [true,false]){const x=top?60-d1:60,z=top?75-d1:75,y=top?40:40-d2;const points=[[-x,y,-z],[x,y,-z],[x,y,z],[-x,y,z],[-x,y,-z]].map(p=>new THREE.Vector3(...p));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:top?0xffdd00:0xff6622,transparent:true,opacity:.7,depthWrite:false}));scene.add(line);}
   renderer.render(scene,camera);canvas.getContext('2d').drawImage(renderer.domElement,0,0);
   scene.traverse(item=>{if(item.geometry)item.geometry.dispose();if(item.material&&item.material!==material)item.material.dispose();});
  }
  material.dispose();renderer.dispose();renderer.forceContextLoss();
 }catch(error){root.querySelectorAll('[data-demo]').forEach(canvas=>{const ctx=canvas.getContext('2d');ctx.fillStyle='#aaa';ctx.font='24px sans-serif';ctx.fillText(error.message,15,220);});}
})();
