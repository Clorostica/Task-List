export type Task = {
  id: string;
  text: string;
  status: string;
  colorClass: string | undefined;
};

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};
