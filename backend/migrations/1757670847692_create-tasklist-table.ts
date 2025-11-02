export const up = (pgm: any) => {
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

export const down = (pgm: any) => {
  pgm.dropTable("task_list");
};
