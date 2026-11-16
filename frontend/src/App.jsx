import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import List from "./components/List";
import Addtask from "./components/Addtask";
import UpdateTask from "./components/UpdateTask";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Protected from "./components/Protected";
import "./Style/App.css";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Protected = sirf login user hi in pages ko dekh sakta hai */}
        <Route path="/" element={<Protected><List /></Protected>} />
        <Route path="/Add" element={<Protected><Addtask /></Protected>} />
        <Route path="/update/:id" element={<Protected><UpdateTask /></Protected>} />

        {/* Ye pages sabke liye open hain */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}
