# WP-HUB-110 · RETRACTADO

> Este documento **ya no es un reporte**. Las afirmaciones que contenía las
> desmontó una auditoría adversarial y el veredicto fue **NO ENTRA**. Se deja
> el fichero como acta de la retractación, no como descripción del kit.

El reporte vigente es **[`REPORTE-ZV-110.md`](./REPORTE-ZV-110.md)**.

## Qué se afirmaba aquí y por qué no se sostenía

| afirmación retirada | por qué no se sostenía |
| ------------------- | ---------------------- |
| «matriz de 7 negativos con frontera propia» | el canal de fallo del provocador era el mismo que el de éxito: `failNegativo()` lanzaba `NegativoError` y el arnés aceptaba cualquier `NegativoError` con la frontera esperada como PASS. Se demostró haciendo que el pod materializara **sin lease** —rotura real de seguridad— y el test imprimió `PASS — negativo «pod sin lease»` |
| «cada negativo falla en su frontera» | cuatro guardianes de producción se desactivaron y los cuatro negativos siguieron verdes |
| «provocadores que consultan al sistema» | tres no lo consultaban: uno preguntaba por una condición inalcanzable por construcción, otro recomputaba el hash él mismo (`loadSealedPieces` no compara sha256), y el tercero compilaba ajv por su cuenta —probaba la librería, no el kit. El único provocador que usaba el verificador real estaba exportado y no se invocaba desde ningún sitio |
| «offline instrumentado, cero salidas no-loopback» | la guardia era un monkeypatch **en-proceso**, estructuralmente ciego a `npm ci` y a `generar.mjs`, que son procesos aparte; además **no bloqueaba, sólo anotaba**, y `isLoopbackHost(null)` devolvía `true` |
| «shutdown sin procesos, puertos ni locks huérfanos» | los puertos no se comprobaban en ninguna línea del test, y «sin procesos huérfanos» era infalsificable: no se lanzaba ningún proceso de SO, así que nada podía quedar huérfano |
| «rerun byte a byte determinista» | el determinismo estaba oculto dos veces —se borraban campos antes de comparar (incluido `leaseId`, que no es un campo de tiempo) *y además* se congelaba el reloj **en producción** |
| «`npm run skills:ceguera` pasa desde la raíz del hub» | para conseguirlo el test ejecutaba `npm ci` en el árbol real del hub, después de haber declarado la corrida offline |
| «leaseId/issuedAt deterministas» en `LocalPodProvider` | congelar el reloj de producción para que un test compare fácil. `main` fue en dirección contraria a propósito: reloj real, lease aleatorio, y caducidad de lease, contención ACL⊆permissions y autorización en `transition()`, que esta versión no tenía |
