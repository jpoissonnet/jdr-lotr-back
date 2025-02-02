import {
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  verifyUser,
} from "../controllers/users.js";

export function usersRoutes(app, blacklistedTokens) {
  app
    .post("/login", async (request, reply) => {
      reply.send(await loginUser(request.body, app));
    })
    .post(
      "/logout",
      { preHandler: [app.authenticate] },
      async (request, reply) => {
        const token = request.headers["authorization"].split(" ")[1]; // Récupérer le token depuis l'en-tête Authorization

        // Ajouter le token à la liste noire
        blacklistedTokens.push(token);

        reply.send({ logout: true });
      },
    );
  //inscription
  app.post("/register", async (request, reply) => {
    reply.send(await registerUser(request.body, app.bcrypt));
  });
  //récupération de la liste des utilisateurs
  app.get("/users", async (request, reply) => {
    reply.send(await getUsers());
  });
  app.get("/users/me", async (request, reply) => {
    const token = request.headers["authorization"].split(" ")[1]; // Récupérer le token depuis l'en-tête Authorization
    const id = app.jwt.decode(token).id;
    const user = await getUserById(id);
    reply.send(user);
  });
  //récupération d'un utilisateur par son id
  app.get("/users/:id", async (request, reply) => {
    reply.send(await getUserById(request.params.id));
  });
  app.get("/users/verify/:id", async (request, reply) => {
    reply.send(await verifyUser(request.params.id));
  });
}
