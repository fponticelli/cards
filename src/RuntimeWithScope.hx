pacakge ui;

class RuntimeWithScope {
  public var scope(default, null) : RuntimeScope;
  public var runtime(default, null) : Runtime;
  public function new() {

  }

  public function run() {
    return scope.execute(runtime);
  }
}