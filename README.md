# Music Library Template Using Astro


##  Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text

├── astro.config.mjs
├── package.json
├── package-lock.json
├── public
│   ├── favicon.svg
│   └── music/  <--- Put your music here
├── README.md
├── src/
    ├── astro.config.mjs
    ├── components
    │   └── qwik/
    ├── content
    │   ├── astro.config.mjs
    │   ├── config.ts
    │   └── songs/
    ├── convert.ts  <--- Then run this 
    ├── env.d.ts
    ├── js
    │   ├── types.ts
    │   └── utils.ts
    ├── layouts
    │   └── Layout.astro
    ├── local.js
    ├── pages
    │   ├── albums
    │   │   ├── index.astro
    │   │   └── [...slug].astro
    │   ├── api/
    │   ├── index.astro
    │   └── songs/
    │       ├── index.astro
    │       └── [...slug].astro
    └── styles
```

In the `convert.ts` file, songs are retrieved from the `./public/music/` folder. You can also store your music files in a subdirectory and adjust the path accordingly. 
The script scans directories within this project for song files. 
Currently, it supports only `.mp3`, `.m4a`, and `.wav` formats (note: there was an issue with one `.wav` file generating incorrect JSON).

The duration field is required; all other fields are optional.



## Known bugs

Contents of `content.ts` needs to be commentted so it will be ignored during build process.

## Important Note

Please ensure that you use only music files that you are permitted to use. 

