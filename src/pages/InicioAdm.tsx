import AdmiSiderbar from "../components/features/admi/AdmiSiderbar";
import AdmiNavbar from "../components/features/admi/AdmiNavbar";
import AdmiBody from "../components/features/admi/AdmiBody";

const InicioAdm = () => (
  <div className="flex h-screen bg-gray-50">
    <AdmiSiderbar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdmiNavbar />
      <AdmiBody>{/* Tu dashboard, grid, cards, etc */}</AdmiBody>
    </div>
  </div>
);

export default InicioAdm;
