import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className="bg-purple-800 py-4 rounded-md font-semibold flex justify-start px-10 items-center">
			<Link
				to="/"
				className="text-xl hover:bg-purple-900 text-white transition-all duration-200 px-5 py-2 rounded-lg"
			>
				Home
			</Link>
		</div>
	);
};

export default Header;
