import WhiteBoard from "./components/WhiteBoard";
import NavBar from "./components/NavBar"
import WhiteBoardPage from "./components/WhiteBoardPage";

function App() {
  return (
    <div>
      <NavBar/>
      <WhiteBoard roomName = "Demo"/>
      {/* <WhiteBoardPage roomName = "Demo"/> */}
    </div>
  );
}

export default App;
