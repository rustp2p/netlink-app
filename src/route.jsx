import {
	createBrowserRouter,
	Navigate,
} from "react-router-dom";

import Home from "./pages/home";
import Current from "./pages/current";
import Group from "./pages/group";
import Nodes from "./pages/nodes";
import Launcher from "./pages/launcher";
import Login from "./pages/login";

export const router = createBrowserRouter([
	{
		path:"/",
		element:<Launcher />
	},
	{
		path:"/login",
		element:<Login />
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