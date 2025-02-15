import { Outlet, NavLink } from "react-router";
import "./index.css";
function Layout() {
  const isActive = (navParam) => {
    return navParam.isActive ? "active" : "";
  };
  return (
    <>
      <div className="container">
        <nav className="nav">
          <div className="nav-link">
            <NavLink to="" className={isActive}>
              首頁
            </NavLink>
          </div>
          <div className="nav-link">
            <NavLink to="/products" className={isActive}>
              產品列表
            </NavLink>
          </div>
          <div className="nav-link">
            <NavLink to="/cart" className={isActive}>
              購物車
            </NavLink>
          </div>
        </nav>
      </div>
      <Outlet />
    </>
  );
}
export default Layout;
