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

### 环境变量

下表列出了可用于配置 `jmalcloud` 应用的环境变量及其说明。请根据您的需求进行设置。

| 变量名                       | 描述                                                                                                                               | 类型    | 示例值                                                       | 默认值 (若不设置)                        | 是否推荐/必须 |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------|---------|-----------------------------------------------------------|-----------------------------------|-----------------|
| `PUID`                       | 设置应用进程运行的用户ID (UID)。用于文件权限管理，特别是在 Docker 环境中。                                                                 | Integer | `1000`                                                    | `0` (root)                        | 推荐 (安全)   |
| `PGID`                       | 设置应用进程运行的用户组ID (GID)。用于文件权限管理，特别是在 Docker 环境中。                                                                 | Integer | `1000`                                                    | `0` (root)                        | 推荐 (安全)   |
| `TZ`                         | 设置应用的时区。例如 `Asia/Shanghai`, `UTC`, `America/New_York`。会传递给 JVM 参数 `-Duser.timezone`。                                  | String  | `Asia/Shanghai`                                           | `Asia/Shanghai`                   | 可选            |
| `JVM_OPTS`                   | Java 虚拟机 (JVM) 的启动参数。用于调整内存分配、GC策略等。 **注意**: 当 `EXACT_SEARCH=true` 时, 建议 `-Xmx` 不低于 `4g`。                   | String  | `-Xms1g -Xmx4g -XX:+HeapDumpOnOutOfMemoryError`           | 空                                 | 可选 (高级)   |
| `MONGODB_URI`                | MongoDB 数据库的连接 URI。格式：`mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]`             | String  | `mongodb://user:pass@mongodb-server:27017/jmalcloud_prod` | `mongodb://mongo:27017/jmalcloud` | 可选            |
| `TESS4J_DATA_PATH`           | Tess4J OCR 引擎的 `tessdata` 目录路径。如果使用 OCR 功能则必须配置，并确保该路径下包含所需的语言数据文件。                                     | String  | `/usr/share/tessdata`                                     | `/jmalcloud/tess4j/datapath`      | 可选    |
| `EXACT_SEARCH`               | 是否启用文件内容精确搜索功能 (`true` 或 `false`)。启用此功能会消耗更多内存，请参考 `JVM_OPTS` 的说明。                                      | Boolean | `true`                                                    | `false`                           | 可选            |
| `FILE_ROOT_DIR`              | 应用存储和管理文件的根目录。应用将在此目录下读写文件。                                                                              | String  | `/data/jmalcloud_files`                                   | `/jmalcloud/files`                | 可选            |
| `MONITOR_IGNORE_FILE_PREFIX` | 文件监控功能忽略的文件名前缀列表，多个前缀用逗号 `,` 分隔。                                                                                 | String  | `.~,tmp_,cache_`                                          | `.DS_Store,._`                    | 可选            |
| `LOG_LEVEL`                  | 配置应用的根日志输出级别。有效值通常包括 `trace`, `debug`, `info`, `warn`, `error`                               | String  | `info`                                                    | `warn`                            | 可选            |

  
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

