import FragmentEditor from './ui/fragmenteditor';

document.addEventListener("DOMContentLoaded", function() {
	let container = document.querySelector('.container'),
		editor1    = new FragmentEditor(),
		editor2    = new FragmentEditor({ bold : true });

	editor1.attachTo(container);
	editor1.focus();
	editor2.attachTo(container);
}, false);

