import { useState } from "react";
import { Link } from "react-router-dom";

function rightFactorGrammar(grammar) {
	const newGrammar = {};

	for (const nonTerminal in grammar) {
		const productions = grammar[nonTerminal];
		const commonSuffix = findCommonSuffix(productions);

		if (commonSuffix) {
			const newNonTerminal = nonTerminal + "_new";
			const remainingProductions = productions.map((production) =>
				production.slice(0, production.length - commonSuffix.length)
			);

			newGrammar[nonTerminal] = remainingProductions;
			newGrammar[newNonTerminal] = [commonSuffix];
		} else {
			newGrammar[nonTerminal] = productions;
		}
	}

	return newGrammar;
}

function findCommonSuffix(productions) {
	if (productions.length < 2) {
		return "";
	}

	const firstProduction = productions[0];

	for (let i = 1; i <= firstProduction.length; i++) {
		const suffix = firstProduction.slice(-i);
		if (productions.every((production) => production.endsWith(suffix))) {
			return suffix;
		}
	}

	return "";
}

const RightFactorGrammer = () => {
	const [grammarInput, setGrammarInput] = useState("");
	const [leftFactoredGrammar, setLeftFactoredGrammar] = useState(null);

	const handleLeftFactor = () => {
		const grammarLines = grammarInput.split("\n");
		const grammar = {};
		for (const line of grammarLines) {
			const [nonTerminal, production] = line
				.split("->")
				.map((str) => str.trim());
			if (nonTerminal && production) {
				let splitProduction = production.split("|");
				const reMoveSpaceFromProduction = splitProduction.map((str) =>
					str.trim()
				);

				if (!grammar[nonTerminal]) {
					grammar[nonTerminal] = [];
				}
				grammar[nonTerminal] = [...reMoveSpaceFromProduction];
			}
		}

		console.log(grammar);
		// Perform left factoring on the grammar
		const leftFactoredGrammar = rightFactorGrammar(grammar);
		setLeftFactoredGrammar(leftFactoredGrammar);
	};
	return (
		<div className=" text-left">
			<h1 className="text-2xl font-bold text-purple-800 mb-4">
				Right Factoring App
			</h1>
			<textarea
				className="w-full p-2 mb-4 border border-gray-400 rounded"
				value={grammarInput}
				onChange={(e) => setGrammarInput(e.target.value)}
				rows={10}
				placeholder="Enter grammar rules here..."
			/>
			<button
				className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
				onClick={handleLeftFactor}
			>
				Right Factor
			</button>
			<Link
				to="/testing-example"
				className="bg-purple-500  ml-4 hover:bg-purple-600 text-white font-semibold px-4 py-4 rounded"
			>
				Testing
			</Link>

			{leftFactoredGrammar && (
				<div className="mt-4 ">
					<h2 className="text-2xl font-bold mb-2 text-purple-700">
						Original Grammar:
					</h2>
					<pre className="bg-purple-800 rounded-md text-white p-4 mb-4">
						{grammarInput}
					</pre>

					<h2 className="text-2xl text-purple-700 font-bold mb-2">
						Right Factored Grammar:
					</h2>
					<pre className="bg-purple-800 rounded-md text-white mt-4 p-4">
						{Object.entries(leftFactoredGrammar).map(
							([nonTerminal, productions]) => (
								<p key={nonTerminal} className="mb-2">
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

export default RightFactorGrammer;
