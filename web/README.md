# InsurCraft Fácil (web)

La versión web de InsurCraft 2.0: botones grandes, íconos y pocas palabras.

**Herramientas:** Unir, Separar, Ordenar (mover, girar, borrar hojas), Firmar (dibujar, escribir o foto), Poner clave (o quitarla) y Achicar (Normal o Fuerte).
Las de la fila "Más" abren InsurCraft completo en otra pestaña.

**Privacidad:** todo se procesa en el navegador. Los PDF no se suben a ningún servidor, no hay cuentas ni estadísticas, y las fuentes y librerías vienen dentro de esta carpeta (no se carga nada de otros sitios).

## Probarla en tu PC

Es una página estática. Desde esta carpeta:

```
python -m http.server 8800
```

y abre http://127.0.0.1:8800 . (Abrir `index.html` con doble clic no funciona, porque el navegador bloquea los módulos de JavaScript en `file://`.)

## Archivos

- `index.html`, `app.css`, `app.js`: la app.
- `vendor/`: pdf-lib (fork @cantoo/pdf-lib 2.11.1, MIT, incluye cifrado AES-256), pdf.js 4.10.38 legacy (Apache-2.0, para miniaturas y para Achicar Fuerte) y fflate 0.8.2 (MIT, para el .zip de Separar). Licencias en `vendor/licenses/`.
- `fonts/`: Bricolage Grotesque, Figtree y Caveat (SIL Open Font License).

El diseño de referencia está en `../docs/design-2.0/`.
