export default class Component {
	constructor() {
		this.p = {};
	}
	attach(el) {
		this.p.el = el;
		if (this.init) {
			this.init(el);
		}
	}
	detach(el) {
		this.p.el = null;
	}
	get attached() {
		return !!this.p.el;
	}
}