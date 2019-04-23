/**
 * 生成二维码canvas
 * 
 * @param {string} url 网址
 * @param {object} bg 背景图图片对象
 * @param {object} shadow 渐变阴影图图片对象
 */
function makeQRCode(url, bg, shadow) {
    makeCodeSvg(url).then((svg) => {
        // 生成渐变二维码
        const qrCanvas = document.createElement('canvas');
        qrCanvas.width = '131';
        qrCanvas.height = '131';
        const qrContext = qrCanvas.getContext('2d');
        qrContext.drawImage(svg, 0 ,0, 131, 131);
        qrContext.globalCompositeOperation = 'source-in';
        qrContext.drawImage(shadow, 0 ,0, 131, 131);

        // 生成最终的目标二维码
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bg, 0, 0);
        context.drawImage(qrCanvas, 12, 12);
    });
}

/**
 * 生成二维码svg
 * 
 * @param {string} 网址 
 * @returns promise
 */
function makeCodeSvg(url) {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 100,
        height: 100,
        colorLight: '#FFFFFF00',
        correctLevel : QRCode.CorrectLevel.H
    });
    qrcode.makeCode(url);
    var xml = new XMLSerializer().serializeToString(document.getElementById("qrcode").querySelector('svg'));
    var svg64 = btoa(xml);
    var b64Start = 'data:image/svg+xml;base64,';
    var image64 = b64Start + svg64;
    var svgTmp = new Image();
    svgTmp.src = image64;
    return new Promise((resolve) => {
        svgTmp.onload = () => {
            resolve(svgTmp);
        };
    });
}

/**
 * 加载图片
 * 
 * @param {string} url 图片路径 
 * @returns promise
 */
function loadImg(url) {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = url;
        img.onload = function() {
            resolve(img);
        };
    });
}

/**
 * 下载图片文件
 * 
 */
function downloadFile() {
    const canvas = document.getElementById('canvas');
    let type = 'png';   // 设置下载图片的格式\
    let aLink = document.createElement('a');
    aLink.download = '二维码' + '.' + type;
    aLink.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'); // 将canvas保存为图片
    let event = document.createEvent('MouseEvents');
    event.initEvent("click", true, false);
    aLink.dispatchEvent(event);
}

/**
 * 将原网址转换成短网址
 * 
 * @param {string} originUrl 原网址
 * @returns promise
 */
function shortUrl(originUrl) {
    return new Promise((resolve) => {
        try {
            // minilink短网址服务，用法参考：https://github.com/ryanism37/minilink
            minilink(originUrl, 'dc35ade5c199f64568ef8564225573f5', (res) => {
                console.log('短网址生成结果', res);
                if (res.Code === 0 && res.ShortUrl) {
                    resolve(res.ShortUrl);
                }
                else {
                    resolve(originUrl);
                }
            });
        }
        catch(e) {
            resolve(originUrl);
        }
    });
}

/**
 * 页面按钮点击事件处理
 * 
 */
function handleClick() {
    let originUrl = document.getElementById('url').value;
    Promise.all([
        shortUrl(originUrl),
        loadImg('./asset/bg.png'),
        loadImg('./asset/shadow.jpg')
    ]).then((data) => {
        makeQRCode(data[0], data[1], data[2]);
        downloadFile();
    });
}