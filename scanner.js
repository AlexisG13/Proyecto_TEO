const keywords = require("./keywords").keywords;
const Token = require("./token").token;
const tokenTypes = require("./token-types").tokenTypes;
const memory = require("./memory").memory;

module.exports.scanner = class Scanner {
  source;
  tokens = [];
  #start = 0;
  #current = 0;
  #line = 1;

  constructor(source) {
    this.source = source;
  }

  isAtEnd() {
    return this.#current >= this.source.length;
  }

  scanTokens() {
    //console.log(this.source);
    //console.log(`Source length is ${this.source.length}`);
    while (!this.isAtEnd()) {
      // console.log(this.source.split(' '))
      this.#start = this.#current;
      this.scanToken();
    }
    this.tokens.push(new Token(tokenTypes.EOF, "", null, this.#line));

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      if (token.type == tokenTypes.IDENTIFIER) {
        if (this.tokens[i + 1].type === tokenTypes.EQUAL) {
          memory.push({
            variable: token.lexeme,
            valor: this.tokens[i + 2],
            ambito: 'global',
          });
        }
      }
    }
    return this.tokens;
  }

  scanToken() {
    const c = this.advance();
    //  console.log(`El caracter es: ${c}`);
    //console.log(`Estamos en el nodo ${this.#current}`);
    switch (c) {
      case "(":
        this.addToken(tokenTypes.LEFT_PAREN);
        break;
      case ")":
        this.addToken(tokenTypes.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(tokenTypes.LEFT_BRACE);
        break;
      case "}":
        this.addToken(tokenTypes.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(tokenTypes.COMMA);
        break;
      case ".":
        this.addToken(tokenTypes.DOT);
        break;
      case "-":
        this.addToken(tokenTypes.MINUS);
        break;
      case "+":
        this.addToken(tokenTypes.PLUS);
        break;
      case ";":
        this.addToken(tokenTypes.SEMICOLON);
        break;
      case "*":
        this.addToken(tokenTypes.STAR);
        break;
      case "!":
        this.addToken(
          this.match("=") ? tokenTypes.BANG_EQUAL : tokenTypes.BANG
        );
        break;
      case "=":
        this.addToken(
          this.match("=") ? tokenTypes.EQUAL_EQUAL : tokenTypes.EQUAL
        );
        break;
      case "<":
        this.addToken(
          this.match("=") ? tokenTypes.LESS_EQUAL : tokenTypes.LESS
        );
        break;
      case ">":
        this.addToken(
          this.match("=") ? tokenTypes.GREATER_EQUAL : tokenTypes.GREATER
        );
        break;
      case "/":
        if (this.match("/")) {
          // A comment goes until the end of the line.
          while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(tokenTypes.SLASH);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace.
        break;

      case "\n":
        this.#line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw new Error("Unexpected character");
        }
        break;
    }
  }

  advance() {
    return this.source[this.#current++];
  }

  addToken(type) {
    this.addTokenHelper(type, null);
  }

  addTokenHelper(type, literal) {
    const text = this.source.substring(this.#start, this.#current);
    this.tokens.push(new Token(type, text, literal, this.#line));
  }

  match(expectedChar) {
    if (this.isAtEnd()) return false;
    if (this.source[this.#current] !== expectedChar) return false;
    this.#current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return "\0";
    return this.source[this.#current];
  }

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      throw new Error("Unclosed string");
    }

    this.advance();

    const value = this.source.substring(this.#start + 1, this.#current - 1);
    // console.log(value);
    this.addToken(tokenTypes.STRING, value);
  }

  isDigit(c) {
    return c >= "0" && c <= "9";
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(
      tokenTypes.NUMBER,
      parseFloat(this.source.substring(this.#start, this.#current))
    );
  }

  peekNext() {
    if (this.#current + 1 >= this.source.length) return "\0";
    return this.source[this.current + 1];
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    const text = this.source.substring(this.#start, this.#current);
    let type = keywords[text];
    if (!type) type = tokenTypes.IDENTIFIER;
    // console.log(type);
    this.addToken(type);
  }

  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  isAlpha(char) {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }
};
