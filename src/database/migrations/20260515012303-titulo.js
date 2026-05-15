export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('titulo', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER 
    },
    titulo: { type: Sequelize.STRING },
    objetivo: { type: Sequelize.TEXT },
    ementa: { type: Sequelize.TEXT },
    dataPrevista: { type: Sequelize.DATEONLY },
    disciplina: { type: Sequelize.STRING },
    conteudos: { type: Sequelize.TEXT },
    recursosApoio: { type: Sequelize.TEXT },
    tags: { type: Sequelize.TEXT }, 
    createdAt: { allowNull: false, type: Sequelize.DATE }, 
    updatedAt: { allowNull: false, type: Sequelize.DATE },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('titulo');
}