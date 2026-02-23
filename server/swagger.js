import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API Documentation for the E-Commerce platform",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Brand: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the brand",
            },
            name: {
              type: "string",
              description: "The name of the brand",
            },
            description: {
              type: "string",
              description: "The description of the brand",
            },
            website: {
              type: "string",
              description: "The website of the brand",
            },
            businessEmail: {
              type: "string",
              description: "The business email of the brand",
            },
            businessPhone: {
              type: "string",
              description: "The business phone of the brand",
            },
            isActive: {
              type: "boolean",
              description: "Whether the brand is active",
            },
            logo: {
              type: "object",
              properties: {
                public_id: {
                  type: "string",
                },
                secure_url: {
                  type: "string",
                },
              },
            },
            coverImage: {
              type: "object",
              properties: {
                public_id: {
                  type: "string",
                },
                secure_url: {
                  type: "string",
                },
              },
            },
            primaryCategory: {
              type: "string",
              description: "ID of the primary category",
            },
            subCategories: {
              type: "array",
              items: {
                type: "string",
                description: "ID of subcategory",
              },
            },
            ratingAverage: {
              type: "number",
            },
            ratingCount: {
              type: "number",
            },
          },
        },
      },
    },
  },
  apis: ["./routers/*.js", "./models/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
