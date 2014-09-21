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
    return nextMajor();
#elseif minor
    return nextMinor();
#elseif (patch || release)
    return nextPatch();
#elseif pre
    return nextPre();
#else
    return nextBuild();
#end

  #if !macro macro #end public static function nextBuild()
    return saveAndReturn(getVersion().nextBuild());

  #if !macro macro #end public static function nextPre() {
    var v = getVersion();
    return saveAndReturn(v.nextPre().withBuild(v.build).nextBuild());
  }

  #if !macro macro #end public static function nextPatch() {
    var v = getVersion();
    return saveAndReturn(v.nextPatch().withBuild(v.build).nextBuild());
  }

  #if !macro macro #end public static function nextMinor() {
    var v = getVersion();
    return saveAndReturn(v.nextMinor().withBuild(v.build).nextBuild());
  }

  #if !macro macro #end public static function nextMajor() {
    var v = getVersion();
    return saveAndReturn(v.nextMajor().withBuild(v.build).nextBuild());
  }

  #if !macro macro #end public static function setVersionFile(file : String) {
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