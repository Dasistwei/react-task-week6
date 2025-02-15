import { useParams } from "react-router";
function Person() {
  const param = useParams();
  console.log(param);

  return <h1>Person page</h1>;
}
export default Person;
