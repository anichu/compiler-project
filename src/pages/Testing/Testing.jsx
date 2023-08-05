const Testing = () => {
	return (
		<div className="text-left bg-purple-800 w-full rounded-md text-white p-5">
			<div className="bg-purple-600 p-10 my-5 rounded-md">
				<h1 className="text-2xl mb-2">Test for Expression Tokenization</h1>
				<p>A=B+c</p>
				<p className="my-2">a=B*c</p>
				<p>A=B-c</p>
			</div>
			<div className="bg-purple-600 p-10 my-5 rounded-md">
				<h1 className="text-2xl mb-2">Test for Left Factoring</h1>
				<div className="flex">
					<span className="text-orange-500  font-semibold">Test 1:</span>
					<p className="ml-2">A {"->"} aAB | aBc | aAc</p>
				</div>
				<div className="flex">
					<span className="text-orange-500  font-semibold">Test 2:</span>
					<p className="ml-2">S {"->"} iXY | iiAb | iXc</p>
				</div>
				<div className="flex">
					<span className="text-orange-500  font-semibold">Test 2:</span>
					<p className="ml-2">1 {"->"} 0123 | 034</p>
				</div>
			</div>

			<div className="bg-purple-600 p-10 my-5 rounded-md">
				<h1 className="text-2xl mb-2">Test for First and Follow</h1>
				<p>
					{" "}
					<span className="text-orange-500 font-semibold">Test 1:</span> A{" "}
					{"->"} aAB | aBc | aAc
				</p>
				<div className="flex">
					<span className="text-orange-500 font-semibold">Test 2:</span>
					<p className="ml-2">
						A {"->"} Ta <br /> T {"->"} *FTc
					</p>
				</div>
			</div>
			<div className="bg-purple-600 p-10 my-5 rounded-md">
				<h1 className="text-2xl mb-2">Test for Left Recursion</h1>
				<p className="my-4">
					<span className="text-orange-500 font-semibold">Test 1:</span> A{" "}
					{"->"} aAB | aBc | aAc
				</p>
				<p className="mb-4">
					{" "}
					<span className="text-orange-500 font-semibold">Test 2:</span> A{" "}
					{"->"} Abc | Acd | CD | XY
				</p>
				<p className="mb-4">
					{" "}
					<span className="text-orange-500 font-semibold">Test 3:</span> E{" "}
					{"->"} E+T | T
				</p>
				<p className="mb-4">
					{" "}
					<span className="text-orange-500 font-semibold">Test 4:</span> S{" "}
					{"->"} S0SIS | 01
				</p>
				<p className="mb-4">
					{" "}
					<span className="text-orange-500 font-semibold">Test 4:</span> S L{" "}
					{"->"} L,S | S
				</p>
			</div>
		</div>
	);
};

export default Testing;
