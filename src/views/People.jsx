import { Outlet } from "react-router";
function People() {
  return (
    <>
      <h1>People page</h1>
      <Outlet />
    </>
  );
}
export default People;
