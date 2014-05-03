import { Button } from 'ui/button';
import { Toolbar } from './toolbar';

export class ContextToolbar extends Toolbar {
	constructor(options) {
		super(options);

		this.left.add(Button.icon('star'));
	}
}