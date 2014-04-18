let Html = {
	parse(html) {
		let frag = document.createDocumentFragment(),
			el   = document.createElement('div');
		el.innerHTML = html;
		for(let i = 0; i < el.childNodes.length; i++) {
			frag.appendChild(el.childNodes[i]);
		}
		return frag;
	}
};

export default Html;