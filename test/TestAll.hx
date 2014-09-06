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
}