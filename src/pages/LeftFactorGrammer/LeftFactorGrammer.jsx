import { useState } from "react";
import { Link } from "react-router-dom";

// This function performs left-factoring on a given grammar.
function leftFactorGrammar(grammar) {
	// Create a new object to store the updated grammar after left-factoring.
	const newGrammar = {};

	// Initialize a counter for creating new non-terminal symbols.
	let newNonTerminalCounter = 1;

	// Iterate over each non-terminal in the input grammar.
	for (const nonTerminal in grammar) {
		// Get the array of production rules for the current non-terminal.
		const productions = grammar[nonTerminal];

		// Find the common prefix among the production rules.
		const commonPrefix = findCommonPrefix(productions);

		// If a common prefix is found, proceed with left-factoring.
		if (commonPrefix) {
			// Create a new non-terminal symbol by appending a counter to the original non-terminal.
			const newNonTerminal = `${nonTerminal}${newNonTerminalCounter++}`;

			// Factor out the common prefix from the original production rules,
			// and store the remaining productions in the new non-terminal.
			const remainingProductions = productions.map((production) =>
				production.substring(commonPrefix.length)
			);

			// Update the newGrammar object with the factored non-terminal and its corresponding production rule.
			newGrammar[nonTerminal] = [commonPrefix + newNonTerminal];

			// Add the new non-terminal and its remaining productions to the newGrammar object.
			newGrammar[newNonTerminal] = remainingProductions;
		} else {
			// If no common prefix is found, add the non-terminal and its productions as-is to the newGrammar object.
			newGrammar[nonTerminal] = productions;
		}
	}

	// Return the updated grammar after left-factoring.
	return newGrammar;
}

function findCommonPrefix(productions) {
	// If there are less than two production rules, there is no common prefix.
	if (productions.length < 2) {
		return "";
	}

	// Get the first production rule as a reference for finding the common prefix.
	const firstProduction = productions[0];

	// Loop through each character position of the first production.
	for (let i = 0; i < firstProduction.length; i++) {
		// Get the prefix substring up to the current character position.
		const prefix = firstProduction.substring(0, i + 1);

		// Output the prefix to the console for debugging purposes.
		console.log(prefix);

		// Check if the prefix exists at the start of all production rules.
		// The `every` method tests if all elements in the productions array satisfy the given condition.
		if (productions.every((production) => production.startsWith(prefix))) {
			// If the prefix exists in all production rules, return the common prefix.
			return prefix;
		}
	}

	// If no common prefix is found, return an empty string.
	return "";
}

// LeftFactorizationComponent is a functional component.
const LeftFactorizationComponent = () => {
	// State variables to hold the input grammar and the left-factored grammar.
	const [grammarInput, setGrammarInput] = useState("");
	const [leftFactoredGrammar, setLeftFactoredGrammar] = useState(null);

	// Function to handle the left-factoring process.
	const handleLeftFactor = (e) => {
		e.preventDefault();

		// Split the input grammar into individual lines.
		const grammarLines = grammarInput.split("\n");

		// Initialize an empty object to store the grammar rules.
		const grammar = {};

		// Parse each line and store the non-terminal and production rules in the grammar object.
		for (const line of grammarLines) {
			const [nonTerminal, production] = line
				.split("->")
				.map((str) => str.trim());
			if (nonTerminal && production) {
				// Split the production rules separated by "|" and remove extra spaces.
				let splitProduction = production.split("|");
				const reMoveSpaceFromProduction = splitProduction.map((str) =>
					str.trim()
				);

				// If the non-terminal doesn't exist in the grammar object, create an empty array for it.
				if (!grammar[nonTerminal]) {
					grammar[nonTerminal] = [];
				}

				// Add the production rules to the non-terminal in the grammar object.
				grammar[nonTerminal] = [...reMoveSpaceFromProduction];
			}
		}

		// Perform left factoring on the grammar using the leftFactorGrammar function.
		const leftFactoredGrammar = leftFactorGrammar(grammar);

		// Update the state with the left-factored grammar.
		setLeftFactoredGrammar(leftFactoredGrammar);
	};

	// JSX for the component's user interface.
	return (
		<div className="text-left">
			<h1 className="text-2xl font-bold text-purple-800 mb-4">
				Left Factoring App
			</h1>
			<form onSubmit={handleLeftFactor} action="">
				{/* Text area for entering grammar rules. */}
				<textarea
					className="w-full p-2 mb-4 border border-gray-400 rounded"
					value={grammarInput}
					onChange={(e) => setGrammarInput(e.target.value)}
					rows={10}
					placeholder="Enter grammar rules here..."
				/>
				{/* Button to trigger the left-factoring process. */}
				<button
					type="submit"
					className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
					onClick={handleLeftFactor}
				>
					Left Factor
				</button>

				{/* Link to a testing example, this might open in a new tab. */}
				<Link
					to="/testing-example"
					target="_blank"
					className="bg-purple-500 py- ml-4 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded"
				>
					Testing
				</Link>
			</form>

			{/* Display the original grammar and the left-factored grammar. */}
			{leftFactoredGrammar && (
				<div className="mt-4 ">
					<h2 className="text-2xl font-bold mb-2 text-purple-700">
						Original Grammar:
					</h2>
					<pre className="bg-purple-800 rounded-md text-white p-4 mb-4">
						{grammarInput}
					</pre>

					<h2 className="text-2xl text-purple-700 font-bold mb-2">
						Left Factored Grammar:
					</h2>
					<pre className="bg-purple-800 rounded-md text-white mt-4 p-4">
						{/* Display the left-factored grammar in a formatted way. */}
						{Object.entries(leftFactoredGrammar).map(
							([nonTerminal, productions]) => (
								<p key={nonTerminal} className="mb-2">
									{/* Display each non-terminal and its corresponding productions. */}
									<span className="text-orange-400">{nonTerminal}</span> {"->"}{" "}
									{productions.join(" | ")}
								</p>
							)
						)}
					</pre>
				</div>
			)}
		</div>
	);
};

export default LeftFactorizationComponent;
