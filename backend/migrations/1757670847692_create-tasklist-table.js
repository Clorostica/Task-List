exports.up = (pgm) => {
  pgm.createTable('task_list', {
    id: {
        type: 'serial',
        primaryKey: true
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    status: {
        type: 'text',
        notNull: true,
    },
    text: {
        type: 'text'
    }
  });
};

exports.down = (pgm) => {
    pgm.dropTable('task_list');
};
