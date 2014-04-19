import FragmentEditor from './ui/fragmenteditor';
import { Stream } from 'cards/model/stream';

document.addEventListener("DOMContentLoaded", function() {
	let container = document.querySelector('.container'),
		editor1    = new FragmentEditor(),
		editor2    = new FragmentEditor({ strong : true });

	editor1.attachTo(container);
	editor1.focus();
	editor2.attachTo(container);
	editor1.text
		.map((t) => t.length > 0)
		.unique()
		.log();
}, false);

