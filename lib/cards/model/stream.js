import Timer from 'ui/timer';

let _listeners = Symbol();

class Source {
	constructor(callback) {
		// TODO, replace with Map or WeakMap?
		this[_listeners] = [];
		let sink = Timer.reduce((value) => {
			// TODO add try catch?
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

class Feed extends Source {
	constructor() {
		super((sink) => this.feed = sink);
	}
}

let Stream = {
	map(source, ƒ) {
		let stream = new Feed();
		source.subscribe((value) => {
			stream.feed(ƒ(value));
		});
		return stream;
	},
	filter(source, ƒ) {
		let stream = new Feed();
		source.subscribe((value) => {
			if(ƒ(value))
				stream.feed(value);
		});
		return stream;
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
	// zip to array
	// merge
	// feedValue
	// flatMap ?
	// spread
}

export { Stream, Source, Feed };