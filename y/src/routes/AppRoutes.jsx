import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../pages/login";
import { Register } from "../pages/register";
import { ADM } from "../pages/register_ADM";
import { RegistroNovoCampo } from "../pages/pagina_RCampo";
import { TelaInicial } from "../pages/tela_inicial";
import { Adm } from "../pages/tela_inicial_Adm";
import AvaliacaoCampo from "../pages/avaliacao";
import Reserva from "../pages/Reserva";


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register_ADM" element={<ADM />} />
        <Route path="/pagina_RCampo" element={<RegistroNovoCampo />} />
        <Route path="/tela_inicial" element={<TelaInicial />} />
        <Route path="/tela_inicial_Adm" element={<Adm />} />
        <Route path="/avaliacao/:campoId" element={<AvaliacaoCampo />} />
        <Route path="/reserva" element={<Reserva />} />
        
      </Routes>
    </BrowserRouter>
  );
}
