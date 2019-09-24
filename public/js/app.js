(() => {
	let is_backdrop = false;

	const dialog_captcha = document.querySelector('.dialog_captcha');
	const body = document.body;

	const Helpers = {
		Dialog: {
			open() {
				body.classList.add('back-drop');
				dialog_captcha.setAttribute('open', true)
			},
			close() {
				body.classList.remove('back-drop');
				dialog_captcha.removeAttribute('open')
			}
		}
	}

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

	const form_captcha = document.querySelector('.form_captcha').addEventListener('submit', (event) => {
		event.preventDefault();

		const url = '/captcha/confirm';

		const captcha = document.querySelector('#txt').value;

		const data = {
			captcha
		};

		fetch(url, {
			method: 'POST',
			headers: new Headers({ "Content-Type": "application/json" }),
			body: JSON.stringify(data)
		})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data) {
				console.log('ok')
				captcha_confirm = true;

				const message = dialog_captcha.querySelector('.message')
				message.innerText = 'Success'

				setTimeout(() => {
					Helpers.Dialog.close();
				}, 3000)
				
			}
			else {
				console.log('no')
				captcha_confirm = false;
			}
		})
	});

	document.querySelector('.close').addEventListener('click', () => {
		Helpers.Dialog.close()
	});
})();


