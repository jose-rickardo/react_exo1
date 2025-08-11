
import Body from "./element/Body.jsx";
function App() {
  let r = fetch("https://jsonplaceholder.typicode.com/users");
  console.log(r);

  return (
    <div className="bg-blue-400 h-screen relative z-0 flex flex-col items-center">
      <Body />
    </div>
  );
}
export default App;
