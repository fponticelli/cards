import { Html } from 'ui/dom';
import { Properties } from './properties';

let createId = require('node-uuid').v4;

let _p = Symbol();

class Component {
	constructor(template, uuid) {
		new Properties(this);
		this[_p] = {
			el: Html.parse(template),
			attached: false,
			uuid: uuid || createId()
		};
	}

	attachTo(container) {
		container.appendChild(this.el);
		this[_p].attached = true;
	}

	detach() {
		if(!this.isAttached)
			throw new Error('Component is not attached');
		this.el.parentNode.removeChild(this.el);
		this[_p].attached = false;
	}

	destroy() {
		if(this.isAttached)
			this.detach();
		this.properties.removeAll();
	}

	get el() {
		return this[_p].el;
	}

	get uuid() {
		return this[_p].uuid;
	}

	get isAttached() {
		return this[_p].attached;
	}

	toString() {
		return `component: ${this.uuid}`;
	}
}

export { Component };