import { Html } from 'ui/dom';
import { Properties } from './properties';
import { PushStream } from 'streamy/stream';

let createId = require('node-uuid').v4;

let _p = Symbol();

class Component {
	constructor(options = {}) {
		new Properties(this);
		this[_p] = {
			children: [],
			el: Html.parse(options.template),
			attached: false,
			uuid: options.uuid || createId(),
			focusStream: new PushStream()
		};
		if(options.classes)
			this[_p].el.classList.add(options.classes);
		if(options.parent)
			options.parent.add(this);
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
		if(this.parent)
			this.parent.remove(this);
		if(this.isAttached)
			this.detach();
		this.properties.removeAll();
	}

	add(child) {
		if(child.parent)
			child.parent.remove(child);
		this[_p].children.push(child);
		child[_p].parent = this;
		child[_p].__cancelFocusStream = child.focusStream.feed(this.focusStream);
	}

	remove(child) {
		let i = this[_p].children.indexOf(child);
		if(i < 0)
			throw new Error(`'${child} is not child of this'`);
		child[_p].__cancelFocusStream.cancel();
		this[_p].children.splice(i, 1);
		child[_p].parent = null;
	}

	get el() {
		return this[_p].el;
	}

	get parent() {
		return this[_p].parent;
	}

	get focusStream() {
		return this[_p].focusStream;
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