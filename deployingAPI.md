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
  console.log(`Server running on ${process.env.SERVER_URI}:${port}`);
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

---
