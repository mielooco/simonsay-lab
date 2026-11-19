# Rhino 基礎認識・第二單元：從曲線建立曲面

首頁 Rhino 分組的 UNIT 02；七種建面方法加上方法對照，共八節。第一單元結尾也可直接進入。

`index.html` 內嵌樣式、工具圖示與程式，可靜態部署或直接開啟本機檔案，不依賴 CDN。所有建面操作、生成播放及工具位置對照都在同一頁；不提供官方範例圖片分頁。

## 維護

修改 `source.html`、`style.css`、`app.js`、`software-renderer.js` 後執行 `python3 build.py`。建置使用 esbuild 0.25.0 的 npm 快取；初次可執行 `npm exec --yes --package=esbuild@0.25.0 -- esbuild --version` 準備，或用 `--bundler` 指定既有執行檔。

網頁模式優先使用 WebGL；無法建立 WebGL 時自動切換三維投影顯示。本機檔案預設使用相同幾何與相機的相容顯示；桌機也可點「相容顯示」切換。可重播、暫停、拖動生成進度、編輯點位，以及復原與重做。

## 來源

課程原理參考：https://www.rhino3d.com/tw/docs/guides/user-guide/create-surfaces/

Rhino 8 Windows 圖示及介面來源見 `assets/sources.json`。RailRevolve 使用 Revolve 按鈕的右鍵功能。工具群索引不代表固定行列位置。

瀏覽器模型為生成原理示意，不執行 Rhino CAD 核心；各節補充說明交代幾何與演算法限制。Three.js 授權保留於 `vendor/THREE-LICENSE.txt`。
