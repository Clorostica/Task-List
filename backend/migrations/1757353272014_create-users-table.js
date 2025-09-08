exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    email: {
      type: 'text',
      notNull: true,
      unique: true
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
