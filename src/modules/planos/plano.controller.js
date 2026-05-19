import TituloService from "./plano.service.js";

const pegaTodos = async (req, res) => {
  try {
    const planos = await TituloService.pegaTodos(req.query);
    res.json(planos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Nao foi possivel listar os planos." });
  }
};

const pegaUm = async (req, res) => {
  try {
    const { id } = req.params;
    const plano = await TituloService.pegaUm(id);

    if (!plano) {
      return res.status(404).json({ message: "Plano de aula nao encontrado." });
    }

    return res.json(plano);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Nao foi possivel carregar o plano." });
  }
};

const criarUm = async (req, res) => {
  try {
    const plano = await TituloService.criar(req.body);
    res.status(201).json(plano);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Nao foi possivel criar o plano." });
  }
};

const atualizarUm = async (req, res) => {
  try {
    const { id } = req.params;
    const plano = await TituloService.atualizar(id, req.body);

    if (!plano) {
      return res.status(404).json({ message: "Plano de aula nao encontrado." });
    }

    return res.json(plano);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Nao foi possivel atualizar o plano." });
  }
};

const excluirUm = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await TituloService.excluir(id);

    if (!deletedCount) {
      return res.status(404).json({ message: "Plano de aula nao encontrado." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Nao foi possivel excluir o plano." });
  }
};

export default { pegaTodos, pegaUm, criarUm, atualizarUm, excluirUm };

//