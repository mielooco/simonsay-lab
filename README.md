# Simon Fundamental Design Lab
### 造型基本設計實驗室

> 設計人，尋找造型的老靈魂

**🔗 課程入口 → [https://mielooco.github.io/SimonSay-lab/](https://mielooco.github.io/simonsay-lab/)**

---

## 關於這個課程

給正在學習造型設計的互動造型課程。  
每個 Level 都是一個可以動手玩的 3D 實驗室，從 R 角開始，理解形體的語言。

不需要安裝任何軟體，打開瀏覽器就能玩。  
支援手機與桌機，自動切換 UI 佈局。

---

## 課程目錄

| Level | 標題 | 副標 |
|-------|------|------|
| [Level 01](https://mielooco.github.io/simonsay-lab/level-1/) | 正方體與圓角 | 量體的基本變化 |
| [Level 02](https://mielooco.github.io/simonsay-lab/level-2/) | 圓角的交集 | 布林運算與交界線 |
| [Level 03](https://mielooco.github.io/simonsay-lab/level-3/) | 比例與圓角 | 長、寬、高的造型關係 |
| [Level 04](https://mielooco.github.io/simonsay-lab/level-4/) | 圓角的建構 | 截面與弧線掃描 |
| [Level 05](https://mielooco.github.io/simonsay-lab/level-5/) | 複合圓角 | 建模順序與造型變化 |
| [Level 06](https://mielooco.github.io/simonsay-lab/level-6/) | 斜角與切面 | 面的消長關係 |
| [Level 07](https://mielooco.github.io/simonsay-lab/level-7/) | 截面與輪廓 | 直筒、收分、鼓肚與收腰 |
| [Level 08](https://mielooco.github.io/simonsay-lab/level-8/) | 挖與切 | 球面挖凹、平面切削與多向堆疊 |
| Level 09 | 即將推出 | — |
| Level 10 | 即將推出 | — |

---

## 課程設計邏輯

```
L01 塊體感知        → 從零開始，最單純的R角與量體
L02 布林交集        → 不同方向R角碰撞的硬邊界
L03 比例與方向性     → 不同比例容器裡 R角在的視覺重量
L04 幾何精確        → 從近似升級為 CAD 真實邏輯
L05 複合路徑        → 建模順序如何決定造型氣質
L06 斜角截面        → Chamfer 的面積消長與交界協商
L07 截面與輪廓      → 固定底部，依序觀察頂部與中段截面的影響；高度可獨立調整
L08 挖與切          → 比較球面挖凹與平面切削，再從不同角落疊加最多三刀
```

---

## 使用方式

直接點上方的課程連結，用滑鼠（或手指）拖拉旋轉 3D 物件，拉動滑桿即時觀察造型變化。

- **桌機**：左側浮動控制面板
- **手機 / 平板**：底部抽屜 UI，自動偵測觸控裝置切換

---

Level 07 先顯示三步課前簡圖，點「開始實驗」進入操作，也可隨時「重看說明」。中段鼓收以直線為基準，回到 0 或切回收分可還原直線；「重置」恢復直筒、頂部 100%、中段鼓收 0、高度 130 與初始視角。

中段操作另有「不限制端部切線」開關：預設保留原收分的端部切線（頂底同尺寸時為垂直），開啟後端部方向可隨鼓收改變；兩種模式在鼓收為 0 時均還原直線，重置會關閉此開關。

第 3 步的 3D 視圖預設顯示切線虛線（第 1、2 步自動隱藏）：白色標示縱向輪廓，橘色標示上下端與中段的切線方向。標示隨模型參數與旋轉視角更新，可使用視圖右上方按鈕隱藏。

## 技術規格

- Three.js r128
- OrbitControls
- 純頂點位移算法（L01–L03）/ 弧線掃描建構（L04）/ 手動頂點建面（L06）
- 每個 Level 為獨立單檔 HTML，部署於 GitHub Pages
- RWD：`(hover: hover) and (pointer: fine)` 偵測桌機 / 觸控自動切換

---

*Simon Fundamental Design Lab © 2026*

第 08 課使用 Evan Wallace 的 MIT 授權 csg.js 進行幾何布林運算；原始授權見 `level-8/CSG-LICENSE.txt`。
