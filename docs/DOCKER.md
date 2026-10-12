# InsurCraft 2.0 en Docker

El contenedor sirve dos cosas, como archivos estáticos:

- `/`: InsurCraft Fácil (la web de botones grandes)
- `/completa/`: la app completa compilada a WebAssembly

Los PDF nunca llegan al contenedor: se procesan en el navegador de cada persona.

## Usar la imagen publicada

GitHub construye, prueba y escanea la imagen en cada cambio y la publica en
`ghcr.io/pourider/insurcraft-2`.

```
docker compose up -d
```

Abre http://127.0.0.1:8080 . `docker-compose.yml` ya trae el endurecimiento: sistema de archivos de solo lectura, sin capacidades de Linux, sin escalada de privilegios, y límites de memoria, CPU y procesos.

## Construirla tú

```
docker build -t insurcraft:2.0.0 .
docker run -d --name insurcraft -p 127.0.0.1:8080:8080 --read-only --tmpfs /tmp:size=16m \
  --cap-drop ALL --security-opt no-new-privileges:true insurcraft:2.0.0
```

La primera construcción compila la app completa (unos 15–25 min).

## En la red de la empresa

- Ponlo detrás del proxy inverso o balanceador de la empresa, que es quien pone **HTTPS** y **HSTS**. El contenedor escucha solo HTTP en el puerto 8080.
- Para que no esté expuesto a internet, publícalo solo en la red interna o detrás de la VPN o el SSO corporativo.
- Revisión de salud: `GET /healthz` responde `ok`.
- Los registros salen por stdout/stderr (`docker logs insurcraft`) y solo contienen las rutas pedidas, nunca documentos.

## Actualizar

Cuando haya una versión nueva: `docker compose pull && docker compose up -d`. Cada lunes GitHub vuelve a escanear la imagen y la reconstruye con los parches del sistema base.
