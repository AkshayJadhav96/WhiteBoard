import Whiteboard from "./Whiteboard";

function App() {
  return (
    <div>
      <h1 className="flex justify-center bg-gray-700 p-4 text-3xl font-bold">Online Whiteboard MVP</h1>
      <Whiteboard roomName="demo" />
    </div>
  );
}

export default App;
