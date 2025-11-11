export const up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "text",
      primaryKey: true,
    },
    email: {
      type: "text",
      notNull: true,
      unique: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("users");
};

