import { FragmentBlock } from './fragmentblock';

let template = require('./paragraph.jade')();

class Paragraph extends FragmentBlock {
	constructor(...args) {
		super(template, ...args);
	}
}

export { Paragraph };