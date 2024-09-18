# 添加本地目录到网盘

## 概述

添加本地目录可以将本地文件夹挂载到网盘中，使其在网盘界面可见和可访问。

## jmalcloud 目录结构

jmalcloud 的主要文件存储在 `/jmalcloud/files/` 目录下，结构如下：

```
/jmalcloud/files/
├─ luceneIndex/            # 全文搜索索引文件夹
├─ ugyuvgbhnouvghjbnk/     # 临时文件夹
├─ logo-1699437502995.svg  # 网盘 logo 文件
├─ admin/                  # 用户 0 文件夹
├─ user1/                  # 用户 1 文件夹
├─ user2/                  # 用户 2 文件夹
├─ user3/                  # 用户 3 文件夹
```

## 添加本地目录到网盘

### 步骤 1：配置 docker-compose.yml

::: tip **重要提示：**
本地目录必须挂载到某个用户的文件夹下，否则系统将无法扫描到。
:::

在 `docker-compose.yml` 文件中添加挂载路径。例如，要将系统文件夹 `/home/test/doc` 挂载到 `admin` 用户的网盘中：

```yaml
volumes:
  - /home/test/jmalcloud/files:/jmalcloud/files
  - /home/test/doc:/jmalcloud/files/admin/doc
```

### 步骤 2：重启 Docker 容器

使用以下命令重启 Docker 容器：

```bash
docker-compose up -d
```

### 步骤 3：重建索引

在网盘设置中点击"重建索引"。这将扫描整个 `/jmalcloud/files` 目录。

扫描完成后，`/home/test/doc` 目录将出现在 `admin` 用户的网盘文件夹中。

## 注意事项

挂载的文件夹需要相互独立，避免嵌套关系。例如：

✅ 正确示例：
```yaml
volumes:
  - /home/test/doc/files:/jmalcloud/files
  - /home/test/abc:/jmalcloud/files/admin/abc
```

❌ 错误示例：
```yaml
volumes:
  - /home/test/doc/files:/jmalcloud/files
  - /home/test/doc:/jmalcloud/files/admin/doc
```
