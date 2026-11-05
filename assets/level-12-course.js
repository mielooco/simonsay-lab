(()=>{
 'use strict';
 const course=document.getElementById('l12-course'),intro=course.querySelector('[data-course-intro]'),lab=course.querySelector('[data-course-lab]'),conclusion=course.querySelector('[data-course-conclusion]'),introTop=course.querySelector('[data-intro-top]'),introSide=course.querySelector('[data-intro-side]');
 let step=0,source=null,mode='intro';
 const titles=['長寬高決定範圍，輪廓決定裡面的造型','兩條輪廓，安排中間的過渡','同一個位置，需要寬度與高度一起定位','改變輪廓，也要一起觀察相鄰曲面'];
 const captions=['同樣的長寬高，仍能安排不同的背部、腰線與側壁。這個滑鼠從長 99、寬 60、高 39 mm 的範圍開始。','上視安排寬窄，側視安排高低。兩條輪廓共同約束中間的過渡曲面；相接位置必須互相對應。','以長向 56.5 mm 處為例：半寬約 26.5 mm，高度約 26.6 mm。兩個視圖讀到的是同一個空間點。','虛線保留原始輪廓，實線示範腰部收窄。進入實驗後，分別試 X、Z、Y，觀察變化如何逐步帶進曲面。'];
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function sample(curve,y){for(let i=1;i<curve.length;i++){const a=curve[i-1],b=curve[i];if(y>=a[1]&&y<=b[1]){const t=(y-a[1])/(b[1]-a[1]);return a.map((v,k)=>v+t*(b[k]-v));}}return curve[0];}
 function draw(canvas,kind){if(!source||mode!=='intro'||step===0)return;const w=canvas.getBoundingClientRect().width;if(w<1)return;const scale=(w-60)/99,span=kind==='top'?64:42,h=58+span*scale,d=Math.min(2,devicePixelRatio||1);canvas.style.height=h+'px';canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);const c=canvas.getContext('2d');c.setTransform(d,0,0,d,0,0);c.font='13px "PingFang TC",sans-serif';const left=36,top=25,base=h-33,x=y=>left+y*scale,v=z=>kind==='top'?top+(32-z)*scale:base-z*scale,xy=p=>[x(p[1]),v(kind==='top'?p[0]:p[2])];
  function line(points,color,width=1,dashed=false){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dashed?[4,4]:[]);c.stroke();c.setLineDash([]);}
  line([[left,top],[left,base],[w-24,base]],'#394345');
  for(const key of['base','crown','upper','lower']){if(kind==='top'&&key==='crown')continue;for(const sign of(kind==='top'?[-1,1]:[1])){
   const points=source[key].map(p=>[sign*p[0],p[1],p[2]]);line(points.map(xy),key==='lower'?'#00ffcc':key==='upper'?'#ff75b8':'#667174',key==='base'||key==='crown'?1:1.6,step===3&&key==='lower');
   if(step===3&&key==='lower'){const narrowed=points.map(p=>{const t=p[1]<56.5?(p[1]-24)/(56.5-24):(84.5-p[1])/(84.5-56.5),u=clamp(t,0,1),weight=u*u*(3-2*u);return[p[0]*(1-.25*weight),p[1],p[2]];});line(narrowed.map(xy),'#00ffcc',2);}
  }}
  if(step===2){const point=sample(source.lower,56.5),p=xy(point);line([[p[0],top],[p[0],base]],'#ffaa00',1,true);c.beginPath();c.arc(...p,4.5,0,Math.PI*2);c.fillStyle='#ffaa00';c.fill();c.fillStyle='#eee';c.textAlign='left';c.fillText('P',p[0]+8,p[1]-9);c.textAlign='right';c.fillText(kind==='top'?'半寬 26.5 mm':'高度約 26.6 mm',w-24,h-10);}
  c.fillStyle='#aaa';c.textAlign='left';c.fillText('0',left,base+18);c.textAlign='right';c.fillText('前後 99 mm',w-24,base+18);
 }
 function redraw(){draw(introTop,'top');draw(introSide,'side');}
 function showStep(value){step=clamp(value,0,3);course.querySelector('[data-intro-count]').textContent=String(step+1).padStart(2,'0')+' / 04';course.querySelector('[data-intro-title]').textContent=titles[step];course.querySelector('[data-intro-caption]').textContent=captions[step];course.querySelector('[data-reference]').hidden=step!==0;course.querySelector('[data-intro-views]').hidden=step===0;for(const b of course.querySelectorAll('[data-intro-step]'))b.setAttribute('aria-pressed',String(Number(b.dataset.introStep)===step));course.querySelector('[data-course-action="prev"]').disabled=step===0;course.querySelector('[data-course-action="next"]').disabled=step===3;redraw();}
 function showMode(next){mode=next;intro.hidden=next!=='intro';lab.hidden=next!=='lab';conclusion.hidden=next!=='conclusion';if(next==='intro'){showStep(0);}if(next==='lab')window.dispatchEvent(new Event('simon:l12-visible'));course.scrollIntoView({block:'start',behavior:'instant'});}
 for(const b of course.querySelectorAll('[data-intro-step]'))b.addEventListener('click',()=>showStep(Number(b.dataset.introStep)));
 for(const b of course.querySelectorAll('[data-course-action]'))b.addEventListener('click',()=>{switch(b.dataset.courseAction){case'prev':showStep(step-1);break;case'next':showStep(step+1);break;case'enter':showMode('lab');break;case'review':showMode('intro');break;case'finish':showMode('conclusion');break;}});
 window.addEventListener('simon:l12-ready',event=>{source=event.detail.source;for(const b of course.querySelectorAll('[data-course-action="enter"]')){b.disabled=false;b.textContent=b.closest('[data-course-conclusion]')?'返回實驗':'開始實驗 →';}redraw();});
 new ResizeObserver(redraw).observe(intro);showStep(0);
})();
