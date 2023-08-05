import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import GrammarTransformer from "../pages/grammerTransformer/GrammarTransformer";
import Home from "../pages/Home/Home";
import ExpressionTokenizer from "../pages/ExpressionTokenizer/ExpressionTokenizer";
import FirstAndFollowCalculator from "../pages/FirstAndFollowCalculator/FirstAndFollowCalculator";
import LeftFactorizationComponent from "../pages/LeftFactorGrammer/LeftFactorGrammer";
import RightFactorGrammer from "../pages/RightFactorGrammer/RightFactorGrammer";
import Testing from "../pages/Testing/Testing";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/left-recursion",
				element: <GrammarTransformer />,
			},
			{
				path: "/expression-to-token",
				element: <ExpressionTokenizer />,
			},
			{
				path: "/first-and-follow",
				element: <FirstAndFollowCalculator />,
			},
			{
				path: "/left-factor",
				element: <LeftFactorizationComponent />,
			},
			{
				path: "/right-factor",
				element: <RightFactorGrammer />,
			},
			{
				path: "/testing-example",
				element: <Testing />,
			},
		],
	},
]);
