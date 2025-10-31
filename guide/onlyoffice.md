# 配合 [OnlyOffice](https://www.onlyoffice.com/) 以实现office文档的编辑和预览

使用docker部署OnlyOffice,
也可选择[中国版onlyoffice](https://onlyoffice.moqisoft.com/)部署

::: code-group

```yaml [官方onlyoffice]
services:
  office:
    container_name: jmalcloud_office
    image: onlyoffice/documentserver:9.1
    ports:
      - 8080:80
    environment:
      TZ: Asia/Shanghai
      JWT_ENABLED: true
      ALLOW_PRIVATE_IP_ADDRESS: true
      JWT_SECRET: "my_secret"
    restart: always
```

```yaml [中国版onlyoffice]
services:
  office:
    container_name: onlyoffice_china
    image: moqisoft/documentserver:9.0.4-amd64
    ports:
      - 8080:80
    environment:
      TZ: Asia/Shanghai
      JWT_ENABLED: true
      ALLOW_PRIVATE_IP_ADDRESS: true
      JWT_SECRET: "my_secret"
    restart: always
```
::: 

[查看onlyoffice jwt文档](https://helpcenter.onlyoffice.com/installation/docs-configure-jwt.aspx)

部署完成后, 在`jmalcloud`中完成onlyoffice的配置即可使用
 - **OnlyOffice地址**: 为onlyoffice的访问地址, 例如`http://your-domain-or-ip:8080`
 - **密钥**: 为`JWT_SECRET`中配置的密钥, 例如上面配置中的`my_secret`
 - **回调服务地址**: 为`jmalcloud`api地址, 例如`http://your-domain-or-ip:8088/api`


![alt text](/assets/onlyoffice-config.png)

## 建议
使用nginx反向代理jmalcloud时, 将onlyoffice和jmalcloud配置在同一域名下的不同子路径下, 可以加快文档打开速度 例如:
 - jmalcloud: `https://cloud.your-domain.com`
 - onlyoffice: `https://cloud.your-domain.com/office`

此时`OnlyOffice地址`的配置应该为: `https://cloud.your-domain.com/office`

`回调服务地址`地址不变, 仍为`jmalcloud`的api地址: `http://your-domain-or-ip:8088/api`

nginx配置示例:
```nginx
location / {
    # jmalcloud 配置
    proxy_pass http://your-domain-or-ip:8088; 
    proxy_set_header Host $http_host; 
    proxy_set_header X-real-ip $remote_addr; 
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_set_header X-Real-PORT $remote_port; 
    proxy_set_header X-Forwarded-Port $server_port; 
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    proxy_set_header REMOTE-HOST $remote_addr; 
    proxy_set_header Upgrade $http_upgrade; 
    proxy_set_header Connection "upgrade"; 
    proxy_set_header X-Forwarded-Proto $scheme; 
    proxy_http_version 1.1; 
    add_header X-Cache $upstream_cache_status; 
    add_header Strict-Transport-Security "max-age=31536000"; 
    proxy_set_header Server-Protocol $server_protocol; 
    proxy_set_header Server-Name $server_name; 
    proxy_set_header Server-Addr $server_addr; 
    proxy_set_header Server-Port $server_port; 
    sendfile on; 
    tcp_nopush on; 
    send_timeout 600s; # 延长超时
    keepalive_timeout 600s; # 延长保持连接时间
    output_buffers 1 512k; # 增大输出缓冲区
}

location /office {
    # onlyoffice 配置
    proxy_pass  http://your-domain-or-ip:8080;
    proxy_set_header Host $http_host; 
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    proxy_set_header REMOTE-HOST $remote_addr; 
    proxy_set_header X-Forwarded-Host $http_host/office;
    proxy_set_header Upgrade $http_upgrade; 
    proxy_set_header Connection $http_connection; 
    proxy_set_header X-Forwarded-Proto $scheme; 
    proxy_set_header X-Forwarded-Port $server_port; 
    proxy_http_version 1.1; 
    add_header X-Cache $upstream_cache_status; 
    add_header Cache-Control no-cache; 
    proxy_ssl_server_name off; 
    proxy_ssl_name $proxy_host; 
}

```


