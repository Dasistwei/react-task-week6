import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, []);
  return (
    <div>
      <h1>404 Not Found</h1>
      {/* <Link to="/">Go Home</Link>
      <div className="">
        <a href="/">a</a>
      </div> */}
    </div>
  );
}
export default NotFound;
