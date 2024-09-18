# Unable to View Office Documents After Deployment

Assuming the cloud disk address is: `http://localhost:7070`, then the office address should be: `http://localhost:7071/office/`.

The outer nginx configuration needs to include:
```nginx
proxy_set_header Host $http_host;
```
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
