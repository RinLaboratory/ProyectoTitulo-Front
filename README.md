# ProyectoTitulo
Mi proyecto de titulo para optar a titulo de Ingeniero Civil en Informática.

## Getting dependencies installed

You will require the next dependencies to run this project:

- Node Js v18.15.x
- Yarn v1.22.19

for installing the rest of dependencies located in the `package.json` file, you will use the following command:

```bash
yarn
```

## Getting the development server running

To run the development server, you will use the following command:

```bash
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the development server.

## Getting the production server running

To compile the development server, you will use the following command:

```bash
yarn build
```

Once finished compiling, you will use the following command to run the production server:

```bash
yarn start
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the production server.
Keep in mind that everytime you update a file here, you must re-compile the production server to apply changes.

## .env.example

- `JWT_SECRET` is the JWT seed that is used to generate the user token. Must be the same as the Backend.
- `URL` is the URL this app is going to be located.
- `BACKEND_URL` is the URL where the Backend is located.
- `DOMAIN` is the domain's page where is going to be.

## Learn More

This project uses:

- [Next Js](https://nextjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [SWR](https://swr.vercel.app/)
