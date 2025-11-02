export const up = (pgm: any) => {
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

export const down = (pgm: any) => {
  pgm.dropTable("users");
};
