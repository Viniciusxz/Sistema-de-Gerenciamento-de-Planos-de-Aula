import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Titulo = sequelize.define("Titulo", {
    titulo: DataTypes.STRING,
    objetivo: DataTypes.STRING,
    ementa: DataTypes.TEXT,
    dataPrevista: DataTypes.DATEONLY,
    disciplina: DataTypes.STRING,
    conteudos: DataTypes.TEXT,
    recursosApoio: DataTypes.TEXT,
    tags: DataTypes.TEXT,
}, {
    tableName: "titulo",
});

export default Titulo;

//