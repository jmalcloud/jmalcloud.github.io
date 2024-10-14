# Unable to View Office Documents After Deployment

## 1. Issue with Office Documents not Accessible when using HTTP Proxy and the Port is not 80/443

In the case where the web disk is wrapped by an HTTP proxy and the port is not 80/443, Office documents may not be accessible.

Using Nginx as an example:

You need to add proxy_set_header Host $http_host; to the outer Nginx configuration.
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

## 2. The Format of the Document Security Token is Incorrect. Please Contact Your Document Server Administrator.

In the web disk settings, under OnlyOffice, enter the JWT_SECRET from the docker-compose.yml file.

```yaml
  office:
    container_name: jmalcloud_office
    image: onlyoffice/documentserver:8.0.1
    environment:
      TZ: "Asia/Shanghai"
      JWT_SECRET: "my_secret"
    restart: unless-stopped
```
For example, the secret key here is: my_secret.
