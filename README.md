# Try it out

Originally written for my own [blog, check it out here](https://maharshi.ninja).

# Installation

Clone this repo  and then:
```shell
yarn install
yarn run build
```

Continue to add an navigation panel (`vendor/NavPanel.vue`, example is in `examples/NavPanel.vue`).

Now copy the build folder to the root folder of whatever site you are hosting. In production, DAVBlog by default expects a WebDAV-capable share on the `dav` subdomain of the domain it's being hosted on.

What that means is, if you are hosting DAVBlog on `example.com`, then `dav.example.com` must be DAV-capable (and ensure CORS is set up).

# index.json format for directory listing

While DAVBlog V1 relied on the WebDAV server to list files, and then used that to build the directory listing, DAVBlog V2 does not rely on PROPFIND-based directory listing for privacy reasons. I specifically implemented this to be able to have non-indexable directories or directories with hidden files.

The index must be stored in the `index.json` file in the directory. Format as follows below:

```json5
[
  {
    // Full path
    "filename": "/blog/2020-01-01-haha.md",
    // Only the filename
    "basename": "2020-01-01-haha.md"
  }
]
```

In the future this may be simplified to just being an array of paths.
