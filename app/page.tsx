"use client";

import { useEffect, useState } from "react";

export default function Home() {
  interface Post {
    id: number;
    title: string;
    body: string;
  }

  interface Comment {
    id: number;
    name: string;
    email: string;
    body: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postLimit, setPostLimit] = useState(5);
  const [showComments, setShowComments] = useState<number | null>(null); // Track which post's comments to show
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards"); // Default to 'cards' view mode

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${postLimit}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Erro ao buscar dados:", error));
  }, [postLimit]);

  useEffect(() => {
    if (showComments !== null) {
      fetch(
        `https://jsonplaceholder.typicode.com/posts/${showComments}/comments`
      )
        .then((response) => response.json())
        .then((data) => setComments(data))
        .catch((error) => console.error("Erro ao buscar comentários:", error));
    }
  }, [showComments]);

  const handlePostLimitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPostLimit(Number(event.target.value));
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">Lista de Posts</h1>

      {/* Controle de seleção de quantidade de posts */}
      <div className="flex justify-center mb-6">
        <label className="text-lg mr-4">Quantidade de posts:</label>
        <input
          type="number"
          value={postLimit}
          onChange={handlePostLimitChange}
          min="1"
          max="100"
          className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
        />
      </div>

      {/* Controle de exibição */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Mudar para {viewMode === "cards" ? "Lista" : "Cartões"}
        </button>
      </div>

      {posts.length > 0 ? (
        <ul
          className={`flex ${
            viewMode === "cards"
              ? "flex-wrap justify-center gap-4"
              : "flex-col items-center"
          } space-y-4 w-full`}
        >
          {posts.map((post) => (
            <li
              key={post.id}
              className={`p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all bg-slate-300 hover:scale-105 duration-300 ${
                viewMode === "cards" ? "w-5/6 md:w-1/3" : "w-5/6 md:w-1/2"
              } text-center`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">{post.body}</p>
              <button
                onClick={() =>
                  setShowComments(showComments === post.id ? null : post.id)
                }
                className="text-blue-500 underline mb-4"
              >
                {showComments === post.id
                  ? "Fechar Comentários"
                  : "Ver Comentários"}
              </button>

              {showComments === post.id && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-bold text-lg">Comentários:</h3>
                  {comments.length > 0 ? (
                    <ul className="space-y-4">
                      {comments.map((comment) => (
                        <li key={comment.id} className="border-b py-2">
                          <p className="font-semibold">{comment.name}</p>
                          <p className="text-sm text-gray-600">
                            {comment.email}
                          </p>
                          <p className="text-gray-800">{comment.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Carregando comentários...</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">Carregando...</p>
      )}
    </div>
  );
}
