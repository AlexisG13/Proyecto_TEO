module.exports.token = class Token {
  tokenType;
  lexeme;
  literal;
  line;

  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
};
