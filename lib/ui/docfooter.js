import { Button } from 'ui/button';
import { Footer } from './footer';

export class DocFooter extends Footer {
	constructor(options) {
		super(options);

		this.add(Button.icon('star'));
	}
}