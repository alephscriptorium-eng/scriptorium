# GOBIERNO DE EJECUCIÓN · swarm LORE-HM

| dato | valor |
| ---- | ----- |
| Creado | 2026-08-02 por el **Anfitrión del swarm Z·V**, por orden del product owner |
| Razón | separar dos frentes que compiten por atención pero **no por ficheros** |
| Swarm | **independiente**: su propio orquestador, sus propios workers, su propia estación de vigilancia |
| Backlog | hub `plan/BACKLOG-F2.md` lane **LORE-HM** (`WP-HUB-100`–`113`) · `s-sdk` `plan/BACKLOG-F2.md` lane **LENGUA** (`WP-SDK-L01`–`L05`) |
| Gate propio | **`GHM`** = `112` + `113` + `100`…`107` aceptados |
| Método | skill `swarm-orquestacion` (1 WP = 1 worker = 1 rama `wp/*` = 1 worktree) + skill `vigilancia` (estación) |

---

## §1 · La tensión que este documento resuelve

El product owner quiere la prueba en el playground **ya**, y quiere saber si la
lengua sirve para operar procesos reales. El scrum root sostiene que veníamos
quemando backlog y que esto es la guinda.

**Los dos tienen razón sobre cosas distintas.** El scrum root tiene razón sobre
el **coste**: hay 109 encargos sin empezar y la publicación del motor no ha
salido verde ni una vez. El product owner tiene razón sobre el **riesgo**: hay
fichas río abajo que dan por hecho que H y M pueden operar la Future Machine, y
**eso no lo ha medido nadie**. Una hipótesis no verificada no es la guinda: es
cimiento sin firmar.

**Resolución**: no se reparten turnos, se reparten mundos. Dos swarms, dos
raíces, cero ficheros compartidos. El coste que sí es real y queda declarado en
§5 no es de ficheros: es de **atención humana** y de **una dependencia técnica**.

---

## §2 · Raíces y frontera (vinculante)

| rol | raíz | quién escribe |
| --- | ---- | ------------- |
| **WORLD_ROOT primario** | `C:\S\scriptorium` | swarm LORE-HM |
| **WORLD_ROOT secundario** | `C:\S_LAB\s-sdk` | swarm LORE-HM |
| read-only duro | `C:\S_LAB\z-sdk` · `C:\S_LAB\v-sdk` · `C:\S_LAB\g-sdk` · `C:\S_LAB\o-sdk` · `C:\S_LAB\skills-library` | swarm Z·V |
| read-only duro | `C:\S_LAB\a-sdk` · `C:\S_LAB\e-sdk` · `C:\Users\aleph\OASIS\**` | **nadie** — cantera |

### Partición de ficheros calientes entre los dos swarms

Es la única zona de roce real y se corta aquí, no en la práctica:

| zona | dueño | el otro swarm |
| ---- | ----- | ------------- |
| `C:\S\scriptorium\playground\**` | **LORE-HM** | ni lectura mutable ni escritura |
| `C:\S\scriptorium\plan\BACKLOG-F2.md` | **LORE-HM** (lane entera) | RO |
| `C:\S\scriptorium\plan\GOBIERNO-LORE-HM.md` | **LORE-HM** | RO |
| `C:\S\scriptorium\sincronia\**` | **swarm Z·V** (la sala) | **RO** — lee el handoff, no lo edita |
| `C:\S_LAB\s-sdk\**` | **LORE-HM**, entero | RO |
| `C:\S_LAB\z-sdk\**` · `v-sdk\**` | **swarm Z·V** | RO |

`playground/prueba-de-dos` **no se toca**: es el antecedente, y sus siete marcas
(1 de 7 estampada, la de Z) no se editan desde esta lane.

---

## §3 · Calibración de la estación de vigilancia

Detector canónico:
`C:/S_LAB/skills-library/skills/vigilancia/scripts/verificar-identidad-raiz.mjs`
(RO desde aquí: es obra de L). Referencia:
`skills/vigilancia/reference/ESTACION.md`.

**Para el mundo hub**:

```
WORLD_ROOT           = C:/S/scriptorium
CANONICAL_WORLD_ROOT = C:/S/scriptorium
READ_ONLY_ROOTS      = ["C:/S_LAB/z-sdk","C:/S_LAB/v-sdk","C:/S_LAB/g-sdk",
                        "C:/S_LAB/o-sdk","C:/S_LAB/skills-library",
                        "C:/S_LAB/a-sdk","C:/S_LAB/e-sdk"]
DOWNSTREAM_PATTERNS  = []
OUT_DIR              = <fuera del WORLD_ROOT>
```

**Para el mundo S**: idéntico cambiando las dos primeras a `C:/S_LAB/s-sdk` y
añadiendo `C:/S/scriptorium` a las read-only.

**Al despachar un WP**, `WORLD_ROOT` y `CANONICAL_WORLD_ROOT` valen **el
worktree**, no la raíz — con rutas en `/` y `DOWNSTREAM_PATTERNS` que **no
cubra el propio worktree**, o el preflight da `LOCK`. La convención viva es
`C:\S_LAB\wt\<mundo>-<wp>`; **cualquier calibración con
`C:/S_LAB/.worktrees/…` que aparezca en el material del intake está caducada.**

---

## §4 · Protocolo, heredado con sus cicatrices

Estas reglas costaron ocho olas de aprender. Se entregan hechas:

1. **La contrarrevisión adversarial es el corazón, no un extra.** El revisor
   **reintenta vectores de ataque**; no re-ejecuta la suite del worker —
   *«los tests verifican lo implementado, no lo prometido»*. De ~40
   contrarrevisiones en este programa, **2 pasaron a la primera**. Presupuestar
   **2-4 vueltas** para gates, fronteras de confianza y piezas de datos.
2. **El defecto no suele estar en la obra, está en la frase que la describe.**
   Los bloqueantes fueron alcance declarado más ancho que la evidencia, casi
   nunca errores de lógica.
3. **Push de la rama y esperar CI ANTES de mergear.** Los workers nunca
   empujan. Y regla propia: **gate tras cada merge Y CI tras cada push**.
4. ⚠ **Aquí eso todavía no se puede cumplir**: hub y `s-sdk` tienen **un solo
   flujo, `docs.yml`** — ninguna prueba, ningún gate. Por eso `WP-HUB-113` es
   P0 y va en la primera ola. **Hasta que exista, todo verde es local y hay que
   decirlo así en cada aceptación.**
5. **`git stash` prohibido** con varios worktrees: la pila es del repositorio.
   **`npx <binario>` no declarado, prohibido.** Correr suites puede ensuciar
   rastreados: comprobar `git status` antes de acusar.
6. **Nada se despacha sin GO.** Las 19 fichas nacen sin worker.

---

## §5 · Lo que sí comparten los dos swarms (declarado, no escondido)

1. **Atención humana.** Un product owner y un scrum root para dos frentes. Es
   el coste real de la separación y no lo elimina ningún reparto de ficheros.
2. **Una dependencia técnica de verdad**: `WP-HUB-100` y `105` exigen que las
   líneas **reusen los schemas publicados de `@zeus/linea-kit`**. Los tipos
   públicos de ese paquete son `U245` en el backlog de Z — **cola del swarm
   Z·V**. Mientras no aterricen, la lane consume el paquete **sin tipos** y
   debe declararlo, no fingirlo.
3. **La skill de vigilancia y la de orquestación son obra de L** (`skills-library`),
   read-only para los dos. Una mejora se propone, no se parchea en sitio.
4. **Auditoría cruzada**: el swarm Z·V audita ocasionalmente a éste, por
   petición del product owner. La auditoría es **read-only y adversarial**:
   reintenta vectores contra lo aceptado, no relee reportes.

---

## §6 · Olas propuestas

| ola | fichas | por qué en este orden |
| --- | ------ | --------------------- |
| **0** | `WP-HUB-112` (spike) · `WP-HUB-113` (CI) | la primera contesta si la lane tiene sentido; la segunda hace que su respuesta sea verificable por alguien que no sea el autor. **`112` puede reordenar o tumbar fichas de las olas siguientes: es su trabajo.** |
| **1** | `100` · `101` · `WP-SDK-L01` | escenario, ontología y dossier: el cimiento del que cuelga todo, y las tres piden contrarrevisión larga |
| **2** | `102` · `103` · `WP-SDK-L02` | generador, pods y la inception de las cinco primitivas |
| **3** | `104` · `105` · `WP-SDK-L03` | material real importado, cadena determinista y capa SOLID |
| **4** | `106` · `107` · `WP-SDK-L04` | ceremonia bilateral, verificador externo y registro de vocabulario → **cierra `GHM`** |
| **5** | `108` · `109` | el mapa 7 holones × ciudad y el despertar de `lore-voz` |
| **6** | `110` · `111` · `WP-SDK-L05` | negativos, consumidor limpio, escenarios descubribles y sellado del 04 |

**Techos sugeridos**: hub **3** workers por ola · S **2**. Son sugerencia del
Anfitrión saliente, no medida: este swarm no tiene historial propio todavía y
**su primera ola debería ser conservadora**.

---

— **Anfitrión del swarm Z·V**, entregando. La rama es sólida; el veredicto de
`WP-HUB-112` puede cambiarla entera, y eso es exactamente lo que se le pide.

---

## §7 · ✎ RELEVO DE CARRIL (2026-08-02) — el swarm Z·V toma las correcciones

**Orden del product owner: «hazlo tú».** Tras dos vueltas de auditoría
adversarial (20 bloqueantes, **2 cerrados**), el swarm Z·V asume la corrección.

**Esto NO revoca §2.** La partición sigue: `sincronia/` es del swarm Z·V y el
resto era del swarm LORE-HM. Lo que cambia es **quién empuña las correcciones**,
y por eso hay que decirlo aquí y no de palabra: la regla 19 del método
—*claim de carril antes de emular; doble conductor = anomalía registrable*—
existe porque este programa ya pagó ese error.

**Cómo se ejecuta el relevo, para que no haya colisión:**

1. **No se escribe sobre las ramas del swarm LORE-HM.** Sus doce worktrees
   siguen registrados y su último commit es de hace minutos. Trabajar sobre
   `wp/lore-hm-accum` o `wp/sdk-l0*` sería el doble conductor exacto.
2. El swarm Z·V abre **ramas propias desde sus tips**, con prefijo `wp/zv-`,
   de modo que la autoría y el punto de partida quedan a la vista.
3. **Tips de partida, anclados**: hub `wp/lore-hm-accum` = `8c38119` ·
   `s-sdk` `wp/sdk-l05-sellado-de-network-engine` = `d6be525`.
4. **Al swarm LORE-HM le corresponde parar de escribir** en esas ramas
   mientras dure el relevo. Si aparece un commit suyo posterior a estos tips,
   es anomalía y se registra antes de seguir.

**Qué se corrige y en qué orden** — el orden no es de gusto: `N1` va primero
porque **mientras esté, el CI rechaza su propia corrección**.

| # | frente | por qué |
| - | ------ | ------- |
| **1** | el trinquete invertido (`N1`) y la demo plana | un paso bloqueante **exige una autodeclaración falsa**; corregirla a la verdad pone rojo el CI |
| 2 | el sello DIC-4 | no hay **ni un sha256 almacenado**: no hay nada contra lo que comparar |
| 3 | el verificador | cobertura, sello del pack y completitud siguen saliendo del propio artefacto |
| 4 | el sellado holónico | **14 de 20 mutaciones pasan en verde**; el grep-gate escanea **1 fichero de 780** |
| 5 | la política del pod y la cadena causal | `authorize()` **no se invoca en el camino de ejecución** |
| 6 | lo barato y transversal | la lengua **no compila** (2 líneas) y el flujo **no ejecuta typecheck** |

**El movimiento es uno solo, tres veces**, y el propio swarm LORE-HM ya lo
demostró dos veces bien (`REQUIRED_SHUTDOWN_VERBS` y el resolutor del
vocabulario): **no te fíes de lo que el artefacto dice de sí mismo; recomputa.**
Lo que falta no es capacidad — es que aún no es reflejo.

— **Anfitrión del swarm Z·V**, tomando el carril.
