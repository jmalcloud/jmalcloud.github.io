# 安装 {#installation}

**通过Docker Compose安装**  

   ::: code-group			
   
```yaml [docker-compose.yml]
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
      MONGODB_URI: "mongodb://mongo:27017/jmalcloud"
      TZ: "Asia/Shanghai"
    volumes:
      - ./docker/jmalcloud/files:/jmalcloud/files/
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
```

```yaml [阿里云镜像-x86]
services:
   mongo:
      container_name: jmalcloud_mongodb
      image: registry.cn-beijing.aliyuncs.com/jmalcloud/mongo:4.4
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
      image: registry.cn-beijing.aliyuncs.com/jmalcloud/jmalcloud:latest
      environment:
         MONGODB_URI: "mongodb://mongo:27017/jmalcloud"
         TZ: "Asia/Shanghai"
      volumes:
         - ./docker/jmalcloud/files:/jmalcloud/files/
      restart: unless-stopped
      ports:
         - 7072:8088
      depends_on:
         mongo:
            condition: service_healthy

   nginx:
      container_name: jmalcloud_nginx
      image: registry.cn-beijing.aliyuncs.com/jmalcloud/jmalcloud-nginx:latest
      ports:
         - 7070:80
         - 7071:8089
      environment:
         TZ: "Asia/Shanghai"
      links:
         - jmalcloud
         - office
      restart: unless-stopped

   office: # Optional
      container_name: jmalcloud_office
      image: registry.cn-beijing.aliyuncs.com/jmalcloud/onlyoffice_documentserver:8.0.1
      environment:
         TZ: "Asia/Shanghai"
         JWT_SECRET: "my_secret"
      restart: unless-stopped
```
```yaml [阿里云镜像-arm64]
services:
   mongo:
      container_name: jmalcloud_mongodb
      image: registry.cn-beijing.aliyuncs.com/jmalcloud/mongo:4.4-arm64
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
      image: registry.cn-beijing.aliyuncs.com/jmalcloud/jmalcloud:latest-arm64
      environment:
         MONGODB_URI: "mongodb://mongo:27017/jmalcloud"
         TZ: "Asia/Shanghai"
      volumes:
         - ./docker/jmalcloud/files:/jmalcloud/files/
      restart: unless-stopped
      ports:
         - 7072:8088
      depends_on:
         mongo:
            condition: service_healthy

   nginx:
      container_name: jmalcloud_nginx
      image: registry.cn-beijing.aliyuncs.com/jmalcloud/jmalcloud-nginx:latest-arm64
      ports:
         - 7070:80
         - 7071:8089
      environment:
         TZ: "Asia/Shanghai"
      links:
         - jmalcloud
         - office
      restart: unless-stopped

   office: # Optional
      container_name: jmalcloud_office
      image: registry.cn-beijing.aliyuncs.com/jmalcloud/onlyoffice_documentserver:8.0.1-arm64
      environment:
         TZ: "Asia/Shanghai"
         JWT_SECRET: "my_secret"
      restart: unless-stopped
```
   :::
   **启动**
```bash
docker compose up -d
```

## 网盘地址

网盘地址: http://{your_ip}:7070


## 网盘API地址

需暴露服务端端口

API地址: http://{your_ip}:7072/public/api

## 备份/恢复 数据库

### 备份数据库

```bash
docker exec -it jmalcloud_mongodb mongodump -d jmalcloud -o /dump/back --gzip --quiet
```

### 恢复数据库

```bash
docker exec -it jmalcloud_mongodb mongorestore --gzip --nsInclude=jmalcloud.* --dir /dump/back --quiet
```

