import axios from "axios";
import { useNavigate } from "@tanstack/react-location";

const Home = () => {
  const navigate = useNavigate();
  const response = async (res: any) => {
    console.log("res", res);
    await axios.post("https://192.168.1.10:45456/api/DashboardUser/SignIn", {
      userName: "admin",
      password: "123456",
    });
    navigate({ to: "/about", replace: true });
  };
  return (
    <div>
      <button onClick={response}>signIn</button>
    </div>
  );
};
export default Home;
