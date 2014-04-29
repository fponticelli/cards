import { Stream } from 'streamy/stream';
import { Fragment } from 'ui/fragment';
import { Dom, Query } from 'ui/dom';
import { StringValue } from 'streamy/value';
import {
	TextProperty, ValueProperty, VisibleProperty, LinkProperty,
	StrongProperty, EmphasisProperty, StrikeProperty, NumericFormatProperty, TooltipProperty,
	TextEditorProperty, BoolEditorProperty, HtmlProperty, IconProperty
} from 'ui/properties/types';

import { Field } from 'ui/Field';

import { Paragraph } from 'ui/paragraph';

Dom.ready(() => {
	let $card            = Query.first('.card'),
		$doc             = Query.first('.doc', $card),
		$doc_header      = Query.first('header', $doc),
		$doc_article     = Query.first('article', $doc),
		$doc_footer      = Query.first('footer', $doc),
		$aside           = Query.first('aside', $card),
		$context         = Query.first('.context', $aside),
		$context_header  = Query.first('header', $context),
		$context_article = Query.first('article', $context),
		$model           = Query.first('.model', $aside),
		$model_header    = Query.first('header', $model),
		$model_article   = Query.first('article', $model),
		p                = new Paragraph(),
		editor           = p.createFragment(),
		text             = new TextProperty(),
		stringValue      = new ValueProperty("String"),
		floatValue       = new ValueProperty("Float"),
		visible          = new VisibleProperty(),
		strong           = new StrongProperty(),
		emphasis         = new EmphasisProperty(),
		strike           = new StrikeProperty(),
		formatNumber     = new NumericFormatProperty(),
		link             = new LinkProperty(),
		tooltip          = new TooltipProperty("tooltip text goes here"),
		textEditor       = new TextEditorProperty();


	// add text property and rendering
	editor.properties.add(text);
	editor.properties.add(strong);
	editor.properties.add(emphasis);
	editor.properties.add(strike);
	editor.properties.add(link);

	// add text editor
	editor.properties.add(textEditor);
	editor.editor.value.feed(editor.text);
	editor.editor = "select me...";
	editor.editor.focus();




	let field = new Field();
	field.attachTo($context_article);
	field.key.properties.add(new TextProperty('text'));
	field.value.properties.add(new TextProperty());
	field.value.properties.add(new TextEditorProperty());
	field.value.editor.value.feed(field.value.text);
	field.value.editor.value = '$.varname';

	let field = new Field();
	field.attachTo($context_article);
	field.key.properties.add(new TextProperty('link'));
	field.value.properties.add(new TextProperty());
	field.value.properties.add(new TextEditorProperty());
	field.value.editor.value.feed(field.value.text);
	field.value.editor.value.feed(editor.link);
	field.value.editor.value = 'http://www.google.com';

	let field = new Field();
	field.attachTo($context_article);
	field.key.properties.add(new IconProperty('bold'));
	field.value.properties.add(new BoolEditorProperty());
	field.value.editor.value.feed(editor.strong);
	p.attachTo($doc_article);

	let field = new Field();
	field.attachTo($context_article);
	field.key.properties.add(new IconProperty('italic'));
	field.value.properties.add(new BoolEditorProperty());
	field.value.editor.value.feed(editor.emphasis);
	p.attachTo($doc_article);

	let field = new Field();
	field.attachTo($context_article);
	field.key.properties.add(new IconProperty('strikethrough'));
	field.value.properties.add(new BoolEditorProperty());
	field.value.editor.value.feed(editor.strike);
	p.attachTo($doc_article);





	let field = new Field();

	field.attachTo($model_article);
	field.key.properties.add(new TextProperty('varname'));
	field.key.properties.add(new TextEditorProperty());
	field.value.properties.add(new TextProperty());
	field.value.properties.add(new TextEditorProperty());
	field.value.editor.value.feed(field.value.text);




	//let copy = new Fragment();
	//editor.properties.copyTo(copy);
	//copy.attachTo(container);

	// test cancel
	// let s = Stream.sequence([1,2,3], 200, true).cancelOn(Stream.delay(5000));
	// s.log("S");
	// let m = s.map((v) => -v * 9).cancelOn(Stream.delay(2500));
	// m.log("M");

});

