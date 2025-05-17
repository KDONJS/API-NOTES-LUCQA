# comando para iniciar o projeto

```bash
    # Construir la imagen
    docker build -t mongo-local .

    # Ejecutar el contenedor
    docker run -d --name mongo-local -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin123 mongo-local
```