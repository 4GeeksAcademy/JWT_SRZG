export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    userData: [],
    userFavorites: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "set_user_data":
      return {
        ...store,
        userData: action.payload,
      };

    case "set_user_favorites":
      return {
        ...store,
        userFavorites: action.payload,
      };

    case "add_new_favorite":
      if (
        !store.userFavorites.some(
          (fav) => fav.michi_id === action.payload.michi_id
        )
      ) {
        return {
          ...store,
          userFavorites: [...store.userFavorites, action.payload],
        };
      }
      return store;

    case "remove_user_favorite":
      return {
        ...store,
        userFavorites: store.userFavorites.filter(
          (fav) => fav.michi_id !== action.payload
        ),
      };

    default:
      throw Error("Unknown action.");
  }
}
