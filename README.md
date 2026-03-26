# Simon Fundamental Design Lab
### 造型基礎實驗室

> 設計人，尋找造型的老靈魂

**🔗 課程入口 → [https://mielooco.github.io/SimonSay-lab/](https://mielooco.github.io/simonsay-lab/)**

---

## 關於這個課程

給正在學習造型設計的互動造型課程。  
每個 Level 都是一個可以動手玩的 3D 實驗室，基礎幾何開始，理解形體的語言。

不需要安裝任何軟體，打開瀏覽器就能玩。  
支援手機與桌機，自動切換 UI 佈局。

---

## 課程目錄

| Level | 主題 | 概念 |
|-------|------|------|
| [Level 01](https://mielooco.github.io/SimonSay-lab/level-1/) | 正方體幾何與 R 角的關係 | Fillet / Radius / Volume |
| [Level 02](https://mielooco.github.io/SimonSay-lab/level-2/) | 布林運算的邏輯 | Boolean / Hard Edge / Intersection |
| [Level 03](https://mielooco.github.io/SimonSay-lab/level-3/) | 比例與方向性 R 角 | Proportion / Directional R / Aspect Ratio |
| [Level 04](https://mielooco.github.io/SimonSay-lab/level-4/) | 幾何精確 Fillet — 弧線掃描建構 | Arc Sweep / Exact Fillet / Segments |
| [Level 05](https://mielooco.github.io/SimonSay-lab/level-5/) | 複合路徑倒角與建模順序的邏輯 | Feature Order / Compound Fillet / Boolean |
| [Level 06](https://mielooco.github.io/SimonSay-lab/level-6/) | Chamfer — 斜角截面的造型語言 | Chamfer / Cross Section / Hard Edge |
| Level 07 | 即將推出 | — |
| Level 08 | 即將推出 | — |
| Level 09 | 即將推出 | — |
| Level 10 | 即將推出 | — |

---

## 課程設計邏輯

```
L01 塊體感知        → 從零開始，最單純的 R 角與量體
L02 布林交集        → 不同方向 R 角碰撞的硬邊界
L03 比例 + 方向性   → R 角在不同比例容器裡的視覺重量
L04 幾何精確        → 從近似升級為 CAD 真實的 Fillet 邏輯
L05 複合路徑        → 建模順序如何決定造型氣質
L06 斜角截面        → Chamfer 的面積消長與交界協商
```

---

## 使用方式

直接點上方的課程連結，用滑鼠（或手指）拖拉旋轉 3D 物件，拉動滑桿即時觀察造型變化。

- **桌機**：左側浮動控制面板
- **手機 / 平板**：底部抽屜 UI，自動偵測觸控裝置切換

---

## 技術規格

- Three.js r128
- OrbitControls
- 純頂點位移算法（L01–L03）/ 弧線掃描建構（L04）/ 手動頂點建面（L06）
- 每個 Level 為獨立單檔 HTML，部署於 GitHub Pages
- RWD：`(hover: hover) and (pointer: fine)` 偵測桌機 / 觸控自動切換

---

*Simon BASIC MODELING Lab © 2026*
