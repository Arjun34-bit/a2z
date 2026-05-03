# A2Z Architecture: The Modular Monolith

The backend of A2Z is built using a **Modular Monolith** architecture. This approach combines the deployment simplicity of a traditional monolith with the strict boundaries and code organization typically found in microservices.

## What is a Modular Monolith?

In a standard monolith, code is often grouped by technical layer (e.g., all controllers in one folder, all models in another). This can lead to a "Big Ball of Mud" where domain logic is deeply entangled, making it hard to change one feature without breaking another.

In our **Modular Monolith**, code is grouped by **Business Domain** (e.g., Auth, Admin, Artist, Upload, Shared). Each module encapsulates its own routes, controllers, services, repositories, and validation schemas. Modules communicate with each other through well-defined public interfaces or shared utilities, but their internal implementations remain hidden.

### Project Structure Example

```
src/
└── modules/
    ├── admin/            # Admin operations (Categories, Banners, Approvals)
    │   ├── application/  # Business logic (Services)
    │   ├── infrastructure/# Database interactions (Repositories)
    │   └── presentation/ # Routes, Controllers, Validation
    ├── artist/           # Artist profiles and onboarding
    ├── auth/             # Authentication and Identity
    ├── upload/           # Cloudinary image upload infrastructure
    └── shared/           # Cross-cutting concerns (Middlewares, Error handling)
```

---

## Pros of a Modular Monolith

1. **Simple Deployment**: Unlike microservices, which require complex orchestration (Kubernetes, Docker Swarm, Service Meshes) and multiple CI/CD pipelines, a modular monolith compiles into a single Node.js process. You only deploy one application.
2. **Easier Debugging and Refactoring**: Because all code lives in one repository and runs in one process, you can easily trace requests, step through code with a debugger, and perform global refactoring using your IDE's built-in tools.
3. **High Performance**: Communication between modules (e.g., the Admin module calling the Upload module) happens via simple function calls in memory. There is no network latency, serialization, or deserialization overhead compared to microservices communicating via HTTP/gRPC.
4. **Data Consistency**: A single PostgreSQL database is used, allowing you to use ACID transactions across different domains (e.g., creating a banner and targeting rules simultaneously) without dealing with complex distributed transactions (like the Saga pattern).
5. **Future-Proof**: Because the code boundaries are strict, if a specific module (like `upload` or `artist`) ever experiences massive traffic that warrants independent scaling, it can be easily extracted into a standalone microservice later.

## Cons of a Modular Monolith

1. **Single Point of Failure**: If one module contains a critical memory leak or an uncaught exception (though our global error handler mitigates this), the entire Node.js server crashes, taking down all other modules with it.
2. **Coupled Scaling**: You cannot scale just the `upload` module. If image uploads are bottlenecking the CPU, you must scale the entire application, which might consume more server resources than necessary.
3. **Discipline Required**: Without the physical network boundaries of microservices, developers might be tempted to bypass interfaces and directly access another module's database tables or internal services, leading to "spaghetti code" over time. Strict code reviews and linting rules are necessary to enforce boundaries.
4. **Build Times**: As the application grows massive, TypeScript compilation and startup times will increase compared to working on a small, isolated microservice.

---

## Summary

For the current stage of A2Z, the Modular Monolith is the **perfect architectural choice**. It provides the clean architecture and maintainability of microservices while avoiding the overwhelming infrastructure overhead, allowing for rapid feature development and easy deployment.
