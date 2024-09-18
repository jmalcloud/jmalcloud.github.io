# Reset Admin Password

```bash
# 1. Reset the password
docker exec -it jmalcloud_mongodb mongo jmalcloud --eval "db.getCollection('user').update({ 'creator': true }, {\$set: { 'password': '1000:c5b705ea13a1221f5e59110947ed806f8a978e955fbd2ed6:22508de12228c34a235454a0caf3bcaa5552858543258e56' }}, { 'multi': false, 'upsert': false })"
# 2. Restart the container
docker restart jmalcloud_server
# The reset password is: jmalcloud
```
