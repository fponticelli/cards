/**
 * ...
 * @author Franco Ponticelli
 */

package cards.util;
#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
import thx.semver.Version;
#end
class MacroVersion {
  macro public static function currentVersion()
    return expr(getVersion());

  macro public static function next()
#if major
    return saveAndReturn(getVersion().nextMajor());
#elseif minor
    return saveAndReturn(getVersion().nextMinor());
#elseif (patch || release)
    return saveAndReturn(getVersion().nextPatch());
#elseif pre
    return saveAndReturn(getVersion().nextPre());
#else
    return saveAndReturn(getVersion().nextBuild());
#end

  macro public static function nextBuild()
    return saveAndReturn(getVersion().nextBuild());

  macro public static function nextPre()
    return saveAndReturn(getVersion().nextPre());

  macro public static function nextPatch()
    return saveAndReturn(getVersion().nextPatch());

  macro public static function nextMinor()
    return saveAndReturn(getVersion().nextMinor());

  macro public static function nextMajor()
    return saveAndReturn(getVersion().nextMajor());

  macro public static function setVersionFile(file : String) {
    VERSION_FILE = file;
    return null;
  }

#if macro
  static var VERSION_FILE = "version";
  static function getVersion() : Version
    return !sys.FileSystem.exists(VERSION_FILE)
        ? ([0,0,0] : Version)
        : (sys.io.File.getContent(VERSION_FILE) : Version);

  static function saveAndReturn(version : Version) {
    saveVersion(version);
    return expr(version);
  }

  static function saveVersion(version : Version) {
    var file = sys.io.File.write(VERSION_FILE, false);
    file.writeString(version.toString());
    file.close();
  }

  static function expr(version : Version) {
    return {
      expr : ExprDef.EConst(Constant.CString(version.toString())),
      pos : Context.currentPos()
    };
  }
#end
}