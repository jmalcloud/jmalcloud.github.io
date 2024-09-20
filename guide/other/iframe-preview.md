# iframe 预览

::: code-group 
```json [示例:] 
{
    "pdf": {
        "PDF.js": "/pdf.js/web/viewer.html?file=$e_url"
    },
    "epub": {
        "epub.js": "/resource/epubjs/viewer.html?url=$e_url"
    },
    "obj,3ds,stl,ply": {
        "kkFileView": "http://127.0.0.1:8012/onlinePreview?url=$eb_url"
    }
}
```
:::
