const request = require("request");
const fs = require("fs");
require("dotenv").config();

const files = [];
const content = {
	name: "content",
	path: fs.readFileSync("./src/content-inline.html", "utf8"),
};
const cover = {
	name: "cover",
	path: fs.readFileSync("./src/cover-inline.html", "utf8"),
};
files.push(content, cover);

for (let i = 0; i < files.length; i++) {
	config = {
		url: "https://api.docraptor.com/docs",
		encoding: null, //IMPORTANT! This produces a binary body response instead of text
		headers: {
			"Content-Type": "application/json",
		},
		json: {
			user_credentials: process.env.DOCRAPTOR_KEY,
			doc: {
				document_content: files[i].path,
				type: "pdf",
				test: true,
				prince_options: {
					media: "print",
					profile: "PDF/X-4",
				},
			},
		},
	};

	request.post(config, function (err, response, body) {
		fs.writeFile(
			`./pdf/${files[i].name}.pdf`,
			body,
			"binary",
			function (writeErr) {
				console.log(`${files[i].name}.pdf has been saved!`);
			}
		);
	});
}
