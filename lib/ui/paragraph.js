import { FragmentBlock } from './fragmentblock';

let template = require('./paragraph.jade')();

class Paragraph extends FragmentBlock {
	constructor(options = {}) {
		if(!('template' in options))
			options.template = template;
		super(options);
	}
}

export { Paragraph };