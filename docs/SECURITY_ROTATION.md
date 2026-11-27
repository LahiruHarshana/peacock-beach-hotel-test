# Credential rotation

Do this by hand in each vendor console. Do not paste new secrets into chat, tickets, logs, or git. Do not run `pnpm db:revoke-staff` against the live database until the operator named below approves that exact email and action.

`scripts/revoke-staff.ts` connects with `MONGODB_URI` from `.env.local`. `STAFF_ACTION=disable` sets the account to `DISABLED` and increments `tokenVersion`. `STAFF_ACTION=revoke` only increments `tokenVersion`. Both make existing JWTs fail the next privileged request. The script does not print the password. It does not delete the account.

## MongoDB Atlas

1. In Atlas, create a new password for the application database user, or create a new user and retire the old one.
2. Restrict network access to the hosting provider. Do not leave `0.0.0.0/0` on a production user.
3. Put the new URI only in the host’s secret store and in local `.env.local` for the person who develops.
4. Use a separate database name from `peacock_beach_dev` for production.
5. After the new URI is saved, confirm the app connects with `pnpm db:indexes` against that database only.

## Cloudinary

1. Rotate the API secret in the Cloudinary console.
2. Update `CLOUDINARY_API_SECRET` in the host secret store. The cloud name and API key stay server-only as well. None of the three belong in `NEXT_PUBLIC_*`.
3. Confirm a signed upload still lands in `peacock/{category}` and that an unverified public id cannot be published.

## Auth.js

1. Generate a new `AUTH_SECRET` of at least 32 characters (`openssl rand -base64 32`). Use a different value in staging and production.
2. Changing the secret invalidates existing JWTs.
3. Sessions are JWTs, 8 hours, because the credentials provider requires JWT. Authorization does not trust the role inside the token. Each privileged request reloads the user from MongoDB and checks `status`, `role`, and `tokenVersion`.

## Bootstrap admin

1. The seeded account is `admin@peacockbeach.local` if `pnpm db:seed-admin` was run. Re-running the seed does not reset an existing password.
2. After rotation, sign in once, change the password through a direct database update performed by an administrator, or disable that account and create a named staff user. There is no self-service password reset.
3. Store the new password in a password manager. Do not leave the original seed password in a chat transcript as the live password.

## After rotation

1. Confirm `.env.local` is gitignored (`git check-ignore -v .env.local` once the root is a git repository).
2. Confirm `.env.example` still has placeholders only.
3. Run `pnpm scan-secrets`. It reports file paths and pattern names, not secret values.
4. Revoke staff sessions only with explicit approval, one email at a time.
