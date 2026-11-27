# Backup and recovery

The application does not run backups. Atlas and Cloudinary must be configured by an administrator.

## MongoDB

1. Enable Atlas scheduled backups on the production cluster before launch.
2. Restore into a new database name, never over the only copy.
3. Point a staging `MONGODB_URI` at the restored database and run the smoke tests in `docs/DEPLOYMENT_GUIDE.md`.
4. Record the backup time, restore time, and whether a known room document was readable.
5. Development database `peacock_beach_dev` is not a production backup.

A restore test has not been executed in this phase.

## Cloudinary

1. Confirm the account has its own backup or a periodic export of asset public ids.
2. The app stores public ids on room and event documents. A database restore without the matching media leaves broken images.
3. Deleting an asset in Cloudinary does not automatically edit the room document.

## Application

1. Keep the git commit of each production deploy.
2. Secrets are not in git. A repository restore does not restore `.env.local`.
3. Staff recovery is `pnpm db:revoke-staff` with `STAFF_ACTION=disable` or `revoke`, after approval. There is no emailed password reset.
