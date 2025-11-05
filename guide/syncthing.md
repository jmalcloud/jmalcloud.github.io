# 配合[Syncthing](https://syncthing.net/)实现文件同步

## 在现有docker-compose中加入,以下配置即可
```yaml
  syncthing:
    image: lscr.io/linuxserver/syncthing:latest
    container_name: syncthing
    environment:
      PUID: 0
      PGID: 0
      TZ: Asia/Shanghai
    volumes:
      - ./docker/syncthing/config:/config
      - ./docker/jmalcloud/files:/files
    ports:
      - 8384:8384
      - 22000:22000/tcp
      - 22000:22000/udp
      - 21027:21027/udp
    restart: unless-stopped
```

![alt text](/assets/syncthing-add-folder.png)

### 完整示例： 
```yaml
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud-sql:latest
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
  syncthing:
    image: lscr.io/linuxserver/syncthing:latest
    container_name: syncthing
    environment:
      PUID: 0
      PGID: 0
      TZ: Asia/Shanghai
    volumes:
      - ./syncthing/config:/config
      - ./jmalcloud/files:/files
    ports:
      - 8384:8384
      - 22000:22000/tcp
      - 22000:22000/udp
      - 21027:21027/udp
    restart: unless-stopped
```
