# message
✉️ Data structure for message passing between components with a focus on correlation metadata—this package is low-level in our ecosystem and is used by other packages.

- I define `Message` which can happen in the system through function.
- I get a "Template/Class" of a `Message` that can happen in the system, which have minimalized DTO comparing to `Message` constructor.

```ts

const CreateUser = defMessage("CreateUser", {
    type: MessageType.Command,
    schema: {
        firstName: "string",
        lastname: "string",
    }
})

const createUser = new CreateUser(
    // Completly type-safe provision of data defined in schema.
    {
    firstName: string,
    lastName: string,
}, 
    // Optionally provide headers
    {}, 
    // Optionally provide metadata
    // Such as id,dateCreated and so on.
)
```