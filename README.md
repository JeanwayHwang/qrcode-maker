# qrcode-maker
自定义外观的二维码生成&下载服务

> 目的：基于qrcode.js的二维码（自定义视觉）生成和下载服务

## Usage Demo

``` javascript
cd qrcode-maker
npm run start // 或 python -m SimpleHTTPServer 7001
浏览器访问locahost:7001 // 访问index.html
```

## Usage Interface

![Usage Interface](https://github.com/ryanism37/qrcode-maker/blob/master/asset/demo.png)

### 注意事项
若直接访问index.html在下载二维码图时会因为引用图片跨域问题<br>
导致执行canvas.toDataURL时报错，启动本地服务器后访问可解决该问题！
