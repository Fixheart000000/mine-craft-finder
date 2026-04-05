import { RouterProvider } from "@tanstack/react-router";
import { createRouter } from "./router";

const router = createRouter();

const App = () => <RouterProvider router={router} />;

export default App;
