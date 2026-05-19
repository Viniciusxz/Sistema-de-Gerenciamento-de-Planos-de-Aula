const validarCriarPlano = (req, res, next) => {
    const { tituloAula, objetivo, ementaResumo, disciplina, dataPrevista } = req.body;

    if (!tituloAula || tituloAula.length < 3) {
        return res.status(400).json({ erro: "Título é obrigatório e deve ter no mínimo 3 caracteres." });
    }

    if (!objetivo || objetivo.length < 5) {
        return res.status(400).json({ erro: "Objetivo é obrigatório e deve ter no mínimo 5 caracteres." });
    }

    if (!ementaResumo || ementaResumo.length < 10) {
        return res.status(400).json({ erro: "Ementa é obrigatória e deve ter no mínimo 10 caracteres." });
    }

    if (!disciplina) {
        return res.status(400).json({ erro: "Disciplina é obrigatória." });
    }

    if (!dataPrevista || isNaN(new Date(dataPrevista).getTime())) {
        return res.status(400).json({ erro: "Data prevista inválida." });
    }

    next();
}

const validarId = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id) || !id) {
        return res.status(400).json({ erro: "ID inválido." });
    }
    next();
}

export default { validarCriarPlano, validarId };

//---