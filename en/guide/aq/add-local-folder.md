# Add Local Directory to Cloud Disk

## Overview

Adding a local directory allows you to mount a local folder into the cloud disk, making it visible and accessible in the cloud disk interface.

## JmalCloud Directory Structure

The main files of JmalCloud are stored in the `/jmalcloud/files/` directory, structured as follows:

```
/jmalcloud/files/
├─ luceneIndex/            # Full-text search index folder
├─ ugyuvgbhnouvghjbnk/     # Temporary folder
├─ logo-1699437502995.svg  # Cloud disk logo file
├─ admin/                  # User 0 folder
├─ user1/                  # User 1 folder
├─ user2/                  # User 2 folder
├─ user3/                  # User 3 folder
```

## Add Local Directory to Cloud Disk

### Step 1: Configure `docker-compose.yml`

::: tip **Important Note:**
The local directory must be mounted under a user's folder; otherwise, the system will not be able to scan it.
:::

Add the mount path in the `docker-compose.yml` file. For example, to mount the system folder `/home/test/doc` to the `admin` user's cloud disk:

```yaml
volumes:
  - /home/test/jmalcloud/files:/jmalcloud/files
  - /home/test/doc:/jmalcloud/files/admin/doc
```

### Step 2: Restart Docker Container

Restart the Docker container using the following command:

```bash
docker-compose up -d
```

### Step 3: Rebuild Index

Click "Rebuild Index" in the cloud disk settings. This will scan the entire `/jmalcloud/files` directory.

After the scan is complete, the `/home/test/doc` directory will appear in the `admin` user's cloud disk folder.

## Notes

Mounted folders need to be independent of each other to avoid nested relationships. For example:

✅ Correct Example:
```yaml
volumes:
  - /home/test/doc/files:/jmalcloud/files
  - /home/test/abc:/jmalcloud/files/admin/abc
```

❌ Incorrect Example:
```yaml
volumes:
  - /home/test/doc/files:/jmalcloud/files
  - /home/test/doc:/jmalcloud/files/admin/doc
```
