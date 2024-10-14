# 部署后无法查看office文档

## 1. 当网盘外层使用http代理, 并且端口不是80/443端口时, office无法访问的问题

这里以nginx为例: 

外层nginx需要加上`proxy_set_header Host $http_host;`
```nginx
location ^~ / {
    proxy_pass http://localhost:7070; 
    proxy_set_header Host $http_host; 
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    proxy_set_header REMOTE-HOST $remote_addr; 
    proxy_set_header Upgrade $http_upgrade; 
    proxy_set_header Connection $http_connection; 
    proxy_set_header X-Forwarded-Proto $scheme; 
    proxy_http_version 1.1; 
    add_header X-Cache $upstream_cache_status; 
    add_header Cache-Control no-cache; 
    proxy_ssl_server_name off; 
    add_header Strict-Transport-Security "max-age=31536000"; 
}
```

## 2. 文档安全令牌的格式不正确请与您的文档服务器管理员联系。

在网盘设置-OnlyOffice中填入`docker-compose.yml`文件的JWT_SECRET

```yaml
  office:
    container_name: jmalcloud_office
    image: onlyoffice/documentserver:8.0.1
    environment:
      TZ: "Asia/Shanghai"
      JWT_SECRET: "my_secret"
    restart: unless-stopped
```
例如这里的密钥为: `my_secret`
