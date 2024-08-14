import { Spinner } from "../components/bootstrap";

export default function loading() {
  return (
    <div>
      <Spinner animation="border" className="d-block m-auto" />
      <p className="d-block m-auto">Loading...</p>
    </div>
  );
}
