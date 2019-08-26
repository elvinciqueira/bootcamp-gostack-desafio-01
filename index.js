const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequest = 0;

/**
 * Middleware checando se o projeto existe
 */
function checkProjectExist(request, response, next) {
  const { id } = request.params;

  const project = project.find(p => p.id == id);

  if (!project) {
    return response.status(400).json({ error: "Project does not exist" });
  }

  return next();
}

/**
 * middleware log do numero de requisições
 */
function logRequest(request, response, next) {
  numberOfRequest++;

  console.log(`Number of requests: ${numberOfRequest}`);

  return next();
}

server.use(logRequest);

/**
 * Listagem de projetos
 */
server.get("/projects", (request, response) => {
  return response.json(projects);
});

/**
 * Criar projeto
 */
server.post("/projects", (request, response) => {
  const { id, title } = request.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return response.json(project);
});

/**
 * Altera titulo do projeto
 */
server.put("/projects/:id", checkProjectExist, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return response.json(project);
});

server.delete("/projects/:id", checkProjectExist, (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return response.send("Project has been deleted");
});

/*
 *Criar tarefa
 */
server.post("/projects/:id/tasks", checkProjectExist, (request, response) => {
  const { title } = request.body;
  const { id } = request.params;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return response.json(project);
});

server.listen(3333);
