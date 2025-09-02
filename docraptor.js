const axios = require("axios");
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
		method: "post",
		responseType: "arraybuffer", //IMPORTANT! Required to fetch the binary PDF
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			user_credentials: process.env.DOCRAPTOR_KEY,
			doc: {
				test: true, // test documents are free but watermarked
				document_type: "pdf",
				document_content: files[i].path,
				// document_url: "https://docraptor.com/examples/invoice.html",
				// javascript: true,
				prince_options: {
					media: "print", // @media 'screen' or 'print' CSS
					profile: "PDF/X-4",
					// baseurl: "https://yoursite.com", // the base URL for any relative URLs
				}
			},
		},
	};

	axios(config)
		.then(function (response) {
			fs.writeFile(
				`./pdf/${files[i].name}.pdf`,
				response.data,
				"binary",
				function (writeErr) {
					if (writeErr) throw writeErr;
					console.log(`Saved ${files[i].name}.pdf!`);
				},
			);
		})
		.catch(function (error) {
			// DocRaptor error messages are contained in the response body
			// Since the response is binary encoded, let's decode
			var decoder = new TextDecoder("utf-8");
			console.log(decoder.decode(error.response.data));
		});
}
