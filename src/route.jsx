import {
	createBrowserRouter,
	Navigate,
} from "react-router-dom";

import Home from "./pages/home";
import Current from "./pages/current";
import Group from "./pages/group";
import Nodes from "./pages/nodes";

export const router = createBrowserRouter([
	{
		path:"/",
		element:<Navigate to="/home/current" replace></Navigate>
	},
	{
		path:"*",
		element:<Navigate to="/home/current" replace></Navigate>
	},
	{
		path:"/home",
		element: <Home />,
		children:[
			{
				path:"current",
				element: <Current />
			},
			{
				path:"group",
				element: <Group />
			},
			{
				path:"nodes",
				element: <Nodes />
			}
		]
	},
]);