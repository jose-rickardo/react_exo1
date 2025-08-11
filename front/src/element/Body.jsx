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

  const [positionAjoutInput, setPositionAjoutInput] = useState("w-0 h-0");
  const [showAddForm, setShowAddForm] = useState(false);

  const [positionEditInput, setPositionEditInput] = useState("w-0 h-0");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editIdInput, setEditIdInput] = useState(null);
  const [editNameInput, setEditNameInput] = useState("");
  const [editRealNameInput, setEditRealNameInput] = useState("");
  const [editUniverseInput, setEditUniverseInput] = useState("");

  const bgColor = () => {
    return "bg-amber-200";
  };

  const addModeSortie = () => {
    setPositionAjoutInput("w-0 h-0");
    setShowAddForm(false);
  };

  const addModeEntrer = () => {
    setPositionAjoutInput("w-full h-full");
    setShowAddForm(true);
  };

  const editModeSortie = () => {
    setPositionEditInput("w-0 h-0");
    setShowEditForm(false);
    setEditIdInput(null);
    setEditNameInput("");
    setEditRealNameInput("");
    setEditUniverseInput("");
  }

  const editModeEntrer = (id,name,realName,universe) => {
    setPositionEditInput("w-full h-full");
    setShowEditForm(true);
    setEditIdInput(id);
    setEditNameInput(name);
    setEditRealNameInput(realName);
    setEditUniverseInput(universe);

  }
  // Charger les données du backend
  const fetcher = () => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setBackendData(data.characters));
  };
  useEffect(() => {
    fetcher();
  }, []);

  // Ajouter
  const add = async () => {
    if (nameInput.trim() === "") return;
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput,
          realName: realNameInput,
          universe: universeInput,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      setNameInput("");
      setRealNameInput("");
      setUniverseInput("");
      fetcher();
      addModeSortie();
    } catch (error) {
      console.error("Erreur dans add:", error);
    }
  };

  // Supprimer
  const deleter = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce personnage ?")) {
      try {
        const res = await fetch(`/api/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        fetcher();
      } catch (error) {
        console.error("Erreur dans deleter:", error);
      }
    }
  };

  // Modifier
  const update = async () => {
    if (editNameInput.trim() === "") return;
    try {
      const res = await fetch(`/api/${editIdInput}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editNameInput,
          realName: editRealNameInput,
          universe: editUniverseInput,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      fetcher();
      editModeSortie();
    } catch (error) {
      console.error("Erreur dans update:", error);
    }
  };

  // Filtrer les personnages
  const filteredUsers = backendData.filter((x) => {
    const q = searchQuery.toLowerCase();
    return (
      (x.name || "").toLowerCase().includes(q) ||
      (x.realName || "").toLowerCase().includes(q) ||
      (x.universe || "").toLowerCase().includes(q) ||
      (x.id || "").toString().toLowerCase().includes(q)
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
          <button
            onClick={addModeEntrer}
            className="w-14 gap-2 border-none overflow-hidden absolute flex items-center bottom-0 right-0 m-4 p-2 cursor-pointer bg-gray-700 text-white rounded-full transition-all hover:w-30"
          >
            <img src={ajoute} alt="Ajouter" className="h-10" />
            <h1>Ajouter</h1>
          </button>
        </nav>
      </div>

      <div className="h-4/5 w-full bg-amber-50 pt-10 overflow-scroll">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-2xl font-bold">
            Aucun personnage trouvé
          </p>
        ) : (
          filteredUsers.map((e) => (
            <div key={e.id} className="flex items-center justify-center mb-10">
              {" "}
              <table className="bg-amber-400 h-15 w-3/4">
                <thead className="bg-emerald-700">
                  <tr className="rounded">
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
                    <td className="text-xl border-2">{e.id}</td>
                    <td className="text-xl border-2">{e.name}</td>
                    <td className="text-xl border-2">{e.realName}</td>
                    <td className="text-xl border-2">{e.universe}</td>
                  </tr>
                </tbody>
              </table>
              <div
                className={`flex justify-between px-5 items-center w-1/5 ${bgColor()}`}
              >
                <button
                  onClick={() => editModeEntrer(e.id, e.name, e.realName, e.universe)}
                  className="m-2 cursor-pointer"
                >
                  <img src={edit} alt="edit" className="h-10" />
                </button>
                <button
                  onClick={() => deleter(e.id)}
                  className="m-2 cursor-pointer"
                >
                  <img src={delet} alt="delete" className="h-10" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div
        className={`absolute bg-blue-700 ${showAddForm ? "block" : "hidden"} ${positionAjoutInput} flex items-center flex-col`} // Toggle hidden/block
      >
        <form className="absolute p-10 rounded-2xl bg-amber-50 flex flex-col items-center gap-3 translate-y-1/2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="border-2 border-black rounded-xl h-10 shadow-2xl shadow-black bg-amber-50" // Corrigé border-e-black → border-black
            placeholder="name"
          />
          <input
            type="text"
            value={realNameInput}
            onChange={(e) => setRealNameInput(e.target.value)}
            className="border-2 border-black rounded-xl h-10 shadow-2xl shadow-black bg-amber-50"
            placeholder="real name"
          />
          <input
            type="text"
            value={universeInput}
            onChange={(e) => setUniverseInput(e.target.value)}
            className="border-2 border-black rounded-xl h-10 shadow-2xl shadow-black bg-amber-50"
            placeholder="univers"
          />
          <button
            onClick={add}
            className="bg-amber-500 rounded-lg text-amber-50 text-2xl px-6 py-1"
          >
            ajouter
          </button>
          <button
            onClick={addModeSortie}
            className="absolute top-0 right-0 bg-amber-50 p-1 font-bold text-3xl cursor-pointer"
          >
            X
          </button>
        </form>
      </div>
      {/* Formulaire de modification */}
      <div
        className={`absolute bg-blue-700 ${showEditForm ? 'block' : 'hidden'} ${positionEditInput} flex items-center flex-col`}
      >
        <form className="absolute p-10 rounded-2xl bg-amber-50 flex flex-col items-center gap-3 translate-y-1/2">
          <input
            type="text"
            value={editNameInput}
            onChange={(e) => setEditNameInput(e.target.value)}
            className="border-2 border-black rounded-xl h-10 shadow-2xl shadow-black bg-amber-50"
            placeholder="name"
          />
          <input
            type="text"
            value={editRealNameInput}
            onChange={(e) => setEditRealNameInput(e.target.value)}
            className="border-2 border-black rounded-xl h-10 shadow-2xl shadow-black bg-amber-50"
            placeholder="real name"
          />
          <input
            type="text"
            value={editUniverseInput}
            onChange={(e) => setEditUniverseInput(e.target.value)}
            className="border-2 border-black rounded-xl h-10 shadow-2xl shadow-black bg-amber-50"
            placeholder="univers"
          />
          <button
            onClick={update}
            className="bg-amber-500 rounded-lg text-amber-50 text-2xl px-6 py-1"
          >
            modifier
          </button>
          <button
            onClick={editModeSortie}
            className="absolute top-0 right-0 bg-amber-50 p-1 font-bold text-3xl cursor-pointer"
          >
            X
          </button>
        </form>
      </div>
    </>
  );
};

export default Body;