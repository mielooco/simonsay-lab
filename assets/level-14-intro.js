(()=>{
const root=document.getElementById('l14-joins-v2'),canvases=[...root.querySelectorAll('canvas')],button=root.querySelector('[data-sweep]');let sweep=.5,raf=0;
const palette=()=>{const e=document.createElement('span');e.hidden=true;root.append(e);const get=n=>{e.style.color='var('+n+')';return getComputedStyle(e).color;};const p={fg:get('--foreground'),bg:get('--background'),muted:get('--muted-foreground'),grid:get('--border'),a:get('--viz-series-1'),b:get('--viz-series-2'),font:getComputedStyle(root).font};e.remove();return p;};
// Both patches are extrusions of the section z(x). At x=0 they share position.
// G0 changes first derivative, G1 matches first derivative, G2 also matches second derivative.
function shape(g,x){if(x<0)return[-.42*x*x+.32*x,-.84*x+.32,-.84];if(g===0)return[-.9*x-.42*x*x,-.9-.84*x,-.84];if(g===1)return[.32*x-1.38*x*x,.32-2.76*x,-2.76];return[.32*x-.42*x*x-.15*x*x*x,.32-.84*x-.45*x*x,-.84-.9*x];}
function stroke(ctx,ps,color,width=1,dash=[],alpha=1){ctx.beginPath();for(let i=0;i<ps.length;i++)i?ctx.lineTo(ps[i][0],ps[i][1]):ctx.moveTo(ps[i][0],ps[i][1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.globalAlpha=alpha;ctx.setLineDash(dash);ctx.stroke();ctx.globalAlpha=1;ctx.setLineDash([]);}
function paint(canvas){if(canvas.clientWidth<1)return;const g=+canvas.dataset.grade,w=canvas.clientWidth,h=canvas.clientHeight,d=Math.min(2,devicePixelRatio||1),ctx=canvas.getContext('2d'),p=palette();canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);ctx.font=p.font;ctx.lineJoin='round';const s=Math.min(w/3.05,80),project=(x,y,z)=>[w*.5+(x*.96+y*.38)*s,88+(x*.18-y*.42-z*.64)*s];
// Top: the same two patches in all three panels. Analytic normals drive the reflection.
for(let j=54;j>=0;j--){const y=-.74+j/54*1.48,y1=y+1.48/54;for(let i=0;i<110;i++){const x=-1+i/55,x1=x+1/55,xc=(x+x1)/2,[z,m]=shape(g,xc),color=xc<0?p.a:p.b,ps=[[x,y],[x1,y],[x1,y1],[x,y1]].map(([a,b])=>project(a,b,shape(g,a)[0]));ctx.beginPath();ps.forEach((q,k)=>k?ctx.lineTo(...q):ctx.moveTo(...q));ctx.closePath();ctx.fillStyle=color;ctx.globalAlpha=.18+.14/Math.sqrt(1+m*m);ctx.fill();const n=-m/Math.sqrt(1+m*m),target=-.8+1.6*sweep,highlight=Math.exp(-Math.pow((n-target)/.15,2));if(highlight>.015){ctx.fillStyle=p.fg;ctx.globalAlpha=.48*highlight;ctx.fill();}}}ctx.globalAlpha=1;
for(const y of[-.74,.74]){for(const side of[-1,1])stroke(ctx,Array.from({length:71},(_,i)=>{const x=side<0?-1+i/70:i/70;return project(x,y,shape(g,x)[0]);}),side<0?p.a:p.b,1.5);}
for(const x of[-1,1])stroke(ctx,[project(x,-.74,shape(g,x)[0]),project(x,.74,shape(g,x)[0])],x<0?p.a:p.b,1);
stroke(ctx,[project(0,-.74,0),project(0,.74,0)],p.fg,1,[3,4],.7);
ctx.fillStyle=p.fg;ctx.textAlign='center';const seam=project(0,.74,0);ctx.fillText('接縫',seam[0],seam[1]-12);
// Bottom: exact section of the surfaces above, with separate half-tangents at the same join.
const oy=h-62,scaleX=Math.min((w-38)/2,130),scaleZ=48,pt=x=>[w/2+x*scaleX,oy-shape(g,x)[0]*scaleZ];ctx.textAlign='left';ctx.fillStyle=p.muted;ctx.fillText('剖面',8,h-145);
stroke(ctx,[[w/2,h-137],[w/2,h-18]],p.grid,1,[3,5]);
for(const side of[-1,1])stroke(ctx,Array.from({length:91},(_,i)=>pt(side<0?-1+i/90:i/90)),side<0?p.a:p.b,2.5);
const mLeft=.32,mRight=g===0?-.9:.32,L=Math.min(44,w*.18);stroke(ctx,[[w/2-L,oy+mLeft*L*scaleZ/scaleX],[w/2,oy]],p.fg,1,[4,3]);stroke(ctx,[[w/2,oy],[w/2+L,oy-mRight*L*scaleZ/scaleX]],p.fg,1,[4,3]);
ctx.beginPath();ctx.arc(w/2,oy,3,0,Math.PI*2);ctx.fillStyle=p.fg;ctx.fill();
// Short curvature-comb teeth expose the jump that a tangent alone cannot reveal.
if(g>0){for(const x of[-.38,-.26,-.14,-.025,.025,.14,.26,.38]){const[,m,second]=shape(g,x),k=Math.abs(second)/Math.pow(1+m*m,1.5),q=pt(x),len=11*k,n=Math.hypot(m*scaleZ/scaleX,1);stroke(ctx,[q,[q[0]-m*scaleZ/scaleX/n*len,q[1]-len/n]],x<0?p.a:p.b,1,[],.8);}ctx.fillStyle=p.fg;ctx.textAlign='center';ctx.fillText(g===1?'短針突然變長：彎度改變':'接縫兩側短針等長：彎度一致',w/2,h-1);}else{ctx.fillStyle=p.fg;ctx.textAlign='center';ctx.fillText('兩條虛線方向不同 → 折角',w/2,h-1);}
}
function draw(){canvases.forEach(paint);}
button.onclick=()=>{cancelAnimationFrame(raf);if(matchMedia('(prefers-reduced-motion: reduce)').matches){sweep=sweep<.5?.7:.3;draw();return;}const start=performance.now();button.disabled=true;function tick(t){sweep=Math.min(1,(t-start)/3200);draw();if(sweep<1)raf=requestAnimationFrame(tick);else{button.disabled=false;root.querySelector('[data-status]').textContent='反光比較播放完成';}}raf=requestAnimationFrame(tick);};
function restore(s){if(s?.preview==='l14-join-comparison'&&Number.isFinite(s.sweep))sweep=Math.max(0,Math.min(1,s.sweep));}
draw();new ResizeObserver(draw).observe(root);new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['style','class','data-theme']});window.addEventListener('simon:l14-intro-visible',draw);
})();
