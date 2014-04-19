import Timer from 'ui/timer';

let _listeners = Symbol();

class Source {
	constructor(callback) {
		// TODO, replace with Map or WeakMap?
		this[_listeners] = [];
		let sink = Timer.reduce((value) => {
			this[_listeners].map(ƒ => ƒ(value));
		});
		callback(sink);
	}
	subscribe(ƒ) {
		this[_listeners].push(ƒ);
	}
	unsubscribe(ƒ) {
		this[_listeners].splice(this[_listeners].indexOf(ƒ), 1);
	}
	map(ƒ) {
		return Stream.map(this, ƒ);
	}
	filter(ƒ) {
		return Stream.filter(this, ƒ);
	}
	unique() {
		return Stream.unique(this);
	}
	log() {
		return Stream.log(this);
	}
}

let Stream = {
	map(source, ƒ) {
		let update,
			transformed = new Source((sink) => update = sink);
		source.subscribe((value) => {
			update(ƒ(value));
		});
		return transformed;
	},
	filter(source, ƒ) {
		let update,
			filtered = new Source((sink) => update = sink);
		source.subscribe((value) => {
			if(ƒ(value))
				update(value);
		});
		return filtered;
	},
	unique(source) {
		return this.filter(source, (function() {
			var last;
			return function(v) {
				if(last !== v) {
					last = v;
					return true;
				} else {
					return false;
				}
			};
		})());
	},
	log(source) {
		return this.map(source, (v) => {
			console.log(v);
			return v;
		});
	}
}

export { Stream, Source };