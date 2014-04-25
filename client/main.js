import { Stream } from 'streamy/stream';
import { Fragment } from './ui/fragment';
import { Properties, Formats, Editors } from './ui/properties';
import { Dom, Query } from 'ui/dom';

import { StringValue } from 'streamy/value';

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
		.sequence(["$ 0,0.00", "0.000", "0,0"], 2000, true)
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

	// add text editor
	Editors.addText(editor);
	editor.editor.value.feed(editor.text);
	editor.editor.focus();

	window.editor = editor.editor;

	// test cancel
	// let s = Stream.sequence([1,2,3], 200, true).cancelOn(Stream.delay(5000));
	// s.log("S");
	// let m = s.map((v) => -v * 9).cancelOn(Stream.delay(2500));
	// m.log("M");
});

