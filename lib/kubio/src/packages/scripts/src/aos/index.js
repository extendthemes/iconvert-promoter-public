const onAnimationEnd = (event) => {
	const { target } = event;
	target.removeEventListener('animationend', onAnimationEnd);
	setTimeout(() => {
		target.classList.add('kubio-aos-hide-animation');
	}, 50);
};

const observe = (element) => {
	const intersectionObserver = new window.IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const { target, isIntersecting } = entry;
				if (
					!isIntersecting ||
					target.getAttribute('data-kubio-aos-executed')
				) {
					return;
				}

				target.setAttribute('data-kubio-aos-executed', true);
				target.addEventListener('animationend', onAnimationEnd);
				setTimeout(() => {
					target.classList.add(
						'animated',
						target.getAttribute('data-kubio-aos')
					);
				}, 50);
				intersectionObserver.disconnect();
			});
		},
		{
			threshold: 0.1,
		}
	);

	intersectionObserver.observe(element);
};

const ready = (callback) => {
	// in case the document is already rendered
	if (document.readyState !== 'loading') callback();
	// modern browsers
	else if (document.addEventListener)
		document.addEventListener('DOMContentLoaded', callback);
	// IE <= 8
	else
		document.attachEvent('onreadystatechange', function () {
			if (document.readyState === 'complete') callback();
		});
};

ready(() =>
	[...document.querySelectorAll('[data-kubio-aos]')].forEach(observe)
);
