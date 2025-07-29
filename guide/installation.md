# 安装 {#installation}

**通过Docker Compose安装**  

   ::: code-group			
   
```yaml [docker-compose.yml]
services:
  mongo:
    container_name: jmalcloud_mongodb
    image: mongo:7.0
    environment:
      TZ: "Asia/Shanghai"
    volumes:
      - ./docker/jmalcloud/mongodb/data/db:/data/db
      - ./docker/jmalcloud/mongodb/backup:/dump
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
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
      JVM_OPTS: "-Xms512m -Xmx4g"
      EXACT_SEARCH: false
      PUID: 1000
      PGID: 1000
      # 如果为空系统会自动生成(位置在/jmalcloud/files/.env)(openssl rand -hex 32)
      ENCRYPTION_SECRET_KEY: ""
      # 如果为空系统会自动生成(位置在/jmalcloud/files/.env)(openssl rand -hex 32)
      ENCRYPTION_SALT: ""
    volumes:
      - ./docker/jmalcloud/files:/jmalcloud/files/
    restart: unless-stopped
    ports:
      - 7072:8088

  nginx:
    container_name: jmalcloud_nginx
    image: jmal/jmalcloud-nginx:latest
    ports:
      - 7070:80
      - 7071:8089
    environment:
      TZ: "Asia/Shanghai"
    restart: unless-stopped
    links:
      - jmalcloud
      - office

  office: # Optional
    container_name: jmalcloud_office
    image: onlyoffice/documentserver:9.0
    environment:
      TZ: "Asia/Shanghai"
      JWT_SECRET: "my_secret"
    restart: unless-stopped
```

```yaml [镜像加速]
services:
  mongo:
    container_name: jmalcloud_mongodb
    image: docker.jmalx.com/library/mongo:7.0
    environment:
      TZ: "Asia/Shanghai"
    volumes:
      - ./docker/jmalcloud/mongodb/data/db:/data/db
      - ./docker/jmalcloud/mongodb/backup:/dump
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 3
    command: --wiredTigerCacheSizeGB 0.5

  jmalcloud:
    container_name: jmalcloud_server
    image: docker.jmalx.com/jmal/jmalcloud:latest
    environment:
      MONGODB_URI: "mongodb://mongo:27017/jmalcloud"
      TZ: "Asia/Shanghai"
      JVM_OPTS: "-Xms512m -Xmx4g"
      EXACT_SEARCH: false
      PUID: 1000
      PGID: 1000
      # 如果为空系统会自动生成(位置在/jmalcloud/files/.env)(openssl rand -hex 32)
      ENCRYPTION_SECRET_KEY: ""
      # 如果为空系统会自动生成(位置在/jmalcloud/files/.env)(openssl rand -hex 32)
      ENCRYPTION_SALT: ""
    volumes:
      - ./docker/jmalcloud/files:/jmalcloud/files/
    restart: unless-stopped
    ports:
      - 7072:8088

  nginx:
    container_name: jmalcloud_nginx
    image: docker.jmalx.com/jmal/jmalcloud-nginx:latest
    ports:
      - 7070:80
      - 7071:8089
    environment:
      TZ: "Asia/Shanghai"
    restart: unless-stopped
    links:
      - jmalcloud
      - office

  office: # Optional
    container_name: jmalcloud_office
    image: docker.jmalx.com/onlyoffice/documentserver:9.0
    environment:
      TZ: "Asia/Shanghai"
      JWT_SECRET: "my_secret"
    restart: unless-stopped
```

### 环境变量

以下是可用于配置 `jmalcloud` 应用的环境变量及其详细说明。请根据您的需求进行设置。

#### `PUID`
- **描述**: 设置应用进程运行的用户ID (UID)。主要用于文件权限管理，特别是在 Docker 环境中，确保应用创建的文件归属于正确的用户。
- **类型**: `Integer`
- **示例值**: `1000`
- **默认值**: `0` (root)
- **配置建议**: **推荐**配置，以增强安全性，避免以 root 权限运行。

#### `PGID`
- **描述**: 设置应用进程运行的用户组ID (GID)。与 `PUID` 配合使用，用于文件权限管理。
- **类型**: `Integer`
- **示例值**: `1000`
- **默认值**: `0` (root)
- **配置建议**: **推荐**配置，以增强安全性。

#### `TZ`
- **描述**: 设置应用的时区，例如 `Asia/Shanghai`, `UTC`, `America/New_York`。此设置会通过 JVM 参数 `-Duser.timezone` 传递给 Java 应用，确保日志和时间相关的功能正确显示。
- **类型**: `String`
- **示例值**: `Asia/Shanghai`
- **默认值**: `Asia/Shanghai`
- **配置建议**: 可选。

#### `JVM_OPTS`
- **描述**: Java 虚拟机 (JVM) 的启动参数。可用于调整内存分配（如 `-Xms`, `-Xmx`）、垃圾回收策略等高级设置。
- **重要提示**: 当 `EXACT_SEARCH=true` 时，为避免内存溢出，建议将最大堆内存 `-Xmx` 设置为不低于 `4g`。
- **类型**: `String`
- **示例值**: `-Xms1g -Xmx4g -XX:+HeapDumpOnOutOfMemoryError`
- **默认值**: 空
- **配置建议**: 可选（高级用户）。

#### `MONGODB_URI`
- **描述**: MongoDB 数据库的连接 URI。格式为 `mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]`。
- **类型**: `String`
- **示例值**: `mongodb://user:pass@mongodb-server:27017/jmalcloud_prod`
- **默认值**: `mongodb://mongo:27017/jmalcloud`
- **配置建议**: 可选。

#### `TESS4J_DATA_PATH`
- **描述**: Tess4J OCR 引擎的 `tessdata` 目录路径。如果需要使用图片内容识别（OCR）功能，则必须配置此项，并确保该路径下包含所需的语言数据文件（例如 `chi_sim.traineddata` 用于简体中文）。
- **类型**: `String`
- **示例值**: `/usr/share/tessdata`
- **默认值**: `/jmalcloud/tess4j/datapath`
- **配置建议**: 可选，使用OCR功能时为**必须**。

#### `EXACT_SEARCH`
- **描述**: 是否启用文件内容的精确搜索（N-Gram 索引）功能 (`true` 或 `false`)。启用后可以搜索文件内的任意词语片段，但索引会消耗更多内存和CPU资源, 索引本身也会占用很多的磁盘空间。
- **类型**: `Boolean`
- **示例值**: `true`
- **默认值**: `false`
- **配置建议**: 可选。

#### `NGRAM_MAX_CONTENT_LENGTH_MB`
- **描述**: **[关键性能参数]** 用于精确搜索(N-Gram)的文件内容最大长度限制（单位：MB）。如果一个文件的实际文本内容长度超过此值，只有前面这部分内容会被精确搜索覆盖，超出部分仅支持模糊搜索。
- **类型**: `Integer`
- **示例值**: `10`
- **默认值**: `5`
- **配置建议**:
   - 这是一个**非常敏感**的参数，是导致**内存溢出(OOM)的主要风险点之一**，需要根据您的服务器内存 (`-Xmx`) 和数据特性进行仔细测试和调整。
   - **影响**:
      - **更大的值**: 更多文件内容可被精确搜索，但会显著增加索引构建时的内存消耗、CPU时间和磁盘空间。
      - **更小的值**: 节省系统资源，降低OOM风险，加快索引速度，但仅文件头部内容可被精确搜索。
   - **内存参考**:
      - 对于 `-Xmx=2G` 的环境，建议从非常小的值开始测试，例如 `1` 到 `3`。
      - 如果 `-Xmx` 更大 (例如 `8G+`)，可以谨慎尝试更大的值，如 `10` 或 `15`。
      - **强烈不推荐**设置非常大的值 (如 50MB 以上)，除非您有极大的内存和特定的需求，并已充分验证。

#### `NGRAM_MIN_SIZE`
- **描述**: 设置 N-Gram 精确搜索分词的最小长度。
- **类型**: `Integer`
- **示例值**: `2`
- **默认值**: `2`
- **配置建议**: 可选 (高级)。

#### `NGRAM_MAX_SIZE`
- **描述**: 设置 N-Gram 精确搜索分词的最大长度。
- **类型**: `Integer`
- **示例值**: `7`
- **默认值**: `6`
- **配置建议**: 可选 (高级)。

#### `FILE_ROOT_DIR`
- **描述**: 应用存储和管理文件的根目录。所有用户文件都将在此目录下进行读写操作。
- **类型**: `String`
- **示例值**: `/data/jmalcloud_files`
- **默认值**: `/jmalcloud/files`
- **配置建议**: 可选。

#### `MONITOR_IGNORE_FILE_PREFIX`
- **描述**: 文件监控功能需要忽略的文件名前缀列表，多个前缀之间使用逗号 `,` 分隔。用于排除临时文件或系统文件的干扰。
- **类型**: `String`
- **示例值**: `.~,tmp_,cache_`
- **默认值**: `.DS_Store,._`
- **配置建议**: 可选。

#### `LOG_LEVEL`
- **描述**: 配置应用的根日志输出级别。用于控制日志的详细程度。有效值通常包括 `trace`, `debug`, `info`, `warn`, `error`。
- **类型**: `String`
- **示例值**: `info`
- **默认值**: `warn`
- **配置建议**: 可选。

#### `ENCRYPTION_SECRET_KEY`
- **描述**: 用于数据加密和解密的密钥。该密钥应为强随机字符串，用于保护敏感数据的安全性。
- **类型**: `String`
- **示例值**: `3df759ce9f6dab43580830785b67a6afa934a18cd70f7b17ae17e81ee685c02e`
- **默认值**: `3df759ce9f6dab43580830785b67a6afa934a18cd70f7b17ae17e81ee685c02e`
- **配置建议**: 必需。如果为空系统会自动生成(位置在/jmalcloud/files/.env), 建议使用至少32字节的随机字符串，可通过 openssl rand -hex 32 生成。

#### `ENCRYPTION_SALT`
- **描述**: 加密过程中使用的盐值，用于增加加密的安全性，防止彩虹表攻击。每个应用实例应使用唯一的盐值。
- **类型**: `String`
- **示例值**: `2b4f6681ea2167b33630e1fd283cade9`
- **默认值**: `2b4f6681ea2167b33630e1fd283cade9`
- **配置建议**: 必需。如果为空系统会自动生成(位置在/jmalcloud/files/.env), 建议使用至少16字节的随机字符串，可通过 openssl rand -hex 16 生成。

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

