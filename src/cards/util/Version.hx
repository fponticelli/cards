/**
 * ...
 * @author Franco Ponticelli
 */

package cards.util;

class Version {
  public var major(default, null) : Int;
  public var minor(default, null) : Int;
  public var patch(default, null) : Int;
  public var build(default, null) : Int;

  public function new(major : Int, minor : Int, patch : Int, build : Int) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
    this.build = build;
  }

  public function fullVersion() return major + "." + minor + "." + patch + "." + build;

  public function version() return major + "." + minor + "." + patch;

  public function toString() return "v." + fullVersion();

  public static function fromString(s : String) {
    if(null == s)
      return new Version(0,0,0,0);
    var parts = s.split('.'),
        nums = [];
    for(i in 0...4)
      nums.push(Std.int(Math.abs(Std.parseInt(parts[i]))));
    return new Version(nums[0], nums[1], nums[2], nums[3]);
  }

  public function incrementBuild()
    return new Version(major, minor, patch, build + 1);

  public function incrementPatch()
    return new Version(major, minor, patch + 1, build + 1);

  public function incrementMinor()
    return new Version(major, minor + 1, 0, build + 1);

  public function incrementMajor()
    return new Version(major + 1, 0, 0, build + 1);
}