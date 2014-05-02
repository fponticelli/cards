let p = Symbol(),
	Html = {
	parseAll(html) {
		let el   = document.createElement('div');
		el.innerHTML = html;
		return Array.prototype.slice.apply(el.childNodes);
	},
	parse(html) {
		return this.parseAll(html)[0];
	}
};

class DomStream {
	constructor(source) {
		this[p] = source;
	}
	on(event, el) {
		let ƒ = (e) => this[p].push(e);
		el.addEventListener(event, ƒ, false);
		return () => {
			el.removeEventListener(event, ƒ, false);
		};
	}
	applyDisplay(el, display = "") {
		let old = el.style.display,
			ƒ = (v) => el.style.display = v ? display : "none";
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			el.style.display = old;
		};
	}
	applyText(el) {
		let old = el.innerText,
			ƒ = (v) => el.innerText = v || "";
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			ƒ(old);
		};
	}
	applyHtml(el) {
		let old = el.innerHTML,
			ƒ = (v) => el.innerHTML = v || "";
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			ƒ(old);
		};
	}
	applyAttribute(name, el) {
		let old = el.getAttribute(name),
			ƒ = (v) => {
				v == null ? el.removeAttribute(name) : el.setAttribute(name, v);
			}
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			ƒ(old);
		};
	}
	applySwapAttribute(name, el) {
		let old = el.hasAttribute(name),
			ƒ = (v) => {
				!!v ? el.setAttribute(name, name) : el.removeAttribute(name);
			}
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			ƒ(old);
		};
	}
	applySwapClass(el, className) {
		let has = el.classList.contains(className),
			ƒ = (v) => v ? el.classList.add(className) : el.classList.remove(className);
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			ƒ(has);
		};
	}
}

let Dom = {
	stream(source) {
		return new DomStream(source);
	},
	ready(ƒ) {
		if(ƒ)
			document.addEventListener("DOMContentLoaded", ƒ, false);
		else
			return new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, false));
	}
}

let Query = {
	first(selector, ctx) {
		return (ctx || document).querySelector(selector);
	},

	all(selector, ctx) {
		return Array.prototype.slice.call((ctx || document).querySelectorAll(selector), 0);
	}
};

export { Html, Query, Dom };