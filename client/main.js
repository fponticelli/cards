import FragmentEditor from './ui/fragmenteditor';

document.addEventListener("DOMContentLoaded", function() {
	console.log("GO");
	let container = document.querySelector('.container'),
		editor    = new FragmentEditor;

	editor.attachTo(container);
	editor.focus();
}, false);

