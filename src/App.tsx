import { fetchTodos, addTodo, type Todo, toggleTodo, deleteTodo } from "./api";
import { startTransition, use, useActionState } from "react";
import { Suspense } from "react";

const todosPromise = fetchTodos();
type Action = { type: "TOGGLE"; id: string } | { type: "DELETE"; id: string };
async function reducer(
  previous: Todo[],
  payload: FormData | Action,
): Promise<Todo[]> {
  if (payload instanceof FormData) {
    const text = String(payload.get("text") ?? "").trim();
    if (!text) return previous;
    await addTodo(text);
  } else {
    switch (payload.type) {
      case "TOGGLE":
        await toggleTodo(payload.id);
        break;
      case "DELETE":
        await deleteTodo(payload.id);
        break;
    }
  }
  return await fetchTodos();
}
function TodoApp({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, dispatchAction, isPending] = useActionState(
    reducer,
    initialTodos,
  );

  return (
    <>
      <form action={dispatchAction}>
        <input placeholder="ajouter une tache " name="text"></input>
        <button disabled={isPending} type="submit">
          ajouter
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button
              onClick={() =>
                startTransition(() =>
                  dispatchAction({ type: "DELETE", id: todo.id }),
                )
              }
            >
              supp
            </button>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() =>
                startTransition(() =>
                  dispatchAction({ type: "TOGGLE", id: todo.id }),
                )
              }
            />
          </li>
        ))}
      </ul>
    </>
  );
}
function TodoList() {
  const todos = use(todosPromise);

  return <TodoApp initialTodos={todos} />;
}

function App() {
  return (
    <main className="container">
      <h1>To_do React + tauri</h1>
      <Suspense fallback={<p>chargement ....</p>}>
        <TodoList />
      </Suspense>
    </main>
  );
}

export default App;
