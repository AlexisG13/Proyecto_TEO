const tokenTypes = require("./token-types").tokenTypes;

module.exports.keywords = {
  public: tokenTypes.PUBLIC,
  val: tokenTypes.VAL,
  const: tokenTypes.CONST,
  static: tokenTypes.STATIC,
  lateinit: tokenTypes.LATEINIT,
  class: tokenTypes.CLASS,
  fun: tokenTypes.FUNCTION,
  private: tokenTypes.PRIVATE,
  protected: tokenTypes.PROTECTED,
  var: tokenTypes.VAR,
  false: tokenTypes.FALSE,
  if: tokenTypes.IF
};
