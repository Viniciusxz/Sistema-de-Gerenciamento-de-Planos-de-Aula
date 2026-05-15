import Titulo from "../../database/models/titulo.js";

const pegaTodos = async () => {
    return Titulo.findAll();
}

const pegaUm = async (id) => {
    return Titulo.findByPk(id);
}

const criar = async (dados) => {
    return Titulo.create(dados);
}

const atualizar = async (id, dados) => {
    return Titulo.update(dados, { where: { id } });
}

const excluir = async (id) => {
    return Titulo.destroy({ where: { id } });
}

export default { pegaTodos, pegaUm, criar, atualizar, excluir };