import { useState } from "react";
import { Link } from "react-router-dom";

// Helper function to check if a symbol is a non-terminal (uppercase)
function isNonTerminal(symbol) {
	return /[A-Z]/.test(symbol);
}

// Function to calculate the FIRST set for a given non-terminal
function calculateFirstSet(grammar, nonTerminal, firstSet) {
	let changed = true;

	while (changed) {
		changed = false;
		if (!grammar[nonTerminal]) {
			continue;
		}
		for (const productions of grammar[nonTerminal]) {
			for (let i = 0; i < productions.length; i++) {
				const symbol = productions[i];

				if (!isNonTerminal(symbol)) {
					if (!firstSet[nonTerminal].has(symbol)) {
						firstSet[nonTerminal].add(symbol);
						changed = true;
					}
					break; // Stop considering symbols after encountering a terminal
				} else if (isNonTerminal(symbol)) {
					// Ensure that firstSet[symbol] is initialized as an empty Set
					if (!firstSet[symbol]) {
						firstSet[symbol] = new Set();
					}
					calculateFirstSet(grammar, symbol, firstSet);
					for (const firstSymbol of firstSet[symbol]) {
						if (!firstSet[nonTerminal].has(firstSymbol)) {
							firstSet[nonTerminal].add(firstSymbol);
							changed = true;
						}
					}

					if (!firstSet[symbol].has("#")) {
						// If the symbol doesn't derive epsilon, stop considering symbols
						break;
					}
				}
			}
		}
	}
}

const calculateFirst = function (grammar) {
	Object.keys(grammar).forEach((key) => {
		const values = grammar[key];
		console.log(values);
	});
	const firstSet = new Set();

	Object.keys(grammar).forEach((key) => {
		firstSet[key] = new Set();
	});

	Object.keys(grammar).forEach((key) => {
		calculateFirstSet(grammar, key, firstSet);
	});
	return firstSet;
};

function calculateFollowSet(grammar, nonTerminal, followSet, firstSet) {
	let changed = true;

	while (changed) {
		changed = false;

		for (const nonTerm in grammar) {
			for (const productions of grammar[nonTerm]) {
				for (let i = 0; i < productions.length; i++) {
					const symbol = productions[i];

					if (symbol === nonTerminal) {
						// Case 1: Non-terminal matches current non-terminal
						for (let j = i + 1; j < productions.length; j++) {
							const nextSymbol = productions[j];

							if (!isNonTerminal(nextSymbol)) {
								// If nextSymbol is a terminal, add it to the FOLLOW set
								if (!followSet[nonTerminal].has(nextSymbol)) {
									followSet[nonTerminal].add(nextSymbol);
									changed = true;
								}
								break;
							} else {
								// If nextSymbol is a non-terminal, add its FIRST set to the FOLLOW set
								const firstSetNextSymbol = firstSet[nextSymbol];
								if (firstSetNextSymbol) {
									for (const firstSymbol of firstSetNextSymbol) {
										if (!followSet[nonTerminal]?.has(firstSymbol)) {
											followSet[nonTerminal].add(firstSymbol);
											changed = true;
										}
									}

									if (!firstSetNextSymbol.has("#")) {
										// If nextSymbol doesn't derive epsilon, stop considering symbols
										break;
									}
								}
							}
						}

						if (
							i === productions.length - 1 ||
							Array.from(productions.slice(i + 1)).every((s) =>
								firstSet[s]?.has("#")
							)
						) {
							// Case 2: Non-terminal is at the end or all symbols after it derive epsilon
							for (const followSymbol of followSet[nonTerm]) {
								if (!followSet[nonTerminal].has(followSymbol)) {
									followSet[nonTerminal].add(followSymbol);
									changed = true;
								}
							}
						}
					}
				}
			}
		}
	}
}

const calculateFollow = function (grammar, firstSet) {
	const followSet = {};

	Object.keys(grammar).forEach((key) => {
		followSet[key] = new Set();
	});

	// Add $ to the start symbol's FOLLOW set (assuming it's always the first non-terminal)
	followSet[Object.keys(grammar)[0]].add("$");

	let changed = true;
	while (changed) {
		changed = false;

		Object.keys(grammar).forEach((key) => {
			calculateFollowSet(grammar, key, followSet, firstSet);
		});
	}

	return followSet;
};

const FirstAndFollowCalculator = () => {
	const [grammarInput, setGrammarInput] = useState("");
	const [firstSets, setFirstSets] = useState({});
	const [followSets, setFollowSets] = useState({});

	const handleInputChange = (event) => {
		setGrammarInput(event.target.value);
	};

	const handleCalculate = () => {
		// Parse the grammarInput and convert it into a grammar object
		// For simplicity, let's assume each line represents a production rule
		const grammarLines = grammarInput.split("\n");
		const grammar = {};
		for (const line of grammarLines) {
			const [nonTerminal, production] = line
				.split("->")
				.map((str) => str.trim());
			if (!nonTerminal || !production) {
				return;
			}

			let splitProduction = production.split("|");
			const reMoveSpaceFromProduction = splitProduction.map((str) =>
				str.trim()
			);
			// console.log(splitProduction);

			if (!grammar[nonTerminal]) {
				grammar[nonTerminal] = [];
			}
			grammar[nonTerminal] = [...reMoveSpaceFromProduction];
		}

		// ? Calculate FIRST sets
		console.log(grammar);
		const resultFirst = calculateFirst(grammar);
		setFirstSets(resultFirst);
		console.log(resultFirst);
		const resultFollow = calculateFollow(grammar, resultFirst);
		setFollowSets(resultFollow);
		console.log(resultFollow);
	};

	// Function to convert a Set to a string
	function setToString(set) {
		return Array.from(set).join(", ");
	}

	return (
		<div className="container mx-auto  text-left">
			<h2 className="text-xl font-semibold text-purple-700 mb-4">
				First and Follow Sets Calculator
			</h2>
			<div>
				<textarea
					value={grammarInput}
					onChange={handleInputChange}
					placeholder="Enter grammar rules in the format: nonTerminal -> production"
					rows={6}
					cols={50}
					className="border border-gray-300 hover:border-purple-700 outline-none rounded p-2 w-full mb-4"
				/>
			</div>
			<div>
				<p className="mt-0 text-red-500 mb-2 pb-2">
					{" "}
					we assume that ε (empty string) is represented as{" "}
					<span className="text-bold text-xl">'ε'</span> . The $ symbol
					represents the end-of-input symbol used in the FOLLOW set of the start
					symbol
				</p>
				<button
					onClick={handleCalculate}
					className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded"
				>
					Calculate
				</button>
				<Link
					to="/testing-example"
					target="_blank"
					className="bg-purple-500 ml-4 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded"
				>
					Testing
				</Link>
			</div>
			<div className="bg-purple-900 p-5 rounded-md mt-5">
				{Object.keys(firstSets).length > 0 && (
					<div className="mt-6 bg-purple-800 p-5 rounded-md">
						<h2 className="text-xl text-white font-semibold mb-4">
							First Sets:
						</h2>
						<div className="overflow-x-auto">
							<table className="table-auto w-full border-collapse">
								<thead>
									<tr className="bg-gray-200 ">
										<th className="px-4 font-bold text-purple-800 py-2">
											Non-Terminal
										</th>
										<th className="px-4 py-2 text-purple-800 font-bold">
											First Set
										</th>
									</tr>
								</thead>
								<tbody className="mt-5">
									{Object.entries(firstSets).map(
										([nonTerminal, firstSetSymbols]) => (
											<tr key={nonTerminal} className="border-t  bg-purple-700">
												<td className="px-4 py-3 text-white my-2">
													{nonTerminal}
												</td>
												<td className="px-4 text-xl py-2">
													<span className="text-orange-600">{"{ "}</span>{" "}
													<span className="text-white ">
														{setToString(firstSetSymbols)}
													</span>{" "}
													<span className="text-orange-600"> {" }"}</span>
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>
				)}
				{Object.keys(followSets).length > 0 && (
					<div className="mt-6 bg-purple-800 p-5 rounded-md">
						<h2 className="text-xl font-semibold text-white mb-4">
							Follow Sets:
						</h2>
						<div className="overflow-x-auto">
							<table className="table-auto w-full border-collapse">
								<thead>
									<tr className="bg-gray-200">
										<th className="px-4 py-2 text-purple-900">Non-Terminal</th>
										<th className="px-4 py-2 text-purple-900">Follow Set</th>
									</tr>
								</thead>
								<tbody>
									{Object.entries(followSets).map(([nonTerminal, set]) => (
										<tr key={nonTerminal} className="border-t  bg-purple-700">
											<td className="px-4 text-white py-2">{nonTerminal}</td>
											<td className="px-4 text-xl py-2">
												<span className="text-orange-600">{"{ "}</span>
												<span className="text-white">
													{Array.from(set).join(", ")}
												</span>
												<span className="text-orange-600">{" }"}</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FirstAndFollowCalculator;
