/* eslint-disable no-useless-escape */
import { useState } from "react";
import { Link } from "react-router-dom";

class Token {
	constructor(type, value) {
		this.type = type;
		this.value = value;
	}
}

class Lexer {
	constructor(input) {
		this.input = input;
		this.position = 0;
	}

	isEOF = () => {
		return this.position >= this.input.length;
	};

	peek() {
		return this.isEOF() ? null : this.input[this.position];
	}

	advance() {
		this.position++;
	}

	isWhitespace(char) {
		return /\s/.test(char);
	}

	isDigit(char) {
		return /\d/.test(char);
	}

	isOperator(char) {
		return /[\+\-\*\/]/.test(char);
	}

	isParenthesis(char) {
		return /[(){}\[\]]/.test(char);
	}

	isVariable(char) {
		return /[a-zA-Z]/.test(char);
	}

	isDelimiter(char) {
		const delimiters = [" ", ",", ";", "."];
		return delimiters.includes(char);
	}

	readNumber = () => {
		let numStr = "";

		while (!this.isEOF() && this.isDigit(this.peek())) {
			numStr += this.peek();
			this.advance();
		}

		return new Token("NUMBER", parseInt(numStr));
	};

	readDelimiter = (char) => {
		this.advance();
		return new Token("DELIMITER", char);
	};
	readEqualSign = () => {
		this.advance();
		return new Token("EQUAL", "=");
	};

	isComparisonOperator(char) {
		const comparisonOperators = ["<", "=", ">"];
		return comparisonOperators.includes(char);
	}

	readComparisonOperator = (char) => {
		this.advance();
		let msg = char === "<" ? "LESS THAN OPERATOR" : "GREATER THAN OPERATOR";
		return new Token(msg, char);
	};

	readVariable = () => {
		let variable = "";

		while (!this.isEOF() && this.isVariable(this.peek())) {
			variable += this.peek();
			this.advance();
		}

		return new Token("VARIABLE", variable);
	};

	tokenize = () => {
		const tokens = [];

		while (!this.isEOF()) {
			const char = this.peek();

			if (this.isWhitespace(char)) {
				this.advance();
			} else if (this.isDigit(char)) {
				tokens.push(this.readNumber());
			} else if (this.isOperator(char)) {
				tokens.push(new Token("OPERATOR", char));
				this.advance();
			} else if (this.isParenthesis(char)) {
				tokens.push(new Token("PARENTHESIS", char));
				this.advance();
			} else if (char === "=") {
				tokens.push(this.readEqualSign());
			} else if (this.isVariable(char)) {
				tokens.push(this.readVariable());
			} else if (this.isDelimiter(char)) {
				tokens.push(this.readDelimiter(char));
			} else if (this.isComparisonOperator(char)) {
				tokens.push(this.readComparisonOperator(char));
			} else {
				console.error(`Unexpected character: ${char}`);
				this.advance();
			}
		}

		return tokens;
	};
}

const ExpressionTokenizer = () => {
	const [inputExpression, setInputExpression] = useState("");
	const [tokens, setTokens] = useState([]);

	const handleInputChange = (event) => {
		setInputExpression(event.target.value);
	};

	const tokenizeExpression = () => {
		const lexer = new Lexer(inputExpression);
		const tokens = lexer.tokenize();
		setTokens(tokens);
	};

	return (
		<div>
			<div>
				<h2 className="text-xl font-bold text-left text-purple-900 mb-8">
					Expression Tokenizer
				</h2>
				<div className="w-full mb-6">
					<textarea
						value={inputExpression}
						onChange={handleInputChange}
						placeholder="Enter an arithmetic expression (e.g., 3 + 4 * (2 - 1))"
						rows={6}
						cols={50}
						className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:border-purple-500"
					/>
				</div>
				<div className="flex justify-start">
					<button
						onClick={tokenizeExpression}
						className="bg-purple-900 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
					>
						Tokenize Expression
					</button>
					<Link
						to="/testing-example"
						target="_blank"
						className="bg-purple-500 py- ml-4 hover:bg-purple-600 text-white font-semibold px-4 py-4 rounded"
					>
						Testing
					</Link>
				</div>
				{tokens.length > 0 && (
					<div className="text-left bg-purple-900 rounded-md py-5 my-3">
						<h3 className="text-2xl font-bold text-white px-5 mb-4">
							Tokenized Expression:
						</h3>
						<ul className="list-disc list-inside">
							{tokens.map((token, index) => (
								<li
									key={index}
									className="text-lg text-white bg-purple-800 px-2 py-5 list-none font-medium mx-2 my-2 rounded-md "
								>
									<strong className="text-orange-400">{token.type}:</strong>{" "}
									{token.value}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default ExpressionTokenizer;
