import { ValueStreamProperty } from '../valuestream';
import { StringValue } from 'streamy/value';

class LinkProperty extends ValueStreamProperty {
	constructor(url = "") {
		super(
			"link",
			() => new StringValue(url),
			(target, value)  => {
				let a  = document.createElement('a'),
					el = target.el,
					ƒ  = (url) => a.href = url;
				a.target = "_blank";
				for(let i = 0; i < el.childNodes.length; i++) {
					a.appendChild(el.childNodes[i]);
				}
				el.appendChild(a);
				value.subscribe(ƒ);
				return () => {
					value.unsubscribe(ƒ);
					el.removeChild(a);
					for(let i = 0; i < a.childNodes.length; i++) {
						el.appendChild(a.childNodes[i]);
					}
				};
			}
		);
	}
}

export { LinkProperty };