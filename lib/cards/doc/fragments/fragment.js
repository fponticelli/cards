import { Attributes } from "./attributes";

var p = new Symbol();

class Fragment {
	constructor(initial) {
		this.attributes = new Attributes();
    	this[p] = { value : initial };
	}

	set value(value) {
		this[p].value = value;
	}

	get value() {
		return this[p].value;
	}
}

export { Fragment, p };