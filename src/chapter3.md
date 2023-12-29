## Metadata

We need some overall metadata which is placed in a json file called `metadata.json` as well directly in the `src` folder.

The following keys are excpected:

``` json
{
  "title": "md-book-with-docraptor",
  "subtitle": "A node.js app to convert markdown to PDF using Docraptor",
  "imprint": [
    { "label": "Text", "value": "Stefan Brechbühl" },
    { "label": "Images", "value": "Screenshots" },
    {
      "label": "Process",
      "value": "Markdown → HTML → PDF"
    },
    {
      "label": "Print",
      "value": "Name of the printing company"
    },
    {
      "label": "Website",
      "value": "<a href='https://stebre.ch'>stebre.ch</a>"
    }
  ],
  "cover_img": "assets/images/cover.png",
  "imprint_img": "assets/images/cover-photo.png",
  "excerpt": "The excerpt is a short description of the book. It is used on the back cover and as meta description."
}
```
