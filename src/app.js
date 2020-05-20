const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID' });
  }

  return next();
} 

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  
  const repository = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
  
});

app.put("/repositories/:id", validateRepositoryId,(request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }
  
  const { likes } = repositories[repositoryIndex];
  
  const repository = {
    id,
    url,
    title,
    techs,
    likes,
  };
  
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0)  {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const { url, title, techs, likes } = repositories[repositoryIndex];
  
  const newNumberLikes = likes + 1;

  const repository = {
    id,
    url,
    title,
    techs,
    likes: newNumberLikes,
  };
  
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
