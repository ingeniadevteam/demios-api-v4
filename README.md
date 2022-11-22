# 🚀 Demios API

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
yarn install
yarn develop
```

### Roles

```
Authenticated
Public
Employee
Manager
Supplier
``` 

Since Strapi version 4.2.2 the route api/users/me no longer returns the role field, but accepts populating.
So now to get the user’s role you need to populate the role field, thus the call will be api/users/me?populate=role.
Note that you also need to give the role permissions to find role too. [Source](https://forum.strapi.io/t/is-it-possible-to-know-user-role-on-authentication/14221/5)

### Controller customization

```
yarn strapi generate
```


## ⚙️ Deployment

