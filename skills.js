const SKILLS_DATA = {
  "filters": [
    { "id": "all", "label": "All" },
    { "id": "ai", "label": "AI & ML" },
    { "id": "backend", "label": "Backend" },
    { "id": "frontend", "label": "Frontend" },
    { "id": "devops", "label": "Cloud & DevOps" },
    { "id": "langdb", "label": "Languages & DBs" }
  ],
  "skills": [
    {
      "category": "ai",
      "title": "OpenAI API & GPT Integrations",
      "name": "OpenAI API",
      "icon": "https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/openai.svg",
      "invertInDark": true
    },
    {
      "category": "ai",
      "title": "LangChain Framework",
      "name": "LangChain",
      "icon": "https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/langchain.svg",
      "invertInDark": true
    },
    {
      "category": "ai",
      "title": "Vector Database Retrieval Augmented Generation",
      "name": "pgvector RAG",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
    },
    {
      "category": "ai",
      "title": "TensorFlow Deep Learning",
      "name": "TensorFlow",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg"
    },
    {
      "category": "ai",
      "title": "AWS SageMaker Model Hosting",
      "name": "SageMaker",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
    },
    {
      "category": "backend",
      "title": "Node.js Javascript Runtime",
      "name": "Node.js",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg"
    },
    {
      "category": "backend",
      "title": "Express.js Minimal Framework",
      "name": "Express.js",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
      "invertInDark": true
    },
    {
      "category": "backend",
      "title": "Spring Boot (Java)",
      "name": "Spring Boot",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg"
    },
    {
      "category": "backend",
      "title": "FastAPI (Python)",
      "name": "FastAPI",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg"
    },
    {
      "category": "backend",
      "title": "Redis Cache & In-Memory Store",
      "name": "Redis",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg"
    },
    {
      "category": "frontend",
      "title": "React.js UI Library",
      "name": "React.js",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
    },
    {
      "category": "frontend",
      "title": "Next.js SSR Framework",
      "name": "Next.js",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
    },
    {
      "category": "frontend",
      "title": "Tailwind CSS Utility-first Styling",
      "name": "Tailwind CSS",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
    },
    {
      "category": "frontend",
      "title": "Redux State Management",
      "name": "Redux",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg"
    },
    {
      "category": "frontend",
      "title": "Web Accessibility Guidelines",
      "name": "WCAG 2.1",
      "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#005A9C\"/><path d=\"M12 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3 4.5V9c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v1.5c0 .55-.45 1-1 1H10c-.55 0-1-.45-1-1zm1 9v-5.5h4V20\" stroke=\"#ffffff\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>"
    },
    {
      "category": "devops",
      "title": "Amazon Web Services",
      "name": "AWS Cloud",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
    },
    {
      "category": "devops",
      "title": "Docker Containerization",
      "name": "Docker",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg"
    },
    {
      "category": "devops",
      "title": "Kubernetes Container Orchestration",
      "name": "Kubernetes",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg"
    },
    {
      "category": "devops",
      "title": "GitHub Actions CI/CD Pipelines",
      "name": "CI/CD Actions",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg"
    },
    {
      "category": "langdb",
      "title": "PostgreSQL Database",
      "name": "PostgreSQL",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
    },
    {
      "category": "langdb",
      "title": "MongoDB Database",
      "name": "MongoDB",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg"
    },
    {
      "category": "langdb",
      "title": "TypeScript Language",
      "name": "TypeScript",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"
    },
    {
      "category": "langdb",
      "title": "Python Language",
      "name": "Python",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
    },
    {
      "category": "langdb",
      "title": "Java Language",
      "name": "Java",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg"
    }
  ]
};
