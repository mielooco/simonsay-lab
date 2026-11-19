import * as THREE from 'three';

// Project the same editable 3D geometry without requiring a GPU context.
export function createSoftwareRenderer(){
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('Canvas is unavailable');
  canvas.dataset.renderer='software';
  let width=1,height=1,ratio=1,stamp='',camera;
  const world=new THREE.Vector3(),projected=new THREE.Vector3(),normal=new THREE.Vector3(),normalMatrix=new THREE.Matrix3();
  const light=new THREE.Vector3(2,-4,8).normalize();
  function project(x,y,z,matrix){world.set(x,y,z).applyMatrix4(matrix);projected.copy(world).project(camera);return [(projected.x+1)*width/2,(1-projected.y)*height/2,projected.z];}
  function render(scene,cam){
    camera=cam;scene.updateMatrixWorld();camera.updateMatrixWorld();
    const meshes=[];scene.traverse(o=>{if(o.visible&&o.geometry&&o.material)meshes.push(o);});
    const next=width+':'+height+':'+meshes.map(o=>o.id).join(',')+':'+camera.matrixWorld.elements.join(',');
    if(next===stamp)return;stamp=next;
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.globalAlpha=1;ctx.fillStyle='#cdd4d0';ctx.fillRect(0,0,width,height);
    const items=[];
    for(const obj of meshes){
      const geo=obj.geometry,pos=geo.getAttribute('position'),mat=Array.isArray(obj.material)?obj.material[0]:obj.material;
      if(!pos||mat.visible===false)continue;
      const color=mat.color||new THREE.Color('#8296ae');
      if(obj.userData.handle){
        const center=project(0,0,0,obj.matrixWorld),edge=project(.075,0,0,obj.matrixWorld);
        items.push({type:'point',depth:center[2]-.0004,p:center,r:Math.max(4,Math.hypot(edge[0]-center[0],edge[1]-center[1])),color:'#'+color.getHexString()});continue;
      }
      const points=Array.from({length:pos.count},(_,i)=>project(pos.getX(i),pos.getY(i),pos.getZ(i),obj.matrixWorld));
      if(obj.isLine){
        const step=obj.isLineSegments?2:1;
        for(let i=0;i<points.length-1;i+=step){const a=points[i],b=points[i+1];if(a[2]>1||b[2]>1)continue;const vc=geo.getAttribute('color'),lineColor=vc?new THREE.Color().fromBufferAttribute(vc,i).getHexString():color.getHexString();items.push({type:'line',depth:obj.type==='GridHelper'?2:(a[2]+b[2])/2-.00008,a,b,color:'#'+lineColor,width:obj.userData.lineWidth||1,dashed:mat.isLineDashedMaterial});}
        continue;
      }
      if(!obj.isMesh)continue;
      const index=geo.index,normals=geo.getAttribute('normal'),count=index?index.count:pos.count,base=color.clone().convertLinearToSRGB().toArray();
      normalMatrix.getNormalMatrix(obj.matrixWorld);
      for(let k=0;k<count;k+=3){
        const ids=index?[index.getX(k),index.getX(k+1),index.getX(k+2)]:[k,k+1,k+2],p=ids.map(i=>points[i]);
        if(p.some(a=>a[2]>1||a[2]<-1))continue;
        let shade=.85;
        if(normals){normal.set(0,0,0);for(const i of ids)normal.add(new THREE.Vector3(normals.getX(i),normals.getY(i),normals.getZ(i)));normal.applyMatrix3(normalMatrix).normalize();shade=.60+.40*Math.abs(normal.dot(light));}
        const rgb=base.map(n=>Math.round(THREE.MathUtils.clamp(n*shade,0,1)*255));
        items.push({type:'triangle',depth:p.reduce((a,b)=>a+b[2],0)/3,p,color:`rgb(${rgb.join(',')})`,opacity:mat.transparent?mat.opacity:1});
      }
    }
    items.sort((a,b)=>b.depth-a.depth);
    for(const it of items){
      ctx.globalAlpha=it.opacity??1;
      if(it.type==='triangle'){
        ctx.beginPath();ctx.moveTo(it.p[0][0],it.p[0][1]);ctx.lineTo(it.p[1][0],it.p[1][1]);ctx.lineTo(it.p[2][0],it.p[2][1]);ctx.closePath();ctx.fillStyle=it.color;ctx.fill();
        if(it.opacity===1){ctx.strokeStyle=it.color;ctx.lineWidth=.55;ctx.setLineDash([]);ctx.stroke();}
      }else if(it.type==='line'){
        ctx.beginPath();ctx.moveTo(it.a[0],it.a[1]);ctx.lineTo(it.b[0],it.b[1]);ctx.strokeStyle=it.color;ctx.lineWidth=it.width;ctx.setLineDash(it.dashed?[5,4]:[]);ctx.stroke();
      }else{
        ctx.beginPath();ctx.arc(it.p[0],it.p[1],it.r,0,Math.PI*2);ctx.fillStyle=it.color;ctx.fill();ctx.strokeStyle='#f7eed2';ctx.lineWidth=.7;ctx.setLineDash([]);ctx.stroke();
      }
    }
    ctx.globalAlpha=1;ctx.setLineDash([]);
  }
  return {domElement:canvas,isSoftwareRenderer:true,setPixelRatio(n){ratio=Math.min(n,1.5);},setSize(w,h){width=Math.max(1,w);height=Math.max(1,h);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);stamp='';},render,dispose(){canvas.remove();}};
}
