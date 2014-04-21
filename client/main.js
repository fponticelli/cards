import { Stream } from 'cards/model/stream';
import { Fragment } from './ui/fragment';
import { Properties } from './ui/properties';

document.addEventListener("DOMContentLoaded", function() {
	let container = document.querySelector('.container'),
		number    = new Fragment(),
		fragment  = new Fragment();

	number.attachTo(container);
	fragment.attachTo(container);

	// add text property and rendering
	Properties.addText(fragment);
	Properties.addText(number);

	// add a value
	Properties.addValue(fragment, "String");
	fragment.properties.value = " Hey Franco";
	// manually wire value to text
	fragment.properties.value.feed(fragment.properties.text);

	Properties.addValue(number, "Float");

	// make it blink
	Properties.addVisible(fragment);
	Stream.interval(300)
		.cancelOn(Stream.delay(6500).subscribe(() => Properties.removeVisible(fragment)))
		.reduce(true, (acc) => !acc)
		.feed(fragment.properties.visible);

	// make bold
	Properties.addStrong(fragment, true);

	// add format
	Properties.addNumericFormat(number, "$ 0,0.00");

	// add link
	Properties.addLink(number, "http://google.com");
	// remove link after 5 secs
	Stream.delay(5000)
		.subscribe(() => Properties.removeLink(number));

	// remove tooltip after 8 secs
	Stream.delay(8000)
		.subscribe(() => Properties.removeTooltip(number));

	// add tooltip
	Properties.addTooltip(number, "tooltip text goes here");

	// update number
	Stream.interval(1000)
		.reduce(0, (acc) => acc + 3/7)
		.feed(number.properties.value);
}, false);

