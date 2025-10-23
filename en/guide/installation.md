# Installation {#installation}

## **Docker**

```shell
docker run -d \
  --name jmalcloud \
  -p 8088:8088 \
  -v /opt/jmalcloud:/jmalcloud/files \
  --restart always \
  jmal/jmalcloud-sql:test
```

## **Docker Compose**

```yaml
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud-sql:test
    environment:
      PUID: 0
      PGID: 0
      # It is recommended to use `openssl rand -hex 32` to generate a key
      ENCRYPTION_SECRET_KEY: ""
      # It is recommended to use `openssl rand -hex 16` to generate a key
      ENCRYPTION_SALT: ""
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
```

**Start**
```bash
docker compose up -d
```

### Environment Variables

Below is a list of environment variables for configuring the `jmalcloud` application. Set them according to your needs.

#### `PUID`
- **Description**: Sets the User ID (UID) for the application process. This is primarily used for file permission management, especially in Docker environments, to ensure that files created by the application belong to the correct user.
- **Type**: `Integer`
- **Example Value**: `1000`
- **Default Value**: `0` (root)
- **Recommendation**: **Recommended** for enhanced security and to avoid running the process as root.

#### `PGID`
- **Description**: Sets the Group ID (GID) for the application process. Used in conjunction with `PUID` for file permission management.
- **Type**: `Integer`
- **Example Value**: `1000`
- **Default Value**: `0` (root)
- **Recommendation**: **Recommended** for enhanced security.

#### `TZ`
- **Description**: Sets the application's time zone, e.g., `Asia/Shanghai`, `UTC`, `America/New_York`. This setting is passed to the Java application via the JVM argument `-Duser.timezone` to ensure that logs and time-related functions display correctly.
- **Type**: `String`
- **Example Value**: `Asia/Shanghai`
- **Default Value**: `Asia/Shanghai`
- **Recommendation**: Optional.

#### `JVM_OPTS`
- **Description**: Java Virtual Machine (JVM) startup arguments. Can be used to adjust memory allocation (e.g., `-Xms`, `-Xmx`), garbage collection strategies, and other advanced settings.
- **Important Note**: When `EXACT_SEARCH=true`, to avoid OutOfMemoryError, it's recommended to set the maximum heap size (`-Xmx`) to at least `4g`.
- **Type**: `String`
- **Example Value**: `-Xms1g -Xmx4g -XX:+HeapDumpOnOutOfMemoryError`
- **Default Value**: Empty
- **Recommendation**: Optional (for advanced users).

#### `MONGODB_URI`
- **Description**: The connection URI for the MongoDB database. The format is `mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]`.
- **Type**: `String`
- **Example Value**: `mongodb://user:pass@mongodb-server:27017/jmalcloud_prod`
- **Default Value**: `mongodb://mongo:27017/jmalcloud`
- **Recommendation**: Optional.

#### `TESS4J_DATA_PATH`
- **Description**: The directory path for the Tess4J OCR engine's `tessdata`. This must be configured if you need to use the image content recognition (OCR) feature. Ensure that this path contains the required language data files (e.g., `eng.traineddata` for English).
- **Type**: `String`
- **Example Value**: `/usr/share/tessdata`
- **Default Value**: `/jmalcloud/tess4j/datapath`
- **Recommendation**: Optional, but **required** when using the OCR feature.

#### `EXACT_SEARCH`
- **Description**: Enables or disables the exact search feature (N-Gram indexing) for file content (`true` or `false`). Enabling this allows searching for any substring within files but consumes more memory and CPU resources.
- **Type**: `Boolean`
- **Example Value**: `true`
- **Default Value**: `false`
- **Recommendation**: Optional.

#### `NGRAM_MAX_CONTENT_LENGTH_MB`
- **Description**: **[Critical Performance Parameter]** Sets the maximum length (in MB) of file content used for N-Gram exact search. If a file's text content is larger than this limit, only the initial portion is indexed for exact search. The rest of the content will only be available for fuzzy search.
- **Type**: `Integer`
- **Example Value**: `10`
- **Default Value**: `5`
- **Recommendation**:
    - This is a **highly sensitive** parameter and one of the main risk factors for **OutOfMemoryError (OOM)**. It needs to be carefully tested and tuned based on your server's memory (`-Xmx`) and data characteristics.
    - **Impact**:
        - **Higher Value**: More content is indexed for exact search, but it significantly increases memory consumption, CPU time, and disk space during index building.
        - **Lower Value**: Saves system resources, reduces OOM risk, and speeds up indexing, but only the beginning of the file content is available for exact search.
    - **Memory Reference**:
        - For an environment with `-Xmx=2G`, it's recommended to start testing with very small values, such as `1` to `3`.
        - If `-Xmx` is larger (e.g., `8G+`), you can cautiously try higher values, such as `10` or `15`.
        - It is **strongly not recommended** to set very large values (e.g., over 50MB) unless you have a massive amount of memory, specific requirements, and have thoroughly validated the setup.

#### `NGRAM_MIN_SIZE`
- **Description**: Sets the minimum length for N-Gram tokenization in exact search.
- **Type**: `Integer`
- **Example Value**: `2`
- **Default Value**: `2`
- **Recommendation**: Optional (Advanced).

#### `NGRAM_MAX_SIZE`
- **Description**: Sets the maximum length for N-Gram tokenization in exact search.
- **Type**: `Integer`
- **Example Value**: `7`
- **Default Value**: `6`
- **Recommendation**: Optional (Advanced).

#### `FILE_ROOT_DIR`
- **Description**: The root directory where the application stores and manages files. All user files will be read from and written to this directory.
- **Type**: `String`
- **Example Value**: `/data/jmalcloud_files`
- **Default Value**: `/jmalcloud/files`
- **Recommendation**: Optional.

#### `MONITOR_IGNORE_FILE_PREFIX`
- **Description**: A comma-separated list of filename prefixes to be ignored by the file monitoring feature. Used to exclude temporary or system files.
- **Type**: `String`
- **Example Value**: `.~,tmp_,cache_`
- **Default Value**: `.DS_Store,._`
- **Recommendation**: Optional.

#### `LOG_LEVEL`
- **Description**: Configures the root logging output level for the application. Controls the verbosity of logs. Valid values typically include `trace`, `debug`, `info`, `warn`, `error`.
- **Type**: `String`
- **Example Value**: `info`
- **Default Value**: `warn`
- **Recommendation**: Optional.

#### `ENCRYPTION_SECRET_KEY`
- **Description**: The key used for data encryption and decryption. This key should be a strong random string to protect the security of sensitive data.
- **Type**: `String`
- **Example Value**: `3df759ce9f6dab43580830785b67a6afa934a18cd70f7b17ae17e81ee685c02e`
- **Default Value**: `3df759ce9f6dab43580830785b67a6afa934a18cd70f7b17ae17e81ee685c02e`
- **Recommendation**: Required. If it is empty, the system will automatically generate it (located at /jmalcloud/files/.env). It is recommended to use a random string of at least 32 bytes, which can be generated using `openssl rand -hex 32`.

#### `ENCRYPTION_SALT`
- **Description**: The salt value used in the encryption process to enhance encryption security and prevent rainbow table attacks. Each application instance should use a unique salt value.
- **Type**: `String`
- **Example Value**: `2b4f6681ea2167b33630e1fd283cade9`
- **Default Value**: `2b4f6681ea2167b33630e1fd283cade9`
- **Recommendation**: Required. If it is empty, the system will automatically generate it (located at /jmalcloud/files/.env). It is recommended to use a random string of at least 16 bytes, which can be generated using `openssl rand -hex 16`.

#### `RESET_ADMIN_PASSWORD`
- **Description**: Whether to reset the administrator password. When set to `true`, the system will reset the administrator password to the default value `jmalcloud` upon the next startup.
- **Type**: `String`
- **Example Value**: `false`
- **Default Value**: `false`
- **Recommendation**: Optional.

#### `DATA_BASE_TYPE`
- **Description**: Database types, supporting four types of databases: `sqlite`, `mongodb`, `mysql`, `postgresql`.
- **Type**: `String`
- **Example Value**: `sqlite`
- **Default Value**: `sqlite`
- **Recommendation**: Optional.

## MySQL

**Please deploy the MySQL service yourself.**

```yaml
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud-sql:latest
    environment:
      DATA_BASE_TYPE: mysql
      DATABASE_HOST: mysql_host
      DATABASE_PORT: 3306
      DATABASE_NAME: jmalcloud
      DATABASE_USER: jmalcloud_user
      DATABASE_PASSWORD: jmalcloud_pass
      PUID: 0
      PGID: 0
      # It is recommended to use `openssl rand -hex 32` to generate a key
      ENCRYPTION_SECRET_KEY: ""
      # It is recommended to use `openssl rand -hex 16` to generate a key
      ENCRYPTION_SALT: ""
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
```

## PostgreSQL

**Please deploy the PostgreSQL service yourself.**

```yaml
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
      # It is recommended to use `openssl rand -hex 32` to generate a key
      ENCRYPTION_SECRET_KEY: ""
      # It is recommended to use `openssl rand -hex 16` to generate a key
      ENCRYPTION_SALT: ""
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
```

## MongoDB

**Please deploy the MongoDB service yourself.**

```yaml
services:
  jmalcloud:
    container_name: jmalcloud
    image: jmal/jmalcloud:latest
    environment:
      MONGODB_URI: mongodb://username:pass@mongo_host:27017/jmalcloud?authSource=admin
      PUID: 0
      PGID: 0
      # It is recommended to use `openssl rand -hex 32` to generate a key
      ENCRYPTION_SECRET_KEY: ""
      # It is recommended to use `openssl rand -hex 16` to generate a key
      ENCRYPTION_SALT: ""
    ports:
      - 8088:8088
    volumes:
      - ./jmalcloud/files:/jmalcloud/files
    restart: always
```
