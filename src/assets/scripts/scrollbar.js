/* Credits: https://dev.to/sagnik77/javascript-page-scroll-progress-bar-1na9 */
const progressBar = document.querySelector(".progressBar");
const main = document.querySelector("main");

const scrollProgressBar = () => {
	let scrollDistance = -main.getBoundingClientRect().top;
	let progressPercentage =
		(scrollDistance /
			(main.getBoundingClientRect().height -
				document.documentElement.clientHeight)) *
		100;

	let val = Math.floor(progressPercentage);
	progressBar.style.width = val + "%";

	if (val < 0) {
		progressBar.style.width = "0%";
	}
};

window.addEventListener("scroll", scrollProgressBar);
