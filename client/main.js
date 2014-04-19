import FragmentEditor from './ui/fragmenteditor';

document.addEventListener("DOMContentLoaded", function() {
	console.log("GO");
	let container = document.querySelector('.container'),
		editor1    = new FragmentEditor,
		editor2    = new FragmentEditor;

	editor1.attachTo(container);
	editor1.focus();
	editor2.attachTo(container);
}, false);

