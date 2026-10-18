export type Todo = {
  id: string;
  text: string;
  done: boolean;
};
let todos: Todo[] = [{ id: "1", text: "ma premiere tache", done: false }];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function fetchTodos(): Promise<Todo[]> {
  await delay(400);
  return todos.map((todo) => ({ ...todo }));
}
export async function addTodo(message: string): Promise<Todo> {
  await delay(400);
  const newTodo: Todo = { id: crypto.randomUUID(), text: message, done: false };
  todos.push(newTodo);
  return newTodo;
}
export async function toggleTodo(id: string): Promise<void> {
  await delay(100);
  const found = todos.find((todo) => todo.id === id);
  if (!found) throw new Error("tache introuvable");
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo,
  );
}
export async function deleteTodo(id: string): Promise<void> {
  await delay(100);
  const found = todos.find((todo) => todo.id === id);
  if (!found) throw new Error("tache introuvable");
  todos = todos.filter((todo) => todo.id !== id);
}
