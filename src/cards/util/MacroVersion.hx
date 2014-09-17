/**
 * ...
 * @author Franco Ponticelli
 */

package cards.util;
#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
#end
class MacroVersion {
  macro public static function currentVersion()
    return expr(getVersion());

  macro public static function next()
#if major
    return saveAndReturn(getVersion().incrementMajor());
#elseif minor
    return saveAndReturn(getVersion().incrementMinor());
#elseif (patch || release)
    return saveAndReturn(getVersion().incrementPatch());
#else
    return saveAndReturn(getVersion().incrementBuild());
#end


  macro public static function nextBuild()
    return saveAndReturn(getVersion().incrementBuild());

  macro public static function nextPatch()
    return saveAndReturn(getVersion().incrementPatch());

  macro public static function nextMinor()
    return saveAndReturn(getVersion().incrementMinor());

  macro public static function nextMajor()
    return saveAndReturn(getVersion().incrementMajor());

  macro public static function setVersionFile(file : String) {
    VERSION_FILE = file;
    return null;
  }

#if macro
  static var VERSION_FILE = "version";
  static function getVersion() : Version {
    return !sys.FileSystem.exists(VERSION_FILE)
        ? new Version(0, 0, 0, 0)
        : Version.fromString(sys.io.File.getContent(VERSION_FILE));
  }

  static function saveAndReturn(version : Version) {
    saveVersion(version);
    return expr(version);
  }

  static function saveVersion(version : Version) {
    var file = sys.io.File.write(VERSION_FILE, false);
    file.writeString(version.fullVersion());
    file.close();
  }

  static function expr(version : Version) {
    return {
      expr : ExprDef.EConst(Constant.CString(version.fullVersion())),
      pos : Context.currentPos()
    };
  }
#end
}