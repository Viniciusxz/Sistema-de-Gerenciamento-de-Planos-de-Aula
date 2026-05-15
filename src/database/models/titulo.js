import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
    class Titulo extends Model {
        static associate(models) {
            // foreign keys
        }
    }

    Titulo.init({
        titulo: DataTypes.STRING,
        objetivo: DataTypes.STRING,
        ementa: DataTypes.TEXT,
        dataPrevista: DataTypes.TEXT,
        disciplina: DataTypes.STRING,
        conteudos: DataTypes.TEXT,
        recursosApoio: DataTypes.TEXT,
        tags: DataTypes.TEXT,
    } , {
        sequelize,
        modelName: 'Titulo',
        tableName: 'titulo',
    });
    return Titulo;
};