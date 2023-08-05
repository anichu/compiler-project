import { useState } from "react";
import { Link } from "react-router-dom";

class NonTerminal {
	constructor(name) {
		this.name = name; // The name of the non-terminal.
		this.productionRules = []; // An array to store the production rules.
	}

	getName() {
		return this.name; // Method to get the name of the non-terminal.
	}

	setRules(rules) {
		this.productionRules = rules; // Method to set the production rules for the non-terminal.
	}

	getRules() {
		return this.productionRules; // Method to get the production rules of the non-terminal.
	}

	addRule(rule) {
		this.productionRules.push(rule); // Method to add a new production rule to the non-terminal.
	}

	printRule() {
		let toPrint = `${this.name} ->`; // Method to print the non-terminal and its production rules.

		for (let rule of this.productionRules) {
			toPrint += ` ${rule} |`; // Add each production rule to the string.
		}

		toPrint = toPrint.slice(0, -1); // Remove the trailing "|" character.
		console.log(toPrint); // Print the formatted production rules.
	}
}

class Grammar {
	constructor() {
		this.nonTerminals = []; // Array to store non-terminal symbols.
	}

	// Method to add a production rule to a non-terminal.
	addRule(rule) {
		let nt = false;
		let parse = "";

		for (let c of rule) {
			if (c === " ") {
				if (!nt) {
					const newNonTerminal = new NonTerminal(parse);
					this.nonTerminals.push(newNonTerminal); // Create and store a new NonTerminal object.
					nt = true;
					parse = "";
				} else if (parse.length) {
					this.nonTerminals[this.nonTerminals.length - 1].addRule(parse); // Add the production rule to the last non-terminal.
					parse = "";
				}
			} else if (c !== "|" && c !== "-" && c !== ">") {
				parse += c; // Parse the non-terminal name or production rule.
			}
		}

		if (parse.length) {
			this.nonTerminals[this.nonTerminals.length - 1].addRule(parse); // Add the last production rule to the last non-terminal.
		}
	}

	// Predefined method to add multiple grammar rules to the grammar.
	inputData() {
		this.addRule("S -> Sa | Sb | c | d");
		this.addRule("S -> Sa | Sb | c | d");
		this.addRule("S -> Sa | Sb | c | d");
	}

	// Method to solve non-immediate left recursion between two non-terminals A and B.
	solveNonImmediateLR(A, B) {
		const nameA = A.getName();
		const nameB = B.getName();
		const rulesA = A.getRules();
		const rulesB = B.getRules();
		const newRulesA = [];

		for (let rule of rulesA) {
			if (rule.substr(0, nameB.length) === nameB) {
				for (let rule1 of rulesB) {
					newRulesA.push(rule1 + rule.substr(nameB.length));
				}
			} else {
				newRulesA.push(rule);
			}
		}

		A.setRules(newRulesA); // Set the non-immediate left-factored rules for non-terminal A.
	}

	// Method to solve immediate left recursion for a given non-terminal A.
	solveImmediateLR(A) {
		const name = A.getName();
		const newName = name + "'";

		const alphas = [];
		const betas = [];
		const rules = A.getRules();

		for (let rule of rules) {
			if (rule.substr(0, name.length) === name) {
				alphas.push(rule.substr(name.length));
			} else {
				betas.push(rule);
			}
		}

		if (!alphas.length) return; // If there are no immediate left-recursive rules, return.

		const newRulesA = [];
		const newRulesA1 = [];

		if (!betas.length) newRulesA.push(newName); // If there are no non-left-recursive rules, add the new non-terminal A'.

		for (let beta of betas) {
			newRulesA.push(beta + newName); // Add the new non-terminal A' to the existing rules of A.
		}

		for (let alpha of alphas) {
			newRulesA1.push(alpha + newName); // Add the new non-terminal A' to the left-recursive rules of A.
		}

		A.setRules(newRulesA); // Set the left-factored rules for non-terminal A.
		newRulesA1.push("\u03B5"); // Add epsilon (empty string) as a rule for the new non-terminal A'.

		const newNonTerminal = new NonTerminal(newName);
		newNonTerminal.setRules(newRulesA1);
		this.nonTerminals.push(newNonTerminal); // Create a new non-terminal A' and add it to the grammar.
	}

	// Apply the left recursion removal algorithm to the grammar.
	applyAlgorithm() {
		const size = this.nonTerminals.length;
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < i; j++) {
				this.solveNonImmediateLR(this.nonTerminals[i], this.nonTerminals[j]); // Solve non-immediate left recursion between all non-terminals.
			}
			this.solveImmediateLR(this.nonTerminals[i]); // Solve immediate left recursion for each non-terminal.
		}
	}

	// Method to print all the production rules of each non-terminal.
	printRules() {
		for (let nonTerminal of this.nonTerminals) {
			nonTerminal.printRule();
		}
	}

	// Function to add user input rules to the grammar.
	addUserInputRules(rules) {
		const ruleLines = rules.split("\n");
		for (const rule of ruleLines) {
			this.addRule(rule.trim()); // Trim each rule and add it to the grammar.
		}
	}

	// Function to get transformed rules along with non-terminal values.
	getTransformedRulesWithNonTerminals() {
		return this.nonTerminals.map((nt) => ({
			nonTerminal: nt.getName(),
			rules: nt.getRules(),
		}));
	}
}

const GrammarTransformer = () => {
	const [inputRules, setInputRules] = useState("");
	const [transformedRules, setTransformedRules] = useState([]);

	const handleInputChange = (event) => {
		setInputRules(event.target.value);
	};

	const handleTransform = () => {
		const grammar = new Grammar(); // Create the grammar object before applying the rules
		grammar.addUserInputRules(inputRules);
		grammar.applyAlgorithm();
		setTransformedRules(grammar.getTransformedRulesWithNonTerminals());
	};

	return (
		<div className="">
			<h2 className="text-xl text-left font-semibold mb-4">
				Removing Direct and Indirect Left Recursion in a Grammar
			</h2>
			<div className="flex items-center justify-center my-8">
				<textarea
					value={inputRules}
					onChange={handleInputChange}
					placeholder="Enter production rules (e.g., S -> aS | bS | c)"
					rows={6}
					className="resize-none border rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			<div className="text-left">
				<button
					onClick={handleTransform}
					className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded"
				>
					Transform Grammar
				</button>
				<Link
					to="/testing-example"
					target="_blank"
					className="bg-purple-500 py- ml-4 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded"
				>
					Testing
				</Link>
			</div>
			{transformedRules.length && (
				<h3 className="text-xl font-bold mt-6 text-left">
					Transformed Grammar Rules:
				</h3>
			)}

			<ul className="text-left border border-gray-300 rounded p-4 mt-4">
				{transformedRules.map((ruleSet, index) => (
					<li
						key={index}
						className="mb-2 bg-purple-800 rounded-md text-white px-2 py-4"
					>
						<strong className="text-orange-500">
							{ruleSet.nonTerminal} -&gt;{" "}
						</strong>
						{ruleSet.rules.join(" | ")}
					</li>
				))}
			</ul>
		</div>
	);
};

export default GrammarTransformer;
