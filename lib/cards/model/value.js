import Timer from 'ui/timer';

var _value = Symbol(),
	_listeners = Symbol(),
	_update = Symbol();

export class Value {
	constructor(defaultValue) {
		// TODO, replace with Map or WeakMap?
		this[_listeners] = [];
		this[_update] = Timer.reduce((() => {
			var value = this[_value];
			this[_listeners].map(ƒ => ƒ(value));
		}).bind(this));
		this[_value] = defaultValue;
	}
	subscribe(ƒ) {
		this[_listeners].push(ƒ);
		ƒ(this[_value]);
		return () => this[_listeners].splice(this[_listeners].indexOf(ƒ), 1);
	}
	set(value) {
		if(value === this[_value])
			return;
		this[_value] = value;
		this[_update]();
	}
	get value() {
		return this[_value];
	}
	set value(v) {
		this.set(v);
	}
}

export class StringValue extends Value {
	constructor(value = "") {
		super(value);
	}
	set(value) {
		super.set((value && value.toString && value.toString()) || (value && ("" + value)) || "");
	}
}

export class BoolValue extends Value {
	constructor(value = false) {
		super(value);
	}
	set(value) {
		super.set(!!value);
	}
	toggle() {
		this.set(!this.value);
	}
}