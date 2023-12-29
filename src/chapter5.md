## Use the scripts

There are two scripts in this repository:

1. `md2html.js` creates a html of the content and the cover. Of both there will be an additional version which includes the assets (styles, images) inline.
2. `docraptor.js` sends two requests to Docraptor. One with `content-inline.html`, the other with `cover-inline.html`.

To run the scripts you need to write 

- `npm html` / `yarn html` or
- `npm pdf` / `yarn pdf` 

in the terminal.

***

If you want to run both with one command, use:

``` sh
npm start
```

or

``` sh
yarn start
```
