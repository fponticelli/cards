import FragmentEditor from './ui/fragmenteditor';
import { NumberFragment } from './ui/fragments/number';
import { Stream } from 'cards/model/stream';

document.addEventListener("DOMContentLoaded", function() {
	let container = document.querySelector('.container'),
		editor1   = new FragmentEditor(),
		editor2   = new FragmentEditor({ strong : true }),
		number    = new NumberFragment();

	editor1.attachTo(container);
	editor1.focus();
	editor2.attachTo(container);
	editor1.text
		.map((t) => t.length > 0)
		.unique()
		.log();
	number.attachTo(container);

	number.format.set("$ 0,0.00");
	Stream.signal(1000)
		.reduce(0, (acc) => acc + 3/7)
		.subscribe((v) => number.value.set(v));
}, false);

