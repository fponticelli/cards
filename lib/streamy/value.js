import { Source, Stream } from './stream'

var _value = Symbol(),
	_defaultValue = Symbol(),
	_update = Symbol();

export class Value extends Source {
	constructor(value, defaultValue) {
		let callback = (sink) => {
			this[_update] = sink;
		};
		super(callback);
		this[_defaultValue] = defaultValue;
		this[_value] = value;
	}
	subscribe(ƒ) {
		ƒ(this[_value]);
		super.subscribe(ƒ);
		return this;
	}
	push(value) {
		if(value === this[_value])
			return;
		this[_value] = value;
		this[_update](value);
	}
	get value() {
		return this[_value];
	}
	set value(v) {
		this.push(v);
	}
	get isDefault() {
		return this[_value] === this[_defaultValue];
	}
	reset() {
		this.value = this[_defaultValue];
	}
}

export class StringValue extends Value {
	constructor(value = "", defaultValue = value) {
		super(value, defaultValue);
	}
	push(value) {
		super.push((value && value.toString && value.toString()) || (value && ("" + value)) || "");
	}
}

export class BoolValue extends Value {
	constructor(value = false, defaultValue = value) {
		super(value, defaultValue);
	}
	push(value) {
		super.push(!!value);
	}
	toggle() {
		this.push(!this.value);
	}
}

export class FloatValue extends Value {
	constructor(value = 0.0, defaultValue = value) {
		super(value, defaultValue);
	}
	push(value) {
		super.push(+new Number(value));
	}
}

var defaultDate = new Date(null);
export class DateValue extends Value {
	constructor(value = defaultDate, defaultValue = value) {
		super(value, defaultValue);
	}
	push(value) {
		super.push(new Date(value));
	}
}