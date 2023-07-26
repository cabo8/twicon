// MutationObserverを初期化
const observer = new MutationObserver(async (mutations) => {
    for (let mutation of mutations) {
        // TwitterのSVG要素が追加されたか確認
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            let svgElement = document.querySelector('a[aria-label="Twitter"] div svg');

            // SVG要素が見つからなかった場合
            if (!svgElement) continue;
            
            // 鳥のアイコンを取得
            let response = await fetch('https://abs.twimg.com/responsive-web/client-web/icon-svg.168b89da.svg');
            let data = await response.text();
            let parser = new DOMParser();
            let svgDoc = parser.parseFromString(data, "image/svg+xml");
            let birdIconPath = svgDoc.querySelector('#icon path').getAttribute('d');

            // svgタグ内のgタグ取得
            let gElement = svgElement.querySelector("g");

            // gタグ内のpathタグ取得
            let pathElement = gElement.querySelector("path");

            // pathタグのdパラメータを鳥アイコンに変更
            pathElement.setAttribute("d", birdIconPath);

            // XアイコンのViewBoxのサイズ取得
            let viewBoxSize = svgElement.viewBox.baseVal;
            let viewBoxMaxSize = Math.max(viewBoxSize.width, viewBoxSize.height);

            // pathタグのバウンディングボックス取得
            let pathBBox = pathElement.getBBox();
            let pathMaxSize = Math.max(pathBBox.width, pathBBox.height);

            // 鳥アイコンとXアイコンの大きさをもとにスケールを求める
            let scale = viewBoxMaxSize / pathMaxSize;

            // 鳥アイコンのgタグのスケールを変更し、差異をなくす
            gElement.setAttribute("transform", `scale(${scale})`);

            // Faviconを変更
            var link = document.querySelector('link[rel="shortcut icon"]');
            if (link) {
                link.href = `//abs.twimg.com/favicons/twitter.2.ico`;
            }

            // SVG要素が見つかったら、他の変更を見ない
            break;
        }
    }
});

// body要素の子要素の変更を監視開始
observer.observe(document.body, { childList: true, subtree: true });