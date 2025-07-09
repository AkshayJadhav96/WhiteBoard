import CurrWhiteboard from "./components/CurrWhiteBoard";
import NavBar from "./components/NavBar"

function App() {
  return (
    <div>
      <NavBar/>
      <CurrWhiteboard roomName="Demo" />
    </div>
  );
}

export default App;
