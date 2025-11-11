const AdmiBody = ({ children }: { children?: React.ReactNode }) => (
  <main className="flex-1 p-6 bg-gray-50">
    {children ? children : <h2 className="text-2xl font-semibold text-gray-800">Bienvenido al dashboard Makip</h2>}
  </main>
);

export default AdmiBody;
