/**
 * WP-HUB-110 · guardia offline para PROCESOS HIJO.
 *
 * Se instala con `NODE_OPTIONS=--import <file-url de este módulo>`, de modo que
 * cualquier proceso Node descendiente queda instrumentado. Ahí está la
 * diferencia con la versión anterior: un monkeypatch en el proceso padre era
 * estructuralmente ciego a `generar.mjs` y a la ceremonia, que corren aparte.
 *
 * Al salir deja su parte en el DIRECTORIO que indique `HM_OFFLINE_LOG`, un
 * fichero por proceso. Directorio y no fichero a propósito: la ceremonia
 * lanza a su vez `generar.mjs`, y un único fichero compartido haría que el
 * nieto borrara el parte del hijo.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { installOfflineGuard, OFFLINE_LOG_ENV } from "./instrument.mjs";

const logDir = process.env[OFFLINE_LOG_ENV];
const guard = installOfflineGuard({ block: true });

if (logDir) {
  process.on("exit", () => {
    try {
      mkdirSync(logDir, { recursive: true });
      writeFileSync(
        join(logDir, `${process.pid}-${process.hrtime.bigint()}.json`),
        `${JSON.stringify(
          { pid: process.pid, argv: process.argv.slice(1), ...guard.snapshot() },
          null,
          2,
        )}\n`,
      );
    } catch {
      /* si no se puede escribir el parte, el padre lo verá como parte ausente */
    }
  });
}
