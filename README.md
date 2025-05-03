# admin-shop

A Vue 3 application for managing products in the Teslo Shop.
Built with Vite and Vue Query.
Connects to the [Teslo Shop backend](https://github.com/Klerith/nest-teslo-shop/tree/complete-backend).

## Steps for Development

1. Clone the repository.
2. Install dependencies.
3. Create a `.env` file base on `.env.template`
4. Start the development server with `npm run dev`, `yarn dev` or `pnpm dev`
5. Clone the backend repository: https://github.com/Klerith/nest-teslo-shop/tree/complete-backend
6. Install dependencies.
7. Create `.env` file base on `.env.template`
8. Run on your terminal `docker-compose up -d`
9. Run `npm run start:dev`
10. Open Postman `GET` `http://localhost:3000/api/seed` if SEED EXECUTED
11. `GET` `http://localhost:3000/api/producs` to verify if contain data

### Login
* email: test1@gmial.com / test2@gmail.com
* password: Abc123
