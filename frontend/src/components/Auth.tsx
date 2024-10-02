import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupInput } from "@rutuja231997/medium-common-update";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();

  const [postInputs, setPostInputs] = useState<signupInput>({
    name: "",
    email: "",
    password: "",
  });

  const handleNavigation = () => {
    if (type === "signup") {
      navigate("/topics");
    } else {
      navigate("/blogs");
    }
  };
  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const token = response.data.jwt;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify(response?.data?.user || {})
        );
        handleNavigation();
      }
    } catch (error) {
      console.log("error while signup", error);
      alert("error while signup");

      //alert the user here that the request failed;
    }
  }
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-2xl font-bold">Create an account</div>

            <div className="text-slate-500">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>

          <div className="pt-8">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="rutuja Kamble"
                onChange={(e) => {
                  setPostInputs({
                    ...postInputs,
                    name: e.target.value,
                  });
                }}
              />
            ) : null}

            <LabelledInput
              label="Email"
              placeholder="google@gmail.com"
              onChange={(e) => {
                setPostInputs({ ...postInputs, email: e.target.value });
              }}
            />
            <LabelledInput
              label="Password"
              type={"password"}
              placeholder="Apple@89"
              onChange={(e) => {
                setPostInputs({ ...postInputs, password: e.target.value });
              }}
            />

            <button
              type="button"
              onClick={sendRequest}
              className=" w-full mt-8 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type === "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}
function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white pt-4">
          {label}
        </label>
        <input
          onChange={onChange}
          type={type || "text"}
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}
