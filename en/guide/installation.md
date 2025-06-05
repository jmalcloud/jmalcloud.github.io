# Installation {#installation}

**Install via Docker Compose**

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
      - office
    restart: unless-stopped

  office: # Optional
    container_name: jmalcloud_office
    image: onlyoffice/documentserver:8.0.1
    environment:
      TZ: "Asia/Shanghai"
      JWT_SECRET: "my_secret"
    restart: unless-stopped
```

### Environment

The table below lists the environment variables available for configuring the `jmalcloud` application and their descriptions. Please set them according to your needs.

| Variable Name                | Description                                                                                                                               | Type    | Example Value                                             | Default Value (If not set)        | Recommended/Required |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------|---------|-----------------------------------------------------------|-----------------------------------|-----------------|
| `PUID`                       | Sets the User ID (UID) for the application process. Used for file permission management, especially in Docker environments.                                | Integer | `1000`                                                    | `0` (root)                        | Recommended (Security) |
| `PGID`                       | Sets the Group ID (GID) for the application process. Used for file permission management, especially in Docker environments.                                | Integer | `1000`                                                    | `0` (root)                        | Recommended (Security) |
| `TZ`                         | Sets the timezone for the application. For example `Asia/Shanghai`, `UTC`, `America/New_York`. Passed to JVM parameter `-Duser.timezone`.                      | String  | `Asia/Shanghai`                                           | `Asia/Shanghai`                   | Optional            |
| `JVM_OPTS`                   | Java Virtual Machine (JVM) startup parameters. Used to adjust memory allocation, GC policy, etc. **Note**: When `EXACT_SEARCH=true`, it is recommended that `-Xmx` is not less than `4g`. | String  | `-Xms1g -Xmx4g -XX:+HeapDumpOnOutOfMemoryError`           | Empty                             | Optional (Advanced) |
| `MONGODB_URI`                | MongoDB database connection URI. Format: `mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]`             | String  | `mongodb://user:pass@mongodb-server:27017/jmalcloud_prod` | `mongodb://mongo:27017/jmalcloud` | Optional            |
| `TESS4J_DATA_PATH`           | The path to the `tessdata` directory for the Tess4J OCR engine. If using the OCR function, this must be configured, and ensure the required language data files are included in this path. | String  | `/usr/share/tessdata`                                     | `/jmalcloud/tess4j/datapath`      | Optional    |
| `EXACT_SEARCH`               | Whether to enable the file content exact search function (`true` or `false`). Enabling this feature will consume more memory, please refer to the `JVM_OPTS` description. | Boolean | `true`                                                    | `false`                           | Optional            |
| `FILE_ROOT_DIR`              | The root directory where the application stores and manages files. The application will read and write files in this directory.                               | String  | `/data/jmalcloud_files`                                   | `/jmalcloud/files`                | Optional            |
| `MONITOR_IGNORE_FILE_PREFIX` | A list of file name prefixes to ignore for the file monitoring function, separated by commas `,`.                                                                 | String  | `.~,tmp_,cache_`                                          | `.DS_Store,._`                    | Optional            |
| `LOG_LEVEL`                  | Configures the root log output level for the application. Valid values typically include `trace`, `debug`, `info`, `warn`, `error`.                               | String  | `info`                                                    | `warn`                            | Optional            |

:::

**Start**
```bash
docker compose up -d
```

## JmalCloud address

JmalCloud address: http://{your_ip}:7070

## JmalCloud API address

JmalCloud API address: http://{your_ip}:7072/public/api

## Backup/Restore Database

### Backup Database

```bash
docker exec -it jmalcloud_mongodb mongodump -d jmalcloud -o /dump/back --gzip --quiet
```

### Restore Database

```bash
docker exec -it jmalcloud_mongodb mongorestore --gzip --nsInclude=jmalcloud.* --dir /dump/back --quiet
```
