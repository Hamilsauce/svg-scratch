export class Userform {
	constructor(root) {
		this.root = root;
	}

	_data = {
		newShift: {},
		isDisplayed: false
	}

	get data() {
		return this._data;
	}

	get isDisplayed() {
		return this._data.isDisplayed;
	}

	set isDisplayed(val) {
		this._data.isDisplayed = val;
	}
	
		get newShift() {
		return this._data.newShift;
}

	set newShift(val) {
		console.log('set ns');
		this._data.newShift = val;
		const formSubmitEvent = new CustomEvent('newShiftCreated', {
			detail: {shiftData: this.newShift},
			bubbles: true
		});
		console.log(formSubmitEvent);
		// this.root.dispatchEvent(formSubmitEvent)
	}

	toggle() {
		if (this.root.classList.contains('hide')) {
			setTimeout(() => {
				this.root.classList.remove('hide')
			}, 200)
		} else {
			setTimeout(() => {
				this.root.classList.add('hide')
			}, 200)
		}
	}
	submitFormData() {
		const formInputs  = [
			this.root.querySelector('.date-input'),
			this.root.querySelector('.hours-input'),
			this.root.querySelector('.details-input')
		]
		this.newShift = {
			date: formInputs[0].value,
			hours: formInputs[1].value,
			details: formInputs[2].value
		}
		// formInputs.forEach(input => {
		// 	input.value 
		// })
		this.root.querySelector('.userform').reset()
		
	}



	template() {
		return `
			<h3 class="form-modal-header">
				New Shift
			</h3>
			<form class="userform">
			<!--	<label for="author-name-input">Author</label>
				<input type="text" class="author-name-input text-input" name="author-name-input" id="author-name-input" value="" />
			-->
				<label for="date-input">Date</label>
				<input type="date" class="date-input" name="date-input" id="date-input" value="" />
				<label for="hours-input">Hours</label>
				<input type="number" class="hours-input number-input" name="hours-input" id="hours-input" value="" />
				<label for="detail-input">Details</label>
				<textarea rows="20" class="details-input text-input" name="details-input" id="details-input"></textarea>
				<div class="userform-button-container">
					<input class="userform-submit-button" type="submit" value="Submit" />
					<input class="userform-cancel-button" type="button" value="Cancel" />
				</div>
			</form>
		`;
	}
	render() {
		this.root.insertAdjacentHTML('beforeend', this.template());
		this.root.addEventListener('toggleForm', this.toggle)
		this.root.querySelector('.userform-submit-button')
			.addEventListener('click', e => {
				e.preventDefault()
				this.submitFormData()
				const toggleFormEvent = new CustomEvent('toggleForm', {
					detail: {},
					bubbles: true
				});
				e.target.dispatchEvent(toggleFormEvent)
			})
	}
}

{
	Userform
}