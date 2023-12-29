const fs = require("fs");
const nunjucks = require("nunjucks");
const MarkdownIt = require("markdown-it");
const { figure } = require("@mdit/plugin-figure");
const md = MarkdownIt({ html: true, breaks: true }).use(figure, {});
const juice = require("juice");
const path = require("path");
const Datauri = require("datauri/sync");

// Regex for markdown files within src
const markdownRegex = /\.md$/;
// Save all markdown files in the src directory to an array
const markdownFiles = fs.readdirSync("src").filter((file) => {
	return markdownRegex.test(file);
});

// Parse the markdownFiles array
const parsedMarkdownFiles = markdownFiles.map((file) => {
	const markdownContent = fs.readFileSync(path.join("src", file), "utf-8");
	const htmlContent = md.render(markdownContent);
	return { htmlContent };
});

// Parse json metadata file
let metadata = fs.readFileSync("src/metadata.json", "utf-8");
metadata = JSON.parse(metadata);

// Create a custom Nunjucks filter to replace newline characters with <br> tags
nunjucks.configure().addFilter("fmLinebreaks", (text) => {
	if (text) {
		return text.replace(/\n/g, "<br>");
	}
	return text;
});

const contentTemplate = `
<!doctype html>
<html lang="de">
	<head>
		<title>{{ metadata.title }}</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="{{ metadata.excerpt | safe }}">
		<link rel="stylesheet" href="assets/css/reset.css" />
		<link rel="stylesheet" href="assets/css/general.css" />
		<link rel="stylesheet" media="print" href="assets/css/print.css" />
		<link rel="stylesheet" media="screen" href="assets/css/screen.css" />
	</head>
	<body>
		<main>
			<div class="progressBar"></div>
			<article>
				<header>
					{% if metadata.cover_img %}
							<img src="{{ metadata.cover_img | safe }}" alt="" class="cover no-print" />
					{% endif %}
					<h1>{{ metadata.title | fmLinebreaks | safe }}</h1>
					<p class="subtitle">{{ metadata.subtitle | fmLinebreaks | safe }}</p>
				</header>
				<footer>
					<div class="container">
						{% if metadata.imprint_img %}
							<img src="{{ metadata.imprint_img | safe }}" alt="" class="no-print" />
						{% endif %}
						<table>
							{% for tr in metadata.imprint %}
							<tr>
								<th>{{ tr.label | fmLinebreaks | safe }}</th>
								<td>{{ tr.value | fmLinebreaks | safe }}</td>
							</tr>
							{% endfor %}
						</table>
					</div>
				</footer>
				{% for section in parsedMarkdownFiles %}
					<section>
					{{ section.htmlContent | safe }}
					</section>
				{% endfor %}
			</article>
		</main>
		<script src="assets/scripts/scrollbar.js"></script>
	</body>
</html>
`;

const coverTemplate = `
<!doctype html>
<html lang="de">
	<head>
		<title>{{ metadata.title }}</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="assets/css/reset.css" />
		<link rel="stylesheet" href="assets/css/general.css" />
		<link rel="stylesheet" media="print" href="assets/css/print.css" />
		<link rel="stylesheet" media="print" href="assets/css/cover.css" />
	</head>
	<body>
		<main>
			<article>
				<header>
					{% if metadata.cover_img %}
						<figure>
							<img src="{{ metadata.cover_img | safe }}" alt="" />
						</figure>
					{% endif %}
					<div class="title">
						<h1>{{ metadata.title | fmLinebreaks | safe }}</h1>
					</div>
				</header>
				<aside>
					<div class="cover-back">				
						<p class="title">{{ metadata.title | fmLinebreaks | safe }}</p>
						{% if metadata.subtitle %}
						<p class="subtitle">{{ metadata.subtitle | fmLinebreaks | safe }}</p>
						{% endif %}
						{% if metadata.excerpt %}
						<p class="excerpt">{{ metadata.excerpt | fmLinebreaks | safe }}</p>
						{% endif %}
					</div>
				</aside>
			</article>
		</main>
	</body>
</html>
`;

const renderedContent = nunjucks.renderString(contentTemplate, {
	metadata,
	parsedMarkdownFiles,
});

const renderedCover = nunjucks.renderString(coverTemplate, {
	metadata,
	parsedMarkdownFiles,
});

fs.writeFileSync("src/content.html", renderedContent);
fs.writeFileSync("src/cover.html", renderedCover);

// Assuming htmlFilePaths is an array of file paths
const htmlFilePaths = ["src/content.html", "src/cover.html"];

async function processHtmlFiles() {
	for (const file of htmlFilePaths) {
		// Wrap juice.juiceFile in a Promise for easier handling
		const juiceFileAsync = (file) => {
			return new Promise((resolve, reject) => {
				juice.juiceFile(
					file,
					{ applyStyleTags: false, removeStyleTags: false },
					(err, html) => {
						if (err) {
							reject(err);
						} else {
							resolve(html);
						}
					}
				);
			});
		};

		try {
			// Inline styles
			const inlinedHtml = await juiceFileAsync(file);

			// Convert image sources to data URIs
			const contentInlineDataUri = inlinedHtml.replace(
				/<img([^>]*)src="([^"]*)"([^>]*)>/g,
				(match, beforeSrc, src, afterSrc) => {
					const imagePath = path.join("src", src);
					const dataUri = new Datauri(imagePath);
					return `<img${beforeSrc}src="${dataUri.content}"${afterSrc}>`;
				}
			);

			// Write the inlined and image-converted HTML to a new file
			const outputFilePath = `src/${path.basename(file, ".html")}-inline.html`;
			fs.writeFileSync(outputFilePath, contentInlineDataUri);

			console.log(`Processed: ${file} -> ${outputFilePath}`);
		} catch (error) {
			console.error(`Error processing ${file}:`, error);
		}
	}
}

// Call the function
processHtmlFiles();
