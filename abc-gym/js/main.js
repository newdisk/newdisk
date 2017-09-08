document.addEventListener('DOMContentLoaded', function() {
	var modal_back = document.querySelector('.modal-back'),
		modals = document.querySelectorAll('.wpcf7'),
		btn_free = document.querySelector('.btn__free'),
		btn_call = document.querySelector('.btn__call'),
		form_submit = document.querySelector('.form_submit')


	btn_free.addEventListener('click', openModalFree);
	btn_call.addEventListener('click', openModalCall);
	modal_back.addEventListener('click', closeModals);
	// form_submit.addEventListener('click', closeModals);

	function openModalFree() {
		modals[0].classList.add('opened');
		modal_back.classList.add('opened');
	}

	function openModalCall() {
		modals[1].classList.add('opened');
		modal_back.classList.add('opened');
	}

	function closeModals() {
		for(var i = 0; i < modals.length; i++) {
			modals[i].classList.remove('opened');
		}
		modal_back.classList.remove('opened');
	}
})