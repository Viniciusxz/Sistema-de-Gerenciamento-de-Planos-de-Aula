// plano de estudo controller
import TituloService from "../planos/plano.service.js"

const pegaTodos = async (req, res) => {
    const planos = await TituloService.pegaTodos();
    res.json(planos)
};

const pegaUm = async (req, res) => {
    const { id } = req.params;
    const planos = await TituloService.pegaUm(id);
    res.json(planos);
};

const criarUm = async (req, res) => {
    const planos = await TituloService.criar(req.body);
    res.status(201).json(planos);
};

const atualizarUm = async (req, res) => {
    const { id } = req.params;
    await TituloService.atualizar(id, req.body);
    res.json({ mensagem: "Dado Atualizado!" });
}

const excluirUm = async (req, res) => {
    const { id } = req.params;
    await TituloService.excluir(id);
    res.json({ mensagem: "Dado deletado." })
}

export default { pegaTodos, pegaUm, criarUm, atualizarUm, excluirUm };