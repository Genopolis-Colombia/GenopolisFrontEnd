# Genopolis Frontend

Frontend en React (Vite) alineado con la maquetación HTML proporcionada para interactuar con los microservicios de Genopolis:

| Servicio   | Puerto | Rutas principales                                                    |
|------------|--------|----------------------------------------------------------------------|
| Auth       | 8081   | `/auth/register`, `/auth/login`, `/auth/validate`, `/auth/update`... |
| Users      | 8082   | `/users`, `/users/{id}`                                              |
| Proteins   | 8083   | `/proteins`, `/proteins/{id}`                                        |
| Favorites  | 8084   | `/favorites`, `/favorites/{id}`, `/favorites/user/{id}`              |
| Integration| 8085   | `/integration/analysis`, `/integration/analysis/{id}`                |

## Requisitos

- Node.js 18 o superior
- Microservicios en ejecución (habilitar CORS para `http://localhost:5173`)

## Instalación

```bash
git clone https://tu-repo/genopolis-frontend.git
cd genopolis-frontend
npm install