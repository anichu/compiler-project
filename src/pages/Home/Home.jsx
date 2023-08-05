import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const Card = ({ item }) => {
	return (
		<Link
			to={item.url}
			className="bg-white font-bold text-xl text-purple-900 transition-all duration-300 ease-in-out hover:text-white hover:bg-purple-900  rounded-lg h-[200px] flex flex-col justify-center shadow-md p-4 border border-purple-600"
		>
			{item.name}
		</Link>
	);
};

Card.propTypes = {
	item: PropTypes.shape({
		name: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
	}).isRequired,
};

const Home = () => {
	const data = [
		{
			name: "Expression to Token",
			url: "/expression-to-token",
		},
		{
			name: "Removing Left Recursion",
			url: "/left-recursion",
		},
		{
			name: "Calculate First and Follow",
			url: "/first-and-follow",
		},
		{
			name: "Removing Left Factoring",
			url: "/left-factor",
		},
	];
	return (
		<div className="grid sm:grid-cols-3 grid-cols-2 gap-5">
			{data.map((item, index) => (
				<Card item={item} key={index} />
			))}
		</div>
	);
};

export default Home;
