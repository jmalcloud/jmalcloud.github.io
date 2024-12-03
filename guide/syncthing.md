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

### 完整实例： 
```yaml
services:
  mongo:
    container_name: jmalcloud_mongodb
    image: mongo:4.4
    environment:
      TZ: "Asia/Shanghai"
    volumes:
      - ./docker/jmalcloud/mongodb/data/db:/data/db
      - ./docker/jmalcloud/mongodb/backup:/dump
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 3
    command: --wiredTigerCacheSizeGB 0.5

  jmalcloud:
    container_name: jmalcloud_server
    image: jmal/jmalcloud:latest
    environment:
      PUID: 0
      PGID: 0
      MONGODB_URI: "mongodb://mongo:27017/jmalcloud"
      TZ: "Asia/Shanghai"
      JVM_OPTS: "-Xms256m -Xmx1024m"
    volumes:
      - ./docker/jmalcloud/files:/jmalcloud/files
    restart: unless-stopped
    ports:
       - 7072:8088
    depends_on:
      mongo:
        condition: service_healthy

  nginx:
    container_name: jmalcloud_nginx
    image: jmal/jmalcloud-nginx:latest
    ports:
      - 7070:80
      - 7071:8089
    environment:
      TZ: "Asia/Shanghai"
    links:
      - jmalcloud
      - office # 下面去掉了office这里也要删除
    restart: unless-stopped

  office: # 不想使用office功能可以去掉
    container_name: jmalcloud_office
    image: onlyoffice/documentserver:8.0.1
    environment:
      TZ: "Asia/Shanghai"
      JWT_SECRET: "my_secret"
    restart: unless-stopped
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
