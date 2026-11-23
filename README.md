This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Setter Academy (`/academy`)

Internal training for setters, editable by admins from the page itself. Not linked anywhere, blocked in robots.txt and marked noindex. Nothing is sent to the browser until someone logs in.

- **Logins:** username plus password. Starter accounts are in `app/academy/content.ts` (`SEED_USERS`, stored as hashes); after that the team lives in Blob storage and is managed from the Team tab.
- **Admins** can edit every stage and topic, the page settings, the team (add, remove, roles, password resets) and restore any earlier version from History. Setters can read and change their own password.
- **Storage:** private Vercel Blob store `pva-setter-academy` (`BLOB_READ_WRITE_TOKEN`). `academy/content.json`, `academy/users.json`, and `academy/history/` with the last 100 saves. Locally, without the token, it uses `.academy-data/`.
- **Env:** `ACADEMY_SECRET` (32+ random characters) signs the login cookie. Changing it logs everyone out.
- `app/academy/content.ts` is only the starting content; once an admin saves, the stored copy is what everyone sees.
- **Scoreboard:** weekly numbers from JustCall (`JUSTCALL_API_KEY`, `JUSTCALL_API_SECRET`), both normal calls and Sales Dialer. Cached per week in Blob; today and yesterday refresh at most every 3 minutes while someone is looking. A call counts as booked when its JustCall result contains a booking word (admin setting, default "booked"). Admins link team members to JustCall users under Scoreboard → Settings.
