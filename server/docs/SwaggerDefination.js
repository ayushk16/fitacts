export const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'Fit Acts Documentation',
        license: {
            name: 'Aphache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    servers: [
        {
            url: `http://localhost:3000/`,
            description: "Local server"
        },
    ],
};
