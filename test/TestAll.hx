import thx.ref.ArrayRef;
import thx.ref.ObjectRef;
import thx.ref.Ref;
import thx.ref.UnknownRef;
import thx.ref.ValueRef;
import utest.Runner;
import utest.ui.Report;
import utest.Assert;

class TestAll {
  static function main() {
    var runner = new Runner();

    runner.addCase(new TestAll());

    Report.create(runner);

    runner.run();
  }

  public function new() {}

  public function testValueRef() {
    var ref = new ValueRef();
    Assert.isFalse(ref.hasValue());
    ref.set('some');
    Assert.isTrue(ref.hasValue());
    Assert.equals(ref, ref.resolve(""));
    Assert.raises(function() {
      ref.resolve("path");
    });
    ref.remove();
    Assert.isFalse(ref.hasValue());
  }

  static var obj = { a : [{ b : [[1],[2]]}] };
  public function testRefFromValue() {
    var ref = Ref.fromValue(obj);
    Assert.same(obj, ref.get());
  }

  public function testResolvePathEmpty() {
    var ref = Ref.resolvePath("");
    Assert.is(ref, ValueRef);
  }

  public function testResolvePathEmptyNonTerminal() {
    var ref = Ref.resolvePath("", null, false);
    Assert.is(ref, UnknownRef);
  }

  public function testResolvePathField() {
    var ref = Ref.resolvePath("name");
    Assert.is(ref, ValueRef);
    Assert.is(ref.getRoot(), ObjectRef);
  }

  public function testResolvePathNestedField() {
    var ref = Ref.resolvePath("person.name");
    Assert.is(ref, ValueRef);
    Assert.is(ref.parent, ObjectRef);
    Assert.is(ref.getRoot(), ObjectRef);
    Assert.notEquals(ref.parent, ref.getRoot());
  }

  public function testResolvePathItem() {
    var ref = Ref.resolvePath("[0]");
    Assert.is(ref, ValueRef);
    Assert.is(ref.getRoot(), ArrayRef);
  }

  public function testResolvePathNestedItem() {
    var ref = Ref.resolvePath("[0][0]");
    Assert.is(ref, ValueRef);
    Assert.is(ref.parent, ArrayRef);
    Assert.is(ref.getRoot(), ArrayRef);
    Assert.notEquals(ref.parent, ref.getRoot());
  }

  public function testResolvePathItemNestedField() {
    var ref = Ref.resolvePath("[0].name");
    Assert.is(ref, ValueRef);
    Assert.is(ref.parent, ObjectRef);
    Assert.is(ref.getRoot(), ArrayRef);
  }

  static var path0 = 'a[0].b[0][0]';
  static var path1 = 'a[0].b[1][0]';
  public function testResolvePath() {
    var ref0 = Ref.resolvePath(path0),
      root = ref0.getRoot(),
      ref1 = root.resolve(path1);
    ref0.set(1);
    ref1.set(2);
    Assert.same(obj, root.get());
  }

  public function testArrayRef() {
    var ref = new ArrayRef();
    Assert.same([], ref.get());
    Assert.isFalse(ref.hasValue());
    var value = ref.resolve("[0]");
    Assert.same([], ref.get());
    value.set("A");
    Assert.isTrue(ref.hasValue());
    Assert.same(["A"], ref.get());
    Assert.raises(function() {
      ref.resolve("path");
    });
  }

  public function testObjectRef() {
    var ref = new ObjectRef();
    Assert.same({}, ref.get());
    Assert.isFalse(ref.hasValue());
    var value = ref.resolve("name");
    Assert.same({}, ref.get());
    value.set("Franco");
    Assert.isTrue(ref.hasValue());
    Assert.same({name:"Franco"}, ref.get());
    Assert.raises(function() {
      ref.resolve("[0]");
    });
  }

  public function testObjectRefWithArray() {
    var ref = Ref.fromValue({ arr : [0,1,2] });
    Assert.same([0,1,2], ref.resolve('arr').get());
    ref.resolve('arr').remove();
    Assert.isFalse(ref.hasValue());
  }

  public function testNestedRemove() {
    var ref = Ref.fromValue({ arr : [0] });
    Assert.isTrue(ref.hasValue());
    ref.resolve('arr[0]').remove();
    Assert.isFalse(ref.hasValue());
  }
}