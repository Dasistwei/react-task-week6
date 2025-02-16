import { Outlet, NavLink } from "react-router";
import "../../index.css";
function FrontLayout() {
  const isActive = (navParam) => {
    return navParam.isActive ? "active" : "";
  };
  const navRoutes = [
    {
      name: "首頁",
      path: "",
    },
    {
      name: "產品列",
      path: "/products",
    },
    {
      name: "購物車",
      path: "/cart",
    },
  ];
  return (
    <>
      <div className="container">
        <nav className="nav">
          {navRoutes.map((navRoute) => {
            return (
              <div className="nav-link" key={navRoute.path}>
                <NavLink to={navRoute.path} className={isActive}>
                  {navRoute.name}
                </NavLink>
              </div>
            );
          })}
        </nav>
      </div>
      <Outlet />
    </>
  );
}
export default FrontLayout;
