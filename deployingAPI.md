# How to deploy your API on Vercel using the serverless function

</br>
</br>

---

## Step 1: api directory & function call

- Create a new directory at the root project, name it "api".

- Create a new file, name it "index.ts" (if you're using TS) or "index.js".

Inside, import and export your app.

exemple:

```text
import app from "../src/index";

export default app;

```

NB: dont forget to export your app inside your main file. See exemple below.

```text
// Start the server
app.listen(port, () => {
  console.log(`Server running on ${process.env.SERVER_URL}:${port}`);
});

// Export the app (dont forget this to deploy on Vercel as a serverless function)
export default app;
```

## Step 2 (optional, if you use TS): modify tsconfig.json

- add the api directory.

```text
  "include": ["src/**/*", "/api/*.ts"],
```

## Step 3: modify your package.json

- in scripts rules, add a new line "vercel-build"

```text
"vercel-build": "echo hello"
```

NB: Vercel need a command to build but it's not necessary, it's why we use "echo hello". I think there is a better way for that (have a try for your solution).

## Step 4: add vercel.json, routing

- Create a new file, name it "vercel.json"

We have to rewrite all incoming URLs to our main endpoint.

```test
{
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "api/"
        }
    ]
}
```

## Step 5: deploy using Vercel CLI (it expects a vercel account and the vercel CLI installed)

- In your terminal.

```text
vercel --prod
```

- Follow the guide...

NB: you can choose an existing project or create a new one.
  
## Step 5 bis: deploy using Github (it expects a vercel account, a project initialised and linked with your repository)

- This is simple, Vercel will auto-update after every commit.

## Step 6: populate your database (seed.ts)

__Needed:__</br> _A Github account connected to Vercel because on every commit, Vercel will auto-update your online project._

1 - Into your package.json, update "vercel-build" under "scripts" like this:

```json
"vercel-build": "prisma generate && prisma migrate deploy && ts-node prisma/seed.ts"
```

*__What happens in this snippet ?__*
</br>

_prisma generate_ : This command generates the Prisma client from your Prisma schema. This is necessary so that your application can interact with the database.
</br>

_prisma migrate deploy_ : This command applies all pending database migrations. This ensures that your database structure is up to date with your Prisma schema.</br>

_ts-node prisma/seed.ts_ : This command runs your database boot script, located in prisma/seed.ts. This script fills the database with initial data.

>[!WARNING]
> Dont forget to delete the command after your database is seeded (ts-node prisma/seed.ts)

After that, you have to keep :

```json
"vercel-build" : "prisma generate"
```

_**Why ?**_

Because of this bug :

```text
Prisma has detected that this project was built on Vercel, which caches dependencies.
This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered.
```

To fix this, make sure to run the `prisma generate` command during the build process.

*_Learn how: https://pris.ly/d/vercel-build_*

---
