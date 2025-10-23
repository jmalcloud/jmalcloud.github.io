# 重置管理员密码

添加环境变量[RESET_ADMIN_PASSWORD](/guide/installation.html#reset-admin-password),
系统将在下次启动时将管理员密码重置, 具体密码请查看**日志**, 重置后请务必将 `RESET_ADMIN_PASSWORD` 移除或设置为false以防止重复重置。

```yaml
  services:
    jmalcloud:
      environment:
        RESET_ADMIN_PASSWORD: true
```
