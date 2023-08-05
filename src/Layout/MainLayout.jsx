import React from "react";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
	return (
		<div>
			<Header />
			<div className="p-10">
				<Outlet />
			</div>
		</div>
	);
};

export default MainLayout;
