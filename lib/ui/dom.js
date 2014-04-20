let p = Symbol();

let Html = {
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
		let old = el.innerHTML,
			ƒ = (v) => el.innerHTML = v;
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			el.innerHTML = old;
		};
	}
	applyAttribute(name, el) {
		let old = el.getAttribute(name),
			ƒ = (v) => el.setAttribute(name, v);
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			if(old !== undefined)
				el.setAttribute(name, old);
			else
				el.removeAttribute(name);
		};
	}
	applySwapClass(el, className) {
		let has = el.classList.contains(className),
			ƒ = (v) => v ? el.classList.add(className) : el.classList.remove(className);
		this[p].subscribe(ƒ);
		return () => {
			this[p].unsubscribe(ƒ);
			if(has)
				el.classList.add(className);
			else
				el.classList.remove(className);
		};
	}
}

let Dom = {
	swapClass(el, className) {
		return (value) => value ? el.classList.add(className) : el.classList.remove(className);
	},
	stream(source) {
		return new DomStream(source);
	}
}

let StreamDom = {

}
/*
class DomApplier {
	constructor(ƒ) {
		this.ƒ = ƒ;
	}
	to(el) {
		return this.ƒ(el);
	}
	toAll(el) {
		return el.map(this.ƒ);
	}
	when(el) {
		if(null == el) {
			return;
		} else {
			return this.ƒ(el);
		}
	}
}

let Dom = {
	addClass(className) {
		return new DomApplier(el => el.classList.add(className));
	},

	removeClass(className) {
		return new DomApplier(el => el.classList.remove(className));
	},

	toggleClass(className) {
		return new DomApplier(el => el.classList.toggle(className));
	},

	hasClass(className) {
		return new DomApplier(el => el.classList.contains(className));
	}
}
*/

let Query = {
	first(selector, ctx) {
		return (ctx || document).querySelector(selector);
	},

	all(selector, ctx) {
		return (ctx || document).query(selector);
	}
};

/*
Dom.addClass("selected").to(el);
Dom.addClass("selected").toAll(Query.all('.editor'));
Dom.addClass("selected").when(Query.first('.editor'));

var b = Html.parse('<b></b>'), // document.createElement('b')
	c = el.parentNode;
b.appendChild(el);
c.appendChild(b);

Dom.wrap(el).into(Html.parse('<b></b>'))

Query.ifFirst(".editor", Dom.addClass("selected"))
*/
export { Html, Query, Dom };