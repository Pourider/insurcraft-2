# Seguridad de InsurCraft 2.0

## Reportar un problema

Si encuentras una vulnerabilidad, **no abras un issue público**. Usa "Report a vulnerability" en la pestaña **Security** de este repositorio (aviso privado de GitHub) o escribe al responsable del proyecto en Insur S.A.

Incluye qué versión usas (web, escritorio o contenedor), los pasos para reproducirlo y, si se puede, un PDF de ejemplo **sin datos reales**. Respondemos en un plazo de 5 días hábiles.

## Versiones con soporte

| Versión | Soporte |
|---|---|
| 2.0.x (este repositorio) | Sí |
| 1.x (`Pourider/insurcraft`) | Solo fallos críticos |

## Cómo está protegido

- Los PDF se procesan en el navegador o en la PC. Ningún componente los envía a un servidor.
- La web no carga nada de otros sitios y lo prohíbe con una Content-Security-Policy.
- El contenedor corre sin root, con el sistema de archivos de solo lectura, y solo acepta GET y HEAD.
- Cada cambio pasa por pruebas, revisión de licencias y avisos de seguridad de las dependencias Rust (`cargo deny`), y un escaneo del contenedor con Trivy.
- Las acciones de GitHub de terceros están fijadas por hash de commit.

El análisis completo para el área de seguridad está en `docs/SECURITY-CISO.md`.
