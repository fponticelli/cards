import { Component } from './component';
import { PushStream } from 'streamy/stream';
import { IconProperty, ClickProperty } from './properties/types';

let template = require('./button.jade')(),
	_click   = Symbol();

class Button extends Component {
	constructor(options = {}) {
		if(!('template' in options))
			options.template = template;
		super(options);
		this.properties.add(new ClickProperty());
	}
}

Button.icon = function(name, options) {
	let button = new Button(options);
	button.properties.add(new IconProperty(name));
	return button;
};

export { Button };