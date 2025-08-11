    const express = require("express");
    const fs = require("fs");
    const path = require("path");
    const app = express();
    const PORT = 5000;

    app.use(express.json());

    const filePath = path.join(__dirname, "characters.json");

    // lecture de characters
    function readCharacters() {
    const rawData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(rawData);
    }

    //metre a jour le fichier characters.json
    function writeCharacters(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    //lister les truc dans characters
    app.get("/api", (req, res) => {
    try {
        const perso = readCharacters();
        res.json(perso);
    } catch (error) {
        console.error("Erreur de lecture :", error.message);
        res.status(500).json({ error: "Erreur de lecture du fichier." });
    }
    });

    //ajouter un personage
    app.post("/api", (req, res) => {
    const perso = readCharacters();
    const maxId = perso.characters.reduce(
        (max, char) => Math.max(max, char.id),
        0
    );
    const newCharacter = {
        id: maxId + 1,
        name: req.body.name,
        realName: req.body.realName,
        universe: req.body.universe,
    };
    perso.characters.push(newCharacter);
    writeCharacters(perso);
    res.status(201).json(newCharacter);
    });

    //modifier un perso
    app.put("/api/:id", (req, res) => {
    const perso = readCharacters();
    const id = parseInt(req.params.id);
    const index = perso.characters.findIndex((c) => c.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "le personnage n'a pas eté trouver" });
    }
    perso.characters[index].name = req.body.name;
    writeCharacters(perso);
    res.json(perso.characters[index]);
    });

    //supprimer un perso
    app.delete("/api/:id", (req, res) => {
    const perso = readCharacters();
    const id = parseInt(req.params.id);
    const filtered = perso.characters.filter((p) => p.id !== id);
    if (filtered.length === perso.characters.length) {
        return res.status(404).json({ error: "le personnage n'a pas eté trouver" });
    }
    writeCharacters({ characters: filtered });
    res.status(204).send();
    });

    // rechercher un perso
    app.get("/api/search", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");
    const searchTerm = req.query.term?.toLowerCase();
    try {
        const rawData = fs.readFileSync(filePath, "utf-8");
        const perso = JSON.parse(rawData).characters;
        const resultat = perso.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.id.toString() === searchTerm || 
            p.realName.toLowerCase().includes(searchTerm)||
            p.universe.toLowerCase().includes(searchTerm)
        
            );
            res.json(resultat)
    } catch (error) {
        res.status(500).json({error: "Erreur dans le serveur" });
    }
    });

    //lancement du server
    app.listen(PORT, () => {
    console.log(`le server est lancer dans http://localhost:${PORT}`);
    });
