export let ƒ = {
	compose(ƒ1, ƒ2) {
		return function() {
			return ƒ1(ƒ2.apply(undefined, arguments));
		};
	},
	join(ƒ1, ƒ2) {
		return function() {
			ƒ1.apply(undefined, arguments);
			ƒ2.apply(undefined, arguments);
		}
	}
};