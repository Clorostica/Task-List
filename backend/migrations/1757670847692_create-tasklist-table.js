exports.up = (pgm) => {
  pgm.createTable("task_list", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    user_id: {
      type: "text",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    status: {
      type: "text",
      notNull: true,
    },
    text: {
      type: "text",
    },
    color_class: {
      type: "text",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("task_list");
};
