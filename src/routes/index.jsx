import Home from "../views/Home";
// import People from "../views/People";
// import Person from "../views/People/Person";
import Products from "../views/Products";
import Product from "../views/Product/Product";
import Cart from "../views/Cart";
import FrontLayout from "../views/Layout/FrontLayout";
import NotFound from "../views/NotFound";

const routes = [
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      // {
      //   path: "people",
      //   element: <People />,
      //   children: [{ path: ":id", element: <Person /> }],
      // },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <Product />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
