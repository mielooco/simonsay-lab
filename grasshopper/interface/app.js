const $=id=>document.getElementById(id);
const lessons=[
{title:'開啟與視窗',en:'Rhino + Grasshopper',topic:'先找到入口',headline:'點綠色圖示，開啟 Grasshopper。',description:'在 Rhino 的 Standard（標準）工具列，點綠色 Grasshopper 圖示，即可開啟編輯視窗。Grasshopper 畫布安排流程，Rhino 視窗預覽生成的幾何。',takeaway:'Grasshopper 與 Rhino 一起工作。先分清楚：流程在哪裡、形體在哪裡。',task:'點圖片上方的「Grasshopper 圖示」放大位置，再按「全圖」看它在工具列中的位置。',caption:'用圖示開啟 Grasshopper',note:'另一個入口是 Tools（工具）› Grasshopper；也可在 Rhino 指令列輸入 Grasshopper。工具列位置依個人配置而異。',image:'windows-reference.png',size:[1463,450],view:[0,0,1463,450],box:[1345,135,65,65]},
{title:'介面地圖與選單',en:'Interface map / Menu',topic:'整份流程的設定',headline:'開檔、存檔與畫面設定，在這裡。',description:'主選單位於 Grasshopper 視窗上方。File 管理檔案；Edit 處理編輯；View 與 Display 提供畫布、名稱、圖示及顯示選項。',takeaway:'先認得 File、Edit、View、Display；不用一次記住每個選項。',task:'找到 File 與 Display。之後遇到存檔或切換圖示顯示，就知道先從哪裡找。',caption:'Grasshopper 主選單列',note:'參照圖中的 File、Edit、View、Display、Solution、Help 是主選單；下方 Prm、Math、Set 等是工具分類。',image:'interface-reference.png',size:[2976,1600],view:[0,0,1300,700],box:[13,62,2180,63]},
{title:'分類與找工具',en:'Find a tool',topic:'找參數與單元',headline:'先看分類，再找需要的工具。',description:'工具依用途放在不同分類：Params 放參數，Math 是數學，Curve 是曲線，Surface 是曲面。圖中部分名稱顯示為縮寫，例如 Prm、Crv、Srf。',takeaway:'上排切換分類，下排是該分類的工具。額外安裝的外掛，也可能增加分類標籤。',task:'找到 Prm 與 Crv，再看下方的 Input 群組。數值滑桿的工具路徑是 Params › Input › Number Slider。',caption:'分類標籤與工具面板',note:'此圖含外掛標籤。初學先認識 Params、Math、Curve、Surface；你的排列可能與參照圖不同。',image:'interface-reference.png',size:[2976,1600],view:[0,87,1650,850],box:[13,128,2190,205]},
{title:'畫布操作',en:'Canvas navigation',topic:'安排建模流程的地方',headline:'這片工作區，就是畫布。',description:'把參數和單元放上畫布，再用連線建立它們的關係。平移與縮放只是改變你觀看流程的方式，並不會改變幾何的尺寸。',takeaway:'Grasshopper 畫布看流程，Rhino 視窗看幾何。兩邊的縮放，各自控制自己的畫面。',task:'試著用上方按鈕或滾輪放大圖片，再拖曳平移。按「全圖」回到總覽。實際 Grasshopper 可用滑鼠右鍵拖曳平移畫布。',caption:'完整畫布與畫布工具列',note:'本頁以拖曳平移參照圖；實際 Grasshopper 以滑鼠右鍵拖曳平移、滾輪縮放。畫布工具列中的縮放比例控制的是流程畫面。',image:'interface-reference.png',size:[2976,1600],view:[0,0,2220,1600],box:[14,425,2190,1120]},
{title:'參數、單元與連線',en:'Parameters / Components / Wires',topic:'一條完整的資料流程',headline:'從數字到一個圓。',description:'先用參數提供數字，再由單元建立圓，透過連線傳遞資料，最後到 Rhino 查看預覽。',takeaway:'參數與單元的角色不同；連線讓資料在它們之間傳遞。',task:'依序切換參數、單元、連線與預覽，用同一份流程觀察它們的關係。',caption:'一條流程，四個觀察重點',note:'可操作示意。',example:true}
];
const areas=[
{n:1,name:'主選單列',en:'Main menu',box:[13,62,625,63],view:[0,0,1150,620],description:'這一列是 File、Edit、View、Display、Solution、Help。用來管理檔案、編輯流程、調整顯示與控制運算。',takeaway:'這是整份 Grasshopper 文件的操作選單，不是放置單元的工具分類。',task:'點下方的英文選單名稱，查看每一項主要做什麼。'},
{n:2,name:'文件切換',en:'File browser',box:[2045,62,160,63],view:[1540,0,680,550],description:'右上角顯示目前開啟的 Grasshopper 文件名稱。圖中的 unnamed 表示尚未命名；開啟多份文件時，可從這裡切換。',takeaway:'這裡切換的是 Grasshopper 流程文件，不是 Rhino 模型，也不是圖層。',task:'找到右上角的 unnamed，再點「1 主選單列」比較它與 File 的位置。'},
{n:3,name:'工具分類',en:'Component panels',box:[13,128,2190,205],view:[0,87,1650,850],description:'上排標籤依用途分組，例如 Params、Math、Curve、Surface；下方面板列出該分類的參數與單元。點分類後，再從面板找工具。',takeaway:'Params 是參數、Math 是數學、Curve 是曲線、Surface 是曲面。圖片中的 Prm、Crv、Srf 是縮寫。',task:'先找 Prm，再看下方的 Input 群組。Number Slider 的路徑是 Params › Input › Number Slider。'},
{n:4,name:'畫布',en:'Canvas',box:[14,425,2190,1120],view:[0,0,2220,1600],description:'放置參數、單元與連線的工作區。你在這裡安排資料如何一步步變成幾何，生成的結果則到 Rhino 視窗查看。',takeaway:'畫布看流程，Rhino 看形體。縮放畫布不會改變幾何尺寸。',task:'試著放大圖片，再拖曳平移。真正的 Grasshopper 以右鍵拖曳平移畫布，滾輪縮放。'},
{n:5,name:'畫布工具列',en:'Canvas toolbar',box:[13,360,2190,65],view:[0,280,2220,700],description:'畫布上方這一排是常用操作捷徑：左側有開檔、存檔、縮放比例與縮放範圍；右側提供幾何預覽的顯示控制。',takeaway:'圖中的 118% 是畫布的顯示倍率，不是模型的尺寸或縮放比例。',task:'找出資料夾、磁碟片與 118% 欄位，分別對應開檔、存檔與畫布縮放。'},
{n:6,name:'快顯選單',en:'Radial menu',box:[950,650,480,470],view:[700,490,1000,800],description:'圖中央的環形圖示是快顯選單，集合部分常用操作，例如群組、啟用或停用、顯示或隱藏，以及 Bake 等。',takeaway:'這是臨時叫出的操作選單，不是畫布上永久存在的單元；目前先認識它的位置與用途。',task:'比較環形選單與上方主選單。兩者都提供操作，畫布上的參數與單元則負責建模流程。'}
];
const menus=[
{name:'File',zh:'檔案',description:'建立、開啟與儲存 Grasshopper 文件，也能存取相關資料夾。',takeaway:'Grasshopper 流程通常存成 .gh；Rhino 模型的 .3dm 檔需要另外儲存。',task:'要儲存這份流程時，先找 File，而不是 Rhino 的 File。'},
{name:'Edit',zh:'編輯',description:'處理復原、重做、剪下、複製、貼上等畫布物件的編輯操作。',takeaway:'在流程中放錯參數或單元時，可以用復原退回上一個操作。',task:'先記住：Undo 是復原，Redo 是重做。'},
{name:'View',zh:'檢視',description:'調整畫布的觀看方式與介面項目，例如畫布工具列的顯示。',takeaway:'View 著重於怎麼觀看或瀏覽流程；不會直接改變建模的輸入數值。',task:'之後若畫布工具列不見了，可以先到 View 找顯示設定。'},
{name:'Display',zh:'顯示',description:'管理單元的圖示或名稱、連線樣式等顯示方式。',takeaway:'教學畫面與你的圖示、名稱看起來不同時，先檢查 Display 設定。',task:'認識 Draw Icons（圖示顯示）與 Draw Fancy Wires（連線樣式）這兩個選項名稱。'},
{name:'Solution',zh:'運算',description:'控制流程是否重新計算，以及與解算、結果預覽相關的設定。',takeaway:'參數改了但幾何沒有更新時，除了檢查連線，也可以確認運算是否啟用。',task:'先把 Solution 理解為控制流程運算的地方，後續再逐一介紹選項。'},
{name:'Help',zh:'說明',description:'開啟 Grasshopper 的說明文件與相關學習資訊。',takeaway:'遇到不熟悉的操作，可以從 Help 找說明；個別單元也有自己的說明入口。',task:'先找到 Help 的位置，之後遇到新單元時再學會查它的說明。'}
];

const toolGuides=[
{name:'分類標籤',box:[13,128,2190,48],view:[0,80,1650,650],headline:'先依目的，選一個分類。',description:'Params 放參數；Math 處理數學；Curve 建立或處理曲線；Surface 建立或處理曲面。點上排分類後，下方工具面板會跟著切換。',takeaway:'圖中的 Prm、Crv、Srf 是縮寫。找工具時，同時記住英文名稱與它所屬的分類。',task:'在圖中找出 Prm、Math、Crv、Srf。本頁標示它們的位置，之後在 Grasshopper 裡練習切換。',note:'先選分類，再看下方工具。參照圖目前停在 Params 分類，旁邊的外掛標籤可先略過。'},
{name:'工具群組',box:[13,175,1115,158],view:[0,110,1200,650],headline:'一個分類裡，還分成小群組。',description:'Params 面板中可看到 Geometry、Primitive、Input、Util 等群組。Geometry 放幾何參數；Input 放數值滑桿等輸入工具。群組名稱位於圖示下方的深色列。',takeaway:'工具路徑有層次：分類 › 群組 › 工具。不要把上排分類與下方群組混在一起。',task:'找到上方的 Prm，再找下方的 Geometry 與 Input。觀察它們位在不同高度。',note:'圖中的 Geometry、Primitive、Input、Util 是 Params 底下的群組，不是另一排分類標籤。'},
{name:'展開面板',box:[2240,60,715,1030],view:[2200,0,776,1130],headline:'展開群組，才會看到完整清單。',description:'工具面板不一定顯示群組中的所有工具。點群組下方的展開列，可查看完整清單。右圖示範 Params › Geometry 展開後的 Point、Circle、Curve 等參數。',takeaway:'這份清單屬於 Params；其中的 Circle 是保存圓資料的參數。建立圓的 Circle 單元則在 Curve 分類。',task:'在展開清單中找到 Point 與 Circle，再比較「參數」與後面練習中「建立圓的單元」的用途。',note:'這張圖的右側已展開 Geometry 面板；圖中紅色 3 的兩個位置，分別是原工具面板與展開後的清單。'},
{name:'找數值滑桿',box:[580,175,305,158],view:[300,105,900,650],headline:'用一條工具路徑，找到第一個參數。',description:'Number Slider（數值滑桿）的工具路徑是 Params › Input › Number Slider。先切到 Params，再展開 Input 群組，找到數值滑桿。',takeaway:'Number Slider 是提供數字的參數。它可以控制半徑、距離或數量，取決於連到哪個單元的輸入端。',task:'先在圖中定位 Input 群組。打開實際 Grasshopper 時，照 Params › Input › Number Slider 的順序找一次。',note:'位置導覽：Params（圖中 Prm）› Input › Number Slider。也可雙擊畫布，輸入 Number Slider 搜尋。'}
];
const canvasGuides=[
{name:'平移畫布',box:[14,425,2190,1120],view:[0,0,2220,1600],headline:'拖動畫布，換一個觀看位置。',description:'實際 Grasshopper 以滑鼠右鍵拖曳平移畫布。流程超出視窗時，可以移動畫面查看其他區域，參數、單元與連線的關係會維持原樣。',takeaway:'平移畫布只改變觀看位置。拖動單元本身，則是在重新安排流程的版面。',task:'在中央圖片按住右鍵拖曳，試著把工具列移到旁邊。本頁也接受一般拖曳。',note:'操作練習：在圖片上拖曳平移。這是介面參照圖，先練習如何瀏覽畫布。'},
{name:'縮放畫布',box:[130,360,315,65],view:[0,0,2220,1600],headline:'放大看接點，縮小看整份流程。',description:'滾動滑鼠滾輪可放大或縮小畫布；也能使用本頁的 ＋、− 按鈕。放大適合看名稱與接點，縮小適合看單元之間的整體關係。',takeaway:'畫布的縮放不會改變幾何尺寸；真正要改圓的大小，需要修改半徑資料。',task:'先按 ＋ 兩次觀察單元，再按 −。圖片中的 118% 是原截圖的畫布倍率，放大圖片時它不會重新計算。',note:'操作練習：滾輪或 ＋／− 控制本頁圖片縮放。要改造型尺寸，需調整參數，而不是縮放畫布。'},
{name:'找回整份流程',box:[451,360,75,65],view:[0,280,1000,700],headline:'畫面迷路時，先回到全貌。',description:'畫布工具列的縮放範圍按鈕，可協助把流程放回可見範圍。這張圖中的圖示外形像四個向外的角；本頁以「全圖」按鈕練習回到介面總覽。',takeaway:'先回到全貌，再找要編輯的單元。比持續拖曳尋找更容易掌握流程位置。',task:'先放大並平移圖片，再按上方的「全圖」。觀察畫面如何回到完整介面。',note:'操作練習：放大或平移之後，按「全圖」回到總覽；實際軟體使用畫布工具列的縮放範圍功能。'},
{name:'畫布工具列',box:[13,360,2190,65],view:[0,280,2220,700],headline:'看清楚幾個常用的捷徑。',description:'資料夾圖示用來開檔，磁碟片圖示用來存檔；百分比欄位顯示畫布倍率，旁邊是縮放範圍等瀏覽工具。右側還有幾何預覽顯示控制。',takeaway:'先認識開檔、存檔與瀏覽工具；幾何預覽的開關會在下一頁搭配完整流程一起練習。',task:'依序找出資料夾、磁碟片、百分比與四角圖示，說出它們分別做什麼。',note:'畫布工具列是常用功能捷徑，與最上方 File、Edit 等主選單列不同。'}
];
const flowGuides=[
{name:'參數',headline:'參數先提供一個數字。',description:'Number Slider 是數值滑桿參數。在設定範圍內調整數字，再從右側端口輸出給其他單元使用。',takeaway:'參數提供、儲存或傳遞資料；這裡提供的是一個數字，尚未指定它代表什麼尺寸。',task:'拖動下方滑桿，看它輸出的數值。接著點「單元」，了解這個數字如何變成圓的半徑。'},
{name:'單元',headline:'Circle 單元用資料建立圓。',description:'Circle 是運算元件，簡稱單元。左側 P 接平面、R 接半徑，右側 C 輸出圓。此例保留預設平面，用滑桿提供半徑。',takeaway:'Circle 單元執行建立圓的工作；Params 分類裡的 Circle 參數則用來保存或傳遞圓資料。',task:'找到 R 與 C，分別說出它們是輸入還是輸出，再調整半徑觀察圓。'},
{name:'連線與端口',headline:'把數字送到半徑輸入端。',description:'滑桿右側端口送出數字，連線把數字傳到 Circle 左側的 R。多數單元左側接收輸入、右側輸出結果。',takeaway:'數字的用途由它連到哪個輸入端決定。接到 R，這個數字才成為圓的半徑。',task:'中斷連線後，再調整滑桿。圓是否仍受它控制？重新連接後，再比較一次。'},
{name:'Rhino 預覽',headline:'流程在畫布，圓顯示在 Rhino。',description:'Circle 的圓形結果會在 Rhino 視窗預覽。本頁的右側小視窗示意 Rhino 的俯視圖，對照左側畫布上的資料流程。',takeaway:'隱藏預覽只會讓圓看不見，不會刪除資料，也不會改變半徑。',task:'取消「顯示預覽」，再重新勾選。確認圓恢復顯示，半徑數值仍保持一致。'}
];

let detailIndex=0;
let active=0,view=[0,0,1463,450],radius=3,connected=true,preview=true,drag=null,dragged=false;
const key='simon-gh-interface-v1';
function read(k,fallback){try{return JSON.parse(localStorage.getItem(key+k))??fallback;}catch{return fallback;}}
function write(k,val){try{localStorage.setItem(key+k,JSON.stringify(val));return true;}catch{return false;}}
if(!read('-merged-flow-notes',false)){const first=read('-note-4',''),second=read('-note-5','');if(second&&!first.includes(second))write('-note-4',[first,second].filter(Boolean).join('\n\n'));write('-merged-flow-notes',true);}
let visited=new Set(read('-visited',[]).map(i=>i===5?4:i).filter(i=>Number.isInteger(i)&&i>=0&&i<lessons.length));
function applyView(){$('reference').setAttribute('viewBox',view.join(' '));}
function fit(){view=[...lessons[active].view];applyView();}
function region(x,y,w,h,text,action){const ns='http://www.w3.org/2000/svg';const g=document.createElementNS(ns,'g');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',text);const r=document.createElementNS(ns,'rect');for(const [k,v]of Object.entries({x,y,width:w,height:h,rx:8,class:'region'}))r.setAttribute(k,v);const c=document.createElementNS(ns,'circle');for(const [k,v]of Object.entries({cx:x+34,cy:y+34,r:25,class:'tag'}))c.setAttribute(k,v);const t=document.createElementNS(ns,'text');t.setAttribute('x',x+34);t.setAttribute('y',y+46);t.setAttribute('text-anchor','middle');t.textContent=text.split(' ')[0];g.append(r);g.onclick=e=>{e.stopPropagation();if(!dragged)action();};g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action();}};$('hotspots').append(g);}
function select(i){active=i;visited.add(i);write('-visited',[...visited]);const l=lessons[i];document.querySelectorAll('.chapter').forEach((b,j)=>{b.classList.toggle('active',j===i);if(j===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});for(const name of ['headline','description','takeaway','task','topic'])$(name).textContent=l[name];$('lesson-title').textContent=l.title;$('counter').textContent=`介面導覽 ${i+1} / ${lessons.length}`;$('view-caption').textContent=l.caption;$('stage-note').textContent=l.note;$('prev').disabled=i===0;$('next').textContent=i===lessons.length-1?'回到第一節':'下一節';$('progress-text').textContent=`已瀏覽 ${visited.size} / ${lessons.length} 節`;$('progress-bar').style.width=visited.size/lessons.length*100+'%';$('note').value=read('-note-'+i,'');$('note-indicator').textContent=$('note').value?'已記錄':'';$('note-status').textContent='筆記儲存在目前瀏覽器。';$('reference').toggleAttribute('hidden',!!l.example);document.querySelector('.workspace').classList.toggle('example-mode',!!l.example);$('example').hidden=!l.example;$('stage-hint').hidden=!!l.example;document.querySelector('.view-buttons').hidden=!!l.example;$('hotspots').replaceChildren();$('launch-icon').hidden=i!==0;$('area-guide').hidden=i!==1;$('detail-guide').hidden=i<2;$('menu-guide').hidden=true;document.querySelector('.workspace').classList.toggle('map-mode',i>=1);if(l.example){updateExample();buildDetailGuide();}else{$('reference-image').setAttribute('href','assets/'+l.image);$('reference-image').setAttribute('width',l.size[0]);$('reference-image').setAttribute('height',l.size[1]);for(const [j,n]of ['x','y','width','height'].entries())$('focus-box').setAttribute(n,l.box[j]);fit();if(i===0){region(7,80,430,100,'1 指令列',()=>{$('stage-note').textContent='指令列：在 Rhino 輸入 Grasshopper，按 Enter 開啟編輯視窗。';});region(1345,135,65,65,'2 工具圖示',focusLaunch);}else if(i===1){buildAreaGuide();}else{buildDetailGuide();}}if(innerWidth<=1000)document.querySelector('.chapter.active').scrollIntoView({block:'nearest',inline:'center'});}
function zoom(factor){if(lessons[active].example)return;const cx=view[0]+view[2]/2,cy=view[1]+view[3]/2,base=active===0?1463:2220;const width=Math.max(base/4,Math.min(base*1.4,view[2]*factor)),height=view[3]*width/view[2];view=[cx-width/2,cy-height/2,width,height];applyView();}
lessons.forEach((l,i)=>{const b=document.createElement('button');b.className='chapter';b.innerHTML=`<strong>${l.title}</strong><small>${l.en}</small>`;b.onclick=()=>select(i);$('chapters').append(b);});
$('prev').onclick=()=>select(Math.max(0,active-1));$('next').onclick=()=>select((active+1)%lessons.length);$('fit').onclick=()=>{view=active===0?[0,0,1463,450]:active===2?[0,0,2976,1600]:[0,0,2220,1600];applyView();};$('zoom-in').onclick=()=>zoom(.8);$('zoom-out').onclick=()=>zoom(1.25);$('reset').onclick=()=>{if(lessons[active].example){radius=3;connected=true;preview=true;$('radius').value=3;$('preview-visible').checked=true;updateExample();$('example-feedback').textContent='已恢復示意的半徑、連線與預覽。';}else if(active===1){const chosen=$('area-guide').querySelector('.active');showArea(chosen?+chosen.dataset.area:1);}else if(active===2||active===3){showDetail(detailIndex);}else{fit();$('stage-note').textContent=lessons[active].note;}};
$('reference').addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?1.15:.87);},{passive:false});
function svgPoint(e){const p=$('reference').createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform($('reference').getScreenCTM().inverse());}
$('reference').oncontextmenu=e=>e.preventDefault();
$('reference').onpointerdown=e=>{dragged=false;drag={p:svgPoint(e),client:[e.clientX,e.clientY],id:e.pointerId};};$('reference').onpointermove=e=>{if(!drag)return;if(!dragged&&Math.hypot(e.clientX-drag.client[0],e.clientY-drag.client[1])<4)return;if(!dragged){dragged=true;$('reference').setPointerCapture(e.pointerId);}const p=svgPoint(e);view[0]+=drag.p.x-p.x;view[1]+=drag.p.y-p.y;applyView();};$('reference').onpointerup=$('reference').onpointercancel=()=>{drag=null;};
$('stage').onkeydown=e=>{if(lessons[active].example||e.target!==$('stage'))return;const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(moves[e.key]){e.preventDefault();view[0]+=moves[e.key][0]*view[2]*.08;view[1]+=moves[e.key][1]*view[3]*.08;applyView();}};
function updateExample(){const r=connected?radius:1;$('radius-value').textContent=radius.toFixed(1);$('preview-circle').setAttribute('r',r*21);$('preview-circle').style.visibility=preview?'visible':'hidden';$('wire').style.visibility=connected?'visible':'hidden';$('connection').textContent=connected?'中斷連線':'重新連接';$('connection').setAttribute('aria-pressed',String(connected));$('preview-value').textContent=preview?`圓的半徑：${r.toFixed(1)}`:`預覽已隱藏；半徑仍為 ${r.toFixed(1)}`;$('example-feedback').textContent=connected?`滑桿輸出 ${radius.toFixed(1)}，傳入 Circle 的 R，控制圓的半徑。`:'滑桿已中斷連線；圓使用預設半徑 1，調整滑桿不再影響它。';}
$('radius').oninput=e=>{radius=+e.target.value;updateExample();};$('connection').onclick=()=>{connected=!connected;updateExample();};$('preview-visible').onchange=e=>{preview=e.target.checked;updateExample();};
function inspect(type){$('example-feedback').textContent=type==='parameter'?'Number Slider 是參數：在設定範圍中選一個數字，從右側端口輸出。':'Circle 是運算元件，簡稱單元：左側的 P 接平面、R 接半徑；右側的 C 輸出圓。';}
for(const id of ['inspect-parameter','inspect-component']){const el=$(id);el.onclick=()=>{if(active===4)showDetail(id==='inspect-parameter'?0:1);else inspect(id==='inspect-parameter'?'parameter':'component');};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}};}
$('note').oninput=()=>{const value=$('note').value,ok=write('-note-'+active,value);$('note-indicator').textContent=value?'已記錄':'';$('note-status').textContent=ok?'已儲存在目前瀏覽器。':'目前瀏覽器無法保存，請先複製筆記。';};
function buildDetailGuide(){
 const list=active===2?toolGuides:active===3?canvasGuides:flowGuides;
 $('detail-guide').replaceChildren();
 for(const [i,g]of list.entries()){const b=document.createElement('button');b.textContent=g.name;b.onclick=()=>showDetail(i);$('detail-guide').append(b);}
 if(active===2){region(13,128,2190,48,'分類標籤',()=>showDetail(0));region(13,175,1115,158,'工具群組',()=>showDetail(1));region(13,300,430,33,'展開 Geometry 面板',()=>showDetail(2));region(580,175,305,158,'Input 數值滑桿群組',()=>showDetail(3));}
 if(active===3){region(14,425,2190,1120,'畫布操作區',()=>showDetail(0));region(13,360,2190,65,'畫布工具列位置',()=>showDetail(3));region(451,360,75,65,'縮放範圍圖示位置',()=>showDetail(2));}
 showDetail(0);
}
function showDetail(i){
 detailIndex=i;const list=active===2?toolGuides:active===3?canvasGuides:flowGuides,g=list[i];
 for(const [j,b]of [...$('detail-guide').children].entries()){b.classList.toggle('active',j===i);b.setAttribute('aria-pressed',String(j===i));}
 for(const name of ['headline','description','takeaway','task'])$(name).textContent=g[name];
 $('topic').textContent=active===2?'工具分類與尋找':active===3?'畫布瀏覽練習':'一條完整的資料流程';$('view-caption').textContent=(active===2?'工具導覽':active===3?'畫布操作':'資料流程')+'：'+g.name;
 $('menu-guide').hidden=true;
 if(g.box){view=[...g.view];applyView();for(const [j,k]of ['x','y','width','height'].entries())$('focus-box').setAttribute(k,g.box[j]);$('stage-note').textContent=g.note;}
 else{
 $('stage-note').textContent='依序認識參數、單元、連線與預覽；四個步驟共用同一份流程，調整與連線狀態會保留。';
 $('inspect-parameter').classList.toggle('flow-focus',i===0);$('inspect-component').classList.toggle('flow-focus',i===1);$('wire').classList.toggle('flow-focus',i===2);document.querySelector('.rhino-preview').classList.toggle('flow-focus',i===3);
 updateExample();
 }
}

function buildAreaGuide(){
 $('area-guide').replaceChildren();
 for(const a of areas){const b=document.createElement('button');b.dataset.area=a.n;b.innerHTML=`<b>${a.n}</b><span>${a.name}</span>`;b.setAttribute('aria-label',`${a.n} ${a.name}`);b.onclick=()=>showArea(a.n);$('area-guide').append(b);const [x,y,w,h]=a.box;region(x,y,w,h,`圖中 ${a.n}：${a.name}`,()=>showArea(a.n));}
 showArea(active===1?1:active===2?3:4);
}
function showArea(n){
 const a=areas[n-1];view=[...a.view];applyView();for(const [j,k]of ['x','y','width','height'].entries())$('focus-box').setAttribute(k,a.box[j]);
 for(const b of $('area-guide').children){const on=+b.dataset.area===n;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));}
 $('topic').textContent=`圖中 ${n} · ${a.en}`;$('headline').textContent=`${n} ${a.name}`;$('description').textContent=a.description;$('takeaway').textContent=a.takeaway;$('task').textContent=a.task;$('view-caption').textContent=`圖中數字對照：${n} ${a.name}`;$('stage-note').textContent=`${n} ${a.name}：${a.description}`;
 $('menu-guide').hidden=n!==1;
 if(n===1){$('menu-guide').replaceChildren();for(const [i,m]of menus.entries()){const b=document.createElement('button');b.innerHTML=`<strong>${m.name}</strong><small>${m.zh}</small>`;b.onclick=()=>showMenu(i);$('menu-guide').append(b);}showMenu(0);}
}
function showMenu(i){const m=menus[i];$('headline').textContent=`${m.name} · ${m.zh}`;$('description').textContent=m.description;$('takeaway').textContent=m.takeaway;$('task').textContent=m.task;for(const [j,b]of [...$('menu-guide').children].entries()){b.classList.toggle('active',i===j);b.setAttribute('aria-pressed',String(i===j));}$('stage-note').textContent=`圖中 1 是主選單列。現在查看 ${m.name}（${m.zh}）：${m.description}`;}

select(0);

function focusLaunch(){view=[1020,15,443,380];applyView();$('stage-note').textContent='綠色 Grasshopper 圖示位於 Rhino 的 Standard（標準）工具列。左鍵點擊即可開啟 Grasshopper；按「全圖」看位置。';}
$('launch-icon').onclick=focusLaunch;
