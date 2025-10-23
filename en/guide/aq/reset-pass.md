# Reset Admin Password

Add the environment variable [RESET_ADMIN_PASSWORD](/guide/installation.html#reset-admin-password),

The system will reset the admin password to the default value jmalcloud on the next startup. Please make sure to remove or set `RESET_ADMIN_PASSWORD` to false to prevent repeated resets.

```yaml
services:
  jmalcloud:
    environment:
      RESET_ADMIN_PASSWORD: true
```
