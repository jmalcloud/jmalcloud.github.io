# Development

#### Environment Preparation:
- jdk21+
- node v16.x.x

## Backend
##### 1. Clone the backend project
```shell
git clone https://github.com/jamebal/jmal-cloud-server.git
```
##### 2. Modify the configuration file `src/main/resources/file.yml`
Change the parameters `rootDir` and `ip2region-db-path` to your own directories, then you can start the service.

## Frontend
##### 1. Clone the frontend project
```shell
git clone https://github.com/jamebal/jmal-cloud-view.git
```
##### 2. Execute in the project directory
```shell
npm install
```
##### 3. Start
```shell
npm run dev
```
