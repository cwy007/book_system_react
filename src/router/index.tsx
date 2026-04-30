import { createBrowserRouter } from "react-router-dom";
import BookList from "../pages/BookList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BookList />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

export default router;
