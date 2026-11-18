# Rhino 基礎認識・第一單元：認識 Rhino 物件

從首頁的「Rhino 基礎認識」進入；這個單元包含八節，與既有 Level 01–15 分組顯示。

`index.html` 是整合程式庫與官方圖示的靜態頁面，可透過網站或直接用瀏覽器開啟。點左上角「課程首頁」會返回首頁的 Rhino 分組。

## 維護

修改 `source.html`、`style.css`、`layout.css`、`toolbar-guide.css`、`app.js`，再執行：

```sh
python3 build.py
```

`build.py` 會重新產生 `index.html`。所有模組與圖示均內嵌，不依賴 CDN。

## 內容與來源

八節為點、曲線、曲面、擠出物件、多重曲面、實體、其他物件簡介、Rhino 指令對照。圖鑑與自由編輯是幾何教學示意，未使用 Rhino CAD 運算核心；工具列位置使用 Rhino 8 Windows 官方介面截圖與局部放大，橘框為本課標記；子工具群另列官方圖示索引，其行列依工具列寬度變動。

官方指南：https://www.rhino3d.com/docs/guides/user-guide/objects/

官方指令圖示與選單來源記錄在 `assets/command-sources.json`；Three.js 授權在 `vendor/THREE-LICENSE.txt`。

相關造型實驗連結在各節的補充說明中，開新分頁，不影響當前練習。

## 以圖示尋找工具的位置

指令對照以圖示為入口：中央顯示真實 Windows 介面截圖與橘框，右側呈現原始截圖的放大區域、操作步驟與滑鼠動作。需要展開工具群時，先標出父按鈕，再列出該工具群中目標與相鄰工具的官方圖示索引；索引不冒充固定行列的截圖。可點「放大截圖」在同一視窗查看較大的介面圖，Esc 或關閉回到原畫面。

特別核對 What：在 Diagnostics 工具列中，List 按鈕左鍵執行 List，右鍵執行 What，兩者共用按鈕。Gumball 則標在畫面底部狀態列。未顯示的 Diagnostics 與 Mass Properties 工具列，可從 Window → Toolbars 開啟。

截圖及展開動畫來源：`assets/toolbars/sources.json`；各工具群與左右鍵來源：`assets/toolbar-groups.json`。
