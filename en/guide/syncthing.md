# # Work with [Syncthing](https://syncthing.net/) for file synchronization

## Just add the following configuration to your existing docker-compose
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

### Complete example:
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
