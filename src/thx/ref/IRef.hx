package thx.ref;

interface IRef {
	public var parent(default, null) : Null<IParentRef>;
	public function get() : Dynamic;
	public function set(value : Dynamic) : Void;
	public function remove() : Void;
	public function hasValue() : Bool;
	public function resolve(path : String, terminal : Bool = true) : IRef;
	public function getRoot() : IRef;
}