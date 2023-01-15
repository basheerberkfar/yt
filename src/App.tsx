import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "react-images-upload";
import useStore from "./zustand/store";
import axios from "axios";
import FacebookLogin, {
  ReactFacebookFailureResponse,
  ReactFacebookLoginInfo,
} from "react-facebook-login";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import * as XLSX from "xlsx";
import useRouter from "./router/router";
import { Router, ReactLocation, Outlet } from "@tanstack/react-location";
import "./App.css";

type IValues = {
  type: string;
  color: string;
  speed: number;
};

const InitialValues: IValues = {
  type: "",
  color: "",
  speed: 0,
};

const typeArray = [
  { id: 0, value: "audi" },
  { id: 1, value: "mazda" },
];
const colorArray = [
  { id: 0, value: "green" },
  { id: 1, value: "red" },
];
const speedArray = [
  { id: 0, value: 240 },
  { id: 1, value: 250 },
  { id: 1, value: 300 },
  { id: 1, value: 70 },
  { id: 1, value: 120 },
];
const typeOfManifactourArray = [
  { id: 0, value: "Germany" },
  { id: 1, value: "USA" },
];

type DataBase = {
  type: string;
  speed: string;
  color: string;
  price: number;
};

const SELECT_STYLE = {
  width: "10%",
  padding: "5px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const CONTAINER_SELECT_STYLE = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const CONTAINER_STYLE = {
  display: "grid",
};

const Button_Style = {
  width: "100px",
  padding: "5px",
  border: "none",
  borderRadius: "5px",
  background: "#65a0f9",
  color: "white",
  fontWeight: "bold",
  outline: "none",
};

type TExportedToExcel = {
  color: string;
  speed: number;
  type: string;
  price: number;
};

const location = new ReactLocation();

function App() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [randBetweenPrice, setRanBetweenPrice] = useState(0);
  const [dataToExport, setDataToExport] = useState<TExportedToExcel>();
  const [files, setFiles] = useState<string[]>([]);
  const [SelectedDataArray, setSelectedDataArray] = useState<DataBase[]>([]);
  const { register, watch } = useForm({
    defaultValues: InitialValues,
  });
  const randomNumbers = (min: number, max: number) => {
    return Math.round(Math.random() * (max - min)) + min;
  };

  const handleCheck = () => {
    const SelectedCard: IValues = {
      color: watch("color"),
      speed: watch("speed"),
      type: watch("type"),
    };

    console.log("SelectedCard", SelectedCard);

    items.map((d: any) => {
      if (d.type === SelectedCard.type) {
        setMinPrice(items[0].price);
        setMaxPrice(items[items.length - 1].price);
        if (d.price < minPrice) {
          setMinPrice(d.price);
        }
        if (d.price > maxPrice) {
          setMaxPrice(d.price);
        }
        setSelectedDataArray((prev) => prev.concat(d));
      }
    });
  };

  const handleExportToExcel = () => {
    const DataThatWillExport = {
      color: watch("color"),
      speed: watch("speed"),
      type: watch("type"),
      price: randBetweenPrice,
    };

    const data = XLSX.utils.json_to_sheet([DataThatWillExport].concat(items));
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, data, "fileName");
    XLSX.writeFile(wb, "Car.csv");
  };

  useEffect(() => {
    setRanBetweenPrice(randomNumbers(minPrice, maxPrice));
  }, [minPrice, maxPrice]);

  const readExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target!.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setItems(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const onDrop = (files: File[], pictures: string[]) => {
    // setFiles({
    //     pictures: files.concat(picture),
    // });
    setFiles(pictures);
    console.log("files", files);
    console.log("pictures", pictures);
  };

  const count = useStore.use.bears();
  const increase = useStore.use.increasePopulation!();

  const handleLoginSuccess = async (response: any) => {
    const clientId: string | undefined = response.credential;
    console.log("response", response);

    if (clientId) {
      try {
        await axios.post(
          `https://192.168.1.10:45456/api/WebsiteUser/GoogleExternalLogin?roleId=4`,
          {
            provider: "GOOGLE",
            idToken: clientId,
          }
        );
        // await axios
        //   .get(`https://192.168.1.10:45456/api/WebsiteUser/Testtttt`)
        //   .then((res) => console.log("res", res));
      } catch (err: any) {
        console.log("err", err);
      }
    }
  };

  const responseFacebook = (
    response: ReactFacebookLoginInfo | ReactFacebookFailureResponse
  ) => {
    console.log(response);
  };

  const componentClicked = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    console.log("e", e);
  };

  const Routes = useRouter();
  return (
    <GoogleOAuthProvider clientId="464662649282-hn4oqf9r5b9bvb2qnrg0bmqtlhps38gu.apps.googleusercontent.com">
      <Router location={location} routes={Routes}>
        <div className="App">
          {/* <h2>Please Select what you need</h2>
      <div style={CONTAINER_STYLE}>
        <div style={CONTAINER_SELECT_STYLE}>
          <h5>Type:</h5>
          <select style={SELECT_STYLE} {...register("type")}>
            {typeArray.map((da) => (
              <option key={da.id} value={da.value}>
                {da.value}
              </option>
            ))}
          </select>
        </div>
        <div style={CONTAINER_SELECT_STYLE}>
          <h5>Color:</h5>
          <select style={SELECT_STYLE} {...register("color")}>
            {colorArray.map((da) => (
              <option key={da.id} value={da.value}>
                {da.value}
              </option>
            ))}
          </select>
        </div>
        <div style={CONTAINER_SELECT_STYLE}>
          <h5>Speed:</h5>
          <select style={SELECT_STYLE} {...register("speed")}>
            {speedArray.map((da) => (
              <option key={da.id} value={da.value}>
                {da.value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            style={Button_Style}
            onClick={() => handleCheck()}
          >
            Check
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files![0];
            readExcel(e);
          }}
        />
      </div>
      <button
        onClick={() => handleExportToExcel()}
        style={{ marginTop: "10px" }}
      >
        Export
      </button>
      <div
        style={{ marginTop: "10px", display: "grid", gap: "10px" }}
        id="show-details"
      >
        {SelectedDataArray.slice(0, 10).map((se) => (
          <div key={se.price}>-{JSON.stringify(se)}</div>
        ))}
        <p style={{ color: "green" }}>price is: {randBetweenPrice}</p>
      </div> */}
          <FacebookLogin
            appId="1088597931155576"
            autoLoad={true}
            fields="name,email,picture"
            onClick={componentClicked}
            callback={responseFacebook}
          />
          {/* 
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleLoginSuccess(credentialResponse);
            }}
            ux_mode="popup"
            onError={() => {
              console.log("Login Failed");
            }}
          /> */}
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
