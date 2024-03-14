# Swagger advices (using swagger-ui-express)

</br>
</br>

## Important information

I encountered somes bugs when i deployed on Vercel (documentation not displayed), but it was working in local.
The problem is a lib incompatibility between swagger-ui-express version 5.0.0 and swagger-jsdoc version 6.2.8.

I've found a solution on github, degrading swagger-ui-express version to 4.6.3 and adding a customCss from a cdn.
For now it's a workaround because swagger-ui-express seems to be stopped.

___Think about using swagger-ui instead of swagger-ui-express.___

</br>

## Basic example

```js
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

app.use("/api-docs", swaggerUi.serve, swaggerUI.setup(
    swaggerJSDoc(swagOptions),
    {
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.12.0/swagger-ui.min.css",
    }
);
```

___swaggerOptions___ </br> Represent your API routes documentation.</br> Take a look at swaggerParam.ts in my code.
