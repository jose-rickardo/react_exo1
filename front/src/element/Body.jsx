import ajoute from "../assets/plus.png";
import edit from "../assets/edit.png";
import delet from "../assets/bin.png";
import fondNav from "../assets/fondNav.jpg";
import React, { useEffect, useState } from "react";
const Body = () => {
  const [backendData, setBackendData] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [realNameInput, setRealNameInput] = useState("");
  const [universeInput, setUniverseInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [hover, setHover] = useState(null);

  const bgColor = () => {
    if (hover === "edit") {
      return "bg-green-400";
    }
    if (hover === "delet") {
      return "bg-red-400";
    }
    return "bg-amber-200";
  };
  
// Charger les données du backend
  const fetcher = () => {
    fetch("/api")
    .then((res) => res.json())
    .then((data) => setBackendData(data.characters)
    );
  };
useEffect(() => {
  fetcher();
}, [])

//modifier 
const update = (id) => {

}

//ajouter
const add = () => {
  if (nameInput.trim() === "") return;

  fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nameInput , realName: realNameInput, universe: universeInput }),
  })
    .then(() => {
      setNameInput("");
      fetcher();
    });
}

  //pour filter les perso
  const filteredUsers = backendData.filter((x) => {
  const q = searchQuery.toLowerCase();
  return (
    (x.name || "").toLowerCase().includes(q) ||
    (x.realName || "").toLowerCase().includes(q) ||
    (x.universe || "").toString().toLowerCase().includes(q)
  );
});



  
  return (
    <>
      <div
        className="w-full h-1/5 bg-cover bg-center"
        style={{ backgroundImage: `url(${fondNav})` }}
      >
        <nav className="bg-amber-300 h-1/7 top-15 w-4/5 fixed left-1/2 -translate-x-1/2 rounded-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="recherche.."
            className="border-2 border-gray-600 rounded-lg p-2 m-2"
          />
          <button className="w-14 gap-2 border-none overflow-hidden absolute flex items-center bottom-0 right-0 m-4 p-2 cursor-pointer bg-gray-700 text-white rounded-full transition-all hover:w-30">
            <img src={ajoute} alt="" className="h-10 font-bold text-3xl " />
            <h1>Ajouter</h1>
          </button>
        </nav>
      </div>

      <div className="h-4/5 w-full bg-amber-50 pt-10 overflow-scroll ">
        {/* aficher le liste*/}
        {filteredUsers.length === 0 ? (
          <p className="text-center text-2xl font-bold">
            Aucun personage trouver trouvé
          </p>
        ) : (
          filteredUsers.map((e) => (
            <div className="flex items-center justify-center mb-10">
              <table className="bg-amber-400 h-15 w-3/4">
                <thead className="bg-emerald-700">
                  <tr className="rounde">
                    <td className="text-xl border-2 font-bold w-1/4">id</td>
                    <td className="text-xl border-2 font-bold w-1/4">Name</td>
                    <td className="text-xl border-2 font-bold w-1/4">
                      realName
                    </td>
                    <td className="text-xl border-2 font-bold w-1/4">
                      universe
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-xl border-2 ">{e.id}</td>
                    <td className="text-xl border-2 ">{e.name}</td>
                    <td className="text-xl border-2 ">{e.realName}</td>
                    <td className="text-xl border-2 ">{e.universe}</td>
                  </tr>
                </tbody>
              </table>
              <div
                className={`flex justify-between px-5 items-center w-1/5  ${bgColor()}`}
              >
                <button
                  className="m-2 cursor-pointer"
                  onMouseEnter={() => setHover("edit")}
                  onMouseLeave={() => setHover(null)}
                >
                  <img src={edit} alt="edit" className="h-15" />
                </button>
                <button
                  className="m-2 cursor-pointer"
                  onMouseEnter={() => setHover("delet")}
                  onMouseLeave={() => setHover(null)}
                >
                  <img src={delet} alt="delete" className="h-15" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
export default Body;
