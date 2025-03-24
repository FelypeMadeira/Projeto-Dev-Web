import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../pages/login";
import { Register } from "../pages/register";
import {ADM} from "../pages/register_ADM"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register_ADM" element={<ADM/>}/>
      </Routes>
    </BrowserRouter>
  );
}
