import { ThreeDots } from "react-loader-spinner";

function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 100 }}>
      <ThreeDots color="#7E07DE" height={100} width={100} />
    </div>
  );
}

export default Loader;
