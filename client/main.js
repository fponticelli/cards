import { Stream } from 'streamy/stream';
import { Fragment } from './ui/fragment';
import { Dom, Query } from 'ui/dom';
import { StringValue } from 'streamy/value';
import {
	TextProperty, ValueProperty, VisibleProperty, LinkProperty,
	StrongProperty, NumericFormatProperty, TooltipProperty,
	TextEditorProperty
} from './properties/types';

Dom.ready(() => {
	let container    = Query.first('.container'),
		editor       = new Fragment(),
		number       = new Fragment(),
		fragment     = new Fragment(),
		text         = new TextProperty(),
		stringValue  = new ValueProperty("String"),
		floatValue   = new ValueProperty("Float"),
		visible      = new VisibleProperty(),
		strong       = new StrongProperty(true),
		formatNumber = new NumericFormatProperty(),
		link         = new LinkProperty(),
		tooltip      = new TooltipProperty("tooltip text goes here"),
		textEditor   = new TextEditorProperty();

	editor.attachTo(container);
	number.attachTo(container);
	fragment.attachTo(container);

	// add text property and rendering
	editor.properties.add(text);
	fragment.properties.add(text);
	number.properties.add(text);

	// add a value
	fragment.properties.add(stringValue);
	fragment.value = " Hey Franco";
	// manually wire value to text
	fragment.value.feed(fragment.text);

	// make it blink
	fragment.properties.add(visible);
	Stream.interval(300)
		.cancelOn(Stream.delay(6500).subscribe(() => fragment.properties.remove(visible)))
		.reduce(true, (acc) => !acc)
		.feed(fragment.visible);

	// make bold
	fragment.properties.add(strong);

	// add number value and format
	number.properties.add(floatValue);
	number.properties.add(formatNumber);

	// change format dynamically
	Stream
		.sequence(["$ 0,0.00", "0.000", "0,0"], 2000, true)
		.feed(number.format);

	// add link
	number.properties.add(link);
	number.link = "http://google.com";

	// remove link after 5 secs
	Stream.delay(5000)
		.subscribe(() => number.properties.remove(link));

	// add tooltip
	number.properties.add(tooltip);

	// remove tooltip after 8 secs
	Stream.delay(8000)
		.subscribe(() => number.properties.remove(tooltip));
	// update number
	Stream.interval(1000)
		.reduce(0, (acc) => acc + 3000/7)
		//.subscribe(() => console.log(number.properties.list()))
		.feed(number.value);

	// add text editor
	editor.properties.add(textEditor);
	editor.editor.value.feed(editor.text);
	editor.editor = "select me...";
	editor.editor.focus();

	//let copy = new Fragment();
	//editor.properties.copyTo(copy);
	//copy.attachTo(container);

	// test cancel
	// let s = Stream.sequence([1,2,3], 200, true).cancelOn(Stream.delay(5000));
	// s.log("S");
	// let m = s.map((v) => -v * 9).cancelOn(Stream.delay(2500));
	// m.log("M");
});

