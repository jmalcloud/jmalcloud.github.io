# 安装 {#installation}

## **Docker**

```shell
docker run -d \
  --name jmalcloud \
  -p 8088:8088 \
  -v ./jmalcloud/files:/jmalcloud/files \
  --restart always \
  jmal/jmalcloud-sql:test
```

访问 `http://your-domain-or-ip:8088` 即可使用。

## **Docker Compose**  

```yaml
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud-sql:test
    environment:
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
```

**启动**
```bash
docker compose up -d
```

## 环境变量

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

#### `RESET_ADMIN_PASSWORD`
- **描述**: 是否重置管理员密码。设置为 `true` 时，系统将在下次启动时将管理员密码重置为默认值 `jmalcloud`。
- **类型**: `String`
- **示例值**: `false`
- **默认值**: `false`
- **配置建议**: 可选。

#### `DATA_BASE_TYPE`
- **描述**: 数据库类型，支持四种数据库: `sqlite`, `mongodb`, `mysql`, `postgresql`。
- **类型**: `String`
- **示例值**: `sqlite`
- **默认值**: `sqlite`
- **配置建议**: 可选。

#### `MIGRATION`
- **描述**: 是否从mongoDB迁移到其他数据库，支持迁移至其他3种数据库: `sqlite`, `mysql`, `postgresql`。
- **类型**: `Boolean`
- **示例值**: `true`
- **默认值**: `false`
- **配置建议**: 可选。


## MySQL

::: code-group
```yaml [自部署MySQL服务]
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud-sql:latest
    environment:
      DATA_BASE_TYPE: mysql
      DATABASE_HOST: your_mysql_host
      DATABASE_PORT: 3306
      DATABASE_NAME: your_database_name
      DATABASE_USER: your_database_user
      DATABASE_PASSWORD: your_database_pass
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
```
```yaml [完整示例：包含MySQL服务]
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud-sql:latest
    environment:
      DATA_BASE_TYPE: mysql
      DATABASE_HOST: mysql
      DATABASE_PORT: 3306
      DATABASE_NAME: jmalcloud
      DATABASE_USER: jmalcloud_user
      DATABASE_PASSWORD: jmalcloud_pass
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8089:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
    depends_on:
      mysql:
        condition: service_healthy
  mysql:
    container_name: jmalcloud_mysql
    ports:
      - 3307:3306
    user: "1000:1001"
    environment:
      MYSQL_ROOT_PASSWORD: mysql_root_pass
      MYSQL_DATABASE: jmalcloud
      MYSQL_USER: jmalcloud_user
      MYSQL_PASSWORD: jmalcloud_pass
    image: mysql:8.1
    restart: always
    volumes:
      - ./jmalcloud/db/data/:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin ping -h localhost -ujmalcloud_user -pjmalcloud_pass"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
```
:::


## PostgreSQL

::: code-group
```yaml [部署PostgreSQL服务]
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud-sql:latest
    environment:
      DATA_BASE_TYPE: postgresql
      DATABASE_HOST: postgresql_host
      DATABASE_PORT: 3306
      DATABASE_NAME: jmalcloud
      DATABASE_USER: jmalcloud_user
      DATABASE_PASSWORD: jmalcloud_pass
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
```

```yaml [完整示例：包含PostgreSQL服务]
services:
  jmalcloud:
    container_name: jmalcloud_test
    image: jmal/jmalcloud-sql:latest
    environment:
      DATA_BASE_TYPE: postgresql
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: jmalcloud
      DATABASE_USER: jmalcloud_user
      DATABASE_PASSWORD: jmalcloud_pass
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8089:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
  postgres:
    image: library/postgres:17
    container_name: jmalcloud_postgresql
    environment:
      POSTGRES_USER: jmalcloud_user
      POSTGRES_PASSWORD: jmalcloud_pass
      POSTGRES_DB: jmalcloud
      PGDATA: /var/lib/postgresql/data/pgdata
      TZ: Asia/Shanghai
    volumes:
      - ./jmalcloud/db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U jmalcloud_user -d jmalcloud"]
      interval: 5s
      timeout: 3s
      retries: 10
```
:::

## MongoDB

**⚠️注意**: 如果CPU不支持AVX指令集, 请使用MongoDB 4.4版本

查看cpu是否支持AVX指令集: `lscpu | grep avx`, 查看输出里是否包含 avx、avx2 等

::: code-group
```yaml [自部署MongoDB服务]
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud:latest
    environment:
      MONGODB_URI: mongodb://mongo_user:mongo_pass@your_mongo_host:27017/jmalcloud?authSource=admin
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
```

```yaml [完整示例：包含MongoDB服务(5.0+版本)]
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud:latest
    environment:
      MONGODB_URI: mongodb://mongo_user:mongo_pass@mongodb:27017/jmalcloud?authSource=admin
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
    depends_on:
      mongodb:
        condition: service_healthy
  mongodb:
    container_name: jmalcloud_mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo_user
      MONGO_INITDB_ROOT_PASSWORD: mongo_pass
    image: mongo:7.0.21
    restart: always
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    volumes:
      - ./jmalcloud/db:/data/db
```

```yaml [完整示例：包含MongoDB服务(5.0以下版本)]
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud:latest
    environment:
      MONGODB_URI: mongodb://mongo_user:mongo_pass@mongodb:27017/jmalcloud?authSource=admin
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
    depends_on:
      mongodb:
        condition: service_healthy
  mongodb:
    container_name: jmalcloud_mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongo_user
      MONGO_INITDB_ROOT_PASSWORD: mongo_pass
    image: mongo:4.4
    restart: always
    healthcheck:
      test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    volumes:
      - ./jmalcloud/db:/data/db
```
:::

## 从MongoDB迁移到其他数据库
如果您当前使用的是MongoDB作为数据库，并且希望迁移到其他数据库（如SQLite、MySQL或PostgreSQL），可以按照以下步骤进行操作：
1. **备份数据**: 在进行任何迁移操作之前，务必备份您的MongoDB数据，以防止数据丢失。
```shell
docker exec -it jmalcloud_mongodb mongodump -d jmalcloud -o /dump/v2.16.0 --gzip --quiet
```
2. **配置环境变量**: 在您的Docker Compose文件或运行命令中，
3. 设置以下环境变量:
   - `DATA_BASE_TYPE`: 设置为目标数据库类型（`sqlite`, `mysql`, 或 `postgresql`）。
   - `MIGRATION`: 设置为`true`以启用迁移功能。
   - 其他数据库相关的环境变量，如`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, 和 `DATABASE_PASSWORD`，根据目标数据库的要求进行配置。
4. **启动应用**: 使用更新后的配置启动`jmalcloud`应用。
5. **验证迁移**: 启动后，应用将自动从MongoDB迁移数据到新的数据库。请检查日志以确保迁移过程顺利完成，并验证数据是否正确迁移。
6. **完成迁移**: 迁移完成后，您可以选择停用或删除MongoDB服务。

**迁移至PostgreSQL参考示例:**

在下面的Docker Compose示例中，展示了如何将数据从MongoDB迁移到PostgreSQL数据库:
在[PostgreSQL](#PostgreSQL)示例的基础上，添加`MIGRATION`和`DATA_BASE_TYPE`和`MONGODB_URI`环境变量:
```yaml
services:
  mongo:
    container_name: jmalcloud_mongodb
    image: mongo:4.4
    environment:
      TZ: "Asia/Shanghai"
    volumes:
      - ./jmalcloud/mongodb/data/db:/data/db
      - ./jmalcloud/mongodb/custom:/etc/mongo
      - ./jmalcloud/jmalcloud/mongodb/backup:/dump
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 3
    command: --wiredTigerCacheSizeGB 0.5
  jmalcloud:
    container_name: jmalcloud_test
    image: jmal/jmalcloud-sql:latest
    environment:
      # 1. MIGRATION 必须设置为true以启用迁移功能
      MIGRATION: true
      # 2. 设置目标数据库类型为postgresql
      DATA_BASE_TYPE: postgresql
      # 3. 配置PostgreSQL连接参数
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: jmalcloud
      DATABASE_USER: jmalcloud_user
      DATABASE_PASSWORD: jmalcloud_pass
      # 4. 配置MongoDB连接参数，指向现有的MongoDB服务
      MONGODB_URI: "mongodb://mongo:27017/jmalcloud"
      PUID: 0
      PGID: 0
      LOG_LEVEL: info
      # 此处建议使用`openssl rand -hex 32`生成密钥
      ENCRYPTION_SECRET_KEY: ed4b83f7e2e1fc0b0d0d3583d8474cb400c704614ae2b83adc011113a318e878
      # 此处建议使用`openssl rand -hex 16`生成密钥
      ENCRYPTION_SALT: 9234d49a5b8d38173f34fbf37bca474b
    ports:
      - 8089:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
  postgres:
    image: library/postgres:17
    container_name: jmalcloud_postgresql
    environment:
      POSTGRES_USER: jmalcloud_user
      POSTGRES_PASSWORD: jmalcloud_pass
      POSTGRES_DB: jmalcloud
      PGDATA: /var/lib/postgresql/data/pgdata
      TZ: Asia/Shanghai
    volumes:
      - ./jmalcloud/db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U jmalcloud_user -d jmalcloud"]
      interval: 5s
      timeout: 3s
      retries: 10
```
