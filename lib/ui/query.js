let Query = {
	first(selector, ctx) {
		return (ctx || document).querySelector(selector);
	},

	all(selector, ctx) {
		return (ctx || document).query(selector);
	}
};

export default Query;