import { Stream } from 'streamy/stream';
import { Fragment } from './ui/fragment';
import { Properties, Formats } from './ui/properties';
import { Dom, Query } from 'ui/dom';

Dom.ready(() => {
	let container = document.querySelector('.container'),
		editor    = new Fragment(),
		number    = new Fragment(),
		fragment  = new Fragment();

	editor.attachTo(container);
	number.attachTo(container);
	fragment.attachTo(container);

	// add text property and rendering
	Properties.addText(editor);
	Properties.addText(fragment);
	Properties.addText(number);

	// add a value
	Properties.addValue(fragment, "String");
	fragment.value = " Hey Franco";
	// manually wire value to text
	fragment.value.feed(fragment.text);

	Properties.addValue(number, "Float");

	// make it blink
	Properties.addVisible(fragment);
	Stream.interval(300)
		.cancelOn(Stream.delay(6500).subscribe(() => Properties.removeVisible(fragment)))
		.reduce(true, (acc) => !acc)
		.feed(fragment.visible);

	// make bold
	Properties.addStrong(fragment, true);

	// add format
	Formats.addNumeric(number, "$ 0,0.00");

	// change format dynamically
	Stream
		.sequence(2000, ["$ 0,0.00", "0.000", "0,0"], true)
		.feed(number.format);

	// add link
	Properties.addLink(number);
	number.link = "http://google.com";

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
		.reduce(0, (acc) => acc + 3000/7)
		//.subscribe(() => console.log(JSON.stringify(number)))
		//.subscribe(() => console.log(number.properties()))
		.feed(number.value);

	// attempt at adding text editor
	editor.addPropertyValue("editor", {}, function(prop, el) {
		let text = editor.text;
		if(!text) {
			throw new Error("'editor' requires the property 'text'");
		}
		let content = Query.first('.content', el),
			stream  = text.map((s) => s.length === 0).unique(),
			streamƒ = Dom.stream(stream).applySwapClass(content, 'empty'),
			listenƒ = (e) => {
				text.push(el.innerText);
			};
		content.setAttribute("contenteditable", true);
		content.addEventListener("input", listenƒ, false);
		prop.focus = () => content.focus();
		return function() {
			streamƒ();
			content.removeEventListener("input", listenƒ, false);
			content.removeAttribute("contenteditable");
		};
	});
	editor.editor.focus();
});

