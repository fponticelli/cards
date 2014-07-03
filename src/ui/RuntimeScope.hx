package ui;

class RuntimeScope {
	public var model(default, null) : {};
	public function new(model : {}) {
		this.model = model;
	}

	public function execute(f : Dynamic -> Dynamic) : RuntimeResult
		return try Result(f(model)) catch(e : Dynamic) Error(Std.string(e));
}

enum RuntimeResult {
	Result(value : Dynamic);
	Error(msg : String);
}