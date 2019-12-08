(() => {

    const Helpers = {
		Dialog: {
			open(selector) {
				document.querySelector('#backdrop').classList.add('backdrop');
				document.querySelector(selector).setAttribute('open', true);
			},
			close(selector) {
				document.querySelector('#backdrop').classList.remove('backdrop');
				document.querySelector(selector).removeAttribute('open');
			}
		},
		Spam: {
			isAllowed() {
				const attempt = sessionStorage.getItem('attempt');

				if (attempt === null) {
					sessionStorage.setItem('attempt', 5);
				}
				console.log(`isAllowed ${attempt}`);

				return sessionStorage.getItem('attempt') > 0;
			},
			restartAttempt() {
				sessionStorage.setItem('attempt', 5);
				console.log(sessionStorage.getItem('attempt'))
			},
			failAttempt() {
				let attempt = sessionStorage.getItem('attempt');
				attempt--;
				sessionStorage.setItem('attempt', attempt)
			}
		}
	};

	let captcha_confirm = false;

	document.querySelector('.post').addEventListener('submit', (event) => {
		event.preventDefault();

		if (! captcha_confirm) {
			Helpers.Dialog.open('.dialog_captcha');
		}
		else {
			console.log(event.target.submit());
		}
	});

	// number chars left start
    const limit = 1000;
    const post_textarea = document.querySelector('textarea');
    const chars_left = document.querySelector('#chars_left');
    const post_textarea_content_length = post_textarea.value.length;
    chars_left.innerHTML = `${limit - post_textarea_content_length} character${(limit - post_textarea_content_length) >= 2 ? 's' : ''} left`;


	function getHashTags(inputText) {
		var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
		var matches = [];
		var match;

		while ((match = regex.exec(inputText))) {
			matches.push(match[1]);
		}

		return matches;
	}

    post_textarea.addEventListener('keyup', (event) => {
        const content = event.target.value;
        const nb_char_left = limit - content.length;
        chars_left.innerHTML = `${nb_char_left} character${nb_char_left >= 2 ? 's' : ''} left`;

        // hash tag
		const hash_tags_input =  document.querySelector('#hash_tags');fribt
		hash_tags_input.value = '';
		hash_tags_input.placeholder = ''
		const hash_tags = getHashTags(content);
		let value_input = hash_tags_input.value;
		for (hash_tag of hash_tags) {
			value_input += `#${hash_tag} `;
		}
		hash_tags_input.value = value_input
    });
    // number chars left end

	// replace hashtag
	document.querySelectorAll('.card-post .card-body').forEach((card_body, index) => {
		const innerHTML = card_body.innerHTML;
		const result = innerHTML.replace(/(#\S*)/g, (hashtag) => {
			const hash=hashtag.substr(1);
			return `<a href='/hashtag/${hash}'>#${hash}</a>`
		});
		card_body.innerHTML = result;

	});
	// end replace hashtag

	document.querySelector('.form_captcha').addEventListener('submit', (event) => {
		event.preventDefault();

		const this_form = event.target;
		const this_dialog = this_form.closest('dialog');

		const url = '/captcha/confirm';

		const captcha = this_form.querySelector('.txt').value;

		const data = {
			captcha
		};

		if (Helpers.Spam.isAllowed()) {
			fetch(url, {
				method: 'POST',
				headers: new Headers({ "Content-Type": "application/json" }),
				body: JSON.stringify(data)
			})
			.then((response) => {
				return response.json();
			})
			.then((data) => {

				const message = this_dialog.querySelector('.message');

				if (data) {
					captcha_confirm = true;
					message.innerText = 'Success';
					Helpers.Spam.restartAttempt();

					setTimeout(() => {
						Helpers.Dialog.close('.dialog_captcha');
					}, 3000)

				}
				else {
					console.log('no');
					message.innerText = 'Fail';
					captcha_confirm = false;
					Helpers.Spam.failAttempt();

					setTimeout(() => {
						document.location.reload();
					}, 3000)
				}
			})
			.then((response) => {
				return response.json();
			})
			.then((data) => {

				const message = this_dialog.querySelector('.message');

				if (data) {
					captcha_confirm = true;
					message.innerText = 'Success';
					Helpers.Spam.restartAttempt();

					setTimeout(() => {
						Helpers.Dialog.close('.dialog_captcha');
					}, 3000)
					
				}
				else {
					console.log('no');
					message.innerText = 'Fail';
					captcha_confirm = false;
					Helpers.Spam.failAttempt();

					setTimeout(() => {
						document.location.reload();
					}, 3000)
				}
			})
		}
		else {
			alert('too much fails')
		}
	});

	// Close
	for (close of document.querySelectorAll('.close')) {
		close.addEventListener('click', (event) => {
			const class_modal = event.target.closest('dialog').className;
			Helpers.Dialog.close(`.${class_modal}`);
		})
	}

	if (document.querySelectorAll('.report')) {
		let id = '';

		for (report of document.querySelectorAll('.report')) {
			report.addEventListener('click', (event) => {
				id = event.target.dataset.id;
				Helpers.Dialog.open('.dialog_report')
			});
		}

		document.querySelector('.dialog_report').querySelector('form').addEventListener('submit', (event) => {
			event.preventDefault();

			const this_form = event.target;
			const this_dialog = this_form.closest('dialog');

			const report = this_form.querySelector('#report').value;
			const url_report = window.location.href;

			const data = {
				report,
				url_report
			};

			const url = '/report';

			fetch(url, {
				method: 'POST',
				headers: new Headers({ "Content-Type": "application/json" }),
				body: JSON.stringify(data)
			})
			.then((response) => {
				return response.json();
			})
			.then((data) => {

				const message = this_dialog.querySelector('.message');

				if (data) {

					Helpers.Spam.restartAttempt();

					setTimeout(() => {
						Helpers.Dialog.close('.dialog_captcha');
					}, 3000)
				}
			});
		});
	}
})();