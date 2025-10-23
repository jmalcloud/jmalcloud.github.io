# dev

#### 环境准备:
- jdk21+
- node v16.x.x

## 服务端
##### 1、克隆服务端项目
```shell
git clone  https://github.com/jamebal/jmal-cloud-server.git
```
##### 2、修改配置文件 `src/main/resources/file.yml`
修改参数`rootDir` 和 `ip2region-db-path` 改为自己的目录, 即可启动服务

## web端
##### 1、克隆web端项目
```shell
git clone https://github.com/jamebal/jmal-cloud-view.git
```
##### 2、项目目录下执行
```shell
npm install
```
##### 3、启动
```shell
npm run dev
```
