(() => {
	let is_backdrop = false;

	const dialog_captcha = document.querySelector('.dialog_captcha');
	const body = document.body;

	const Helpers = {
		Dialog: {
			open() {
				document.querySelector('#backdrop').classList.add('backdrop');
				dialog_captcha.setAttribute('open', true);
			},
			close() {
				document.querySelector('#backdrop').classList.remove('backdrop');
				dialog_captcha.removeAttribute('open');
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
			Helpers.Dialog.open();
		}
		else {
			console.log(event.target.submit());
		}
	});

	document.querySelector('.form_captcha').addEventListener('submit', (event) => {
		event.preventDefault();

		const url = '/captcha/confirm';

		const captcha = document.querySelector('#txt').value;

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

				const message = dialog_captcha.querySelector('.message')

				if (data) {
					captcha_confirm = true;
					message.innerText = 'Success';
					Helpers.Spam.restartAttempt();

					setTimeout(() => {
						Helpers.Dialog.close();
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

	document.querySelector('.close').addEventListener('click', () => {
		Helpers.Dialog.close()
	});

	if (document.querySelectorAll('report')) {
		for (report of document.querySelectorAll('.report')) {
			report.addEventListener('click', (event) => {
				alert('ok')
			});
		}
	}
})();


