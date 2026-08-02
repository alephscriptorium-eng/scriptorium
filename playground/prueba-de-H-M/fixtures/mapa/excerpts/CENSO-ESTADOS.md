# CENSO-ESTADOS — estados jugables de barrio

Tabla canónica barrio-id → `estado` (`vivo` | `latente` | `muerto` | `roto`).
24 barrios. Fuente versionada de la cantera del sprint para generadores de seeds
(startpack) y censo de mockdatas.

> Procedencia: import round-trip desde seeds operativos del startpack-ciudad
> (atributo ya presente post-Z02). No reinventar el censo; anclar trazabilidad.

| id | slug | displayName | distrito | estado |
|----|------|-------------|----------|--------|
| vscode-extension | vscode-extension | VsCodeExtension | zigurat | vivo |
| blockly-editor | blockly-editor | BlocklyEditor | editores | latente |
| wiring-editor | wiring-editor | WiringEditor | editores | vivo |
| prolog-editor | prolog-editor | PrologEditor | editores | latente |
| typed-prompts-editor | typed-prompts-editor | TypedPromptsEditor | editores | latente |
| workflow-editor | workflow-editor | WorkflowEditor | editores | muerto |
| wiring-app-hypergraph-editor | wiring-app-hypergraph-editor | WiringAppHypergraphEditor | editores | latente |
| blockchain-com-port | blockchain-com-port | BlockchainComPort | red-stream | vivo |
| stream-desktop | stream-desktop | StreamDesktop | red-stream | muerto |
| stream-desktop-app-cronos | stream-desktop-app-cronos | StreamDesktopAppCronos | red-stream | muerto |
| bot-hub-sdk | bot-hub-sdk | BotHubSDK | red-stream | vivo |
| aaia-gallery | aaia-gallery | AAIAGallery | runtime-mcp | latente |
| mcp-gallery | mcp-gallery | MCPGallery | runtime-mcp | vivo |
| state-machine | state-machine | StateMachine | runtime-mcp | latente |
| novelist-editor | novelist-editor | NovelistEditor | runtime-mcp | vivo |
| copilot-engine | copilot-engine | CopilotEngine | runtime-mcp | vivo |
| document-machine-sdk | document-machine-sdk | DocumentMachineSDK | lore-voz | vivo |
| onfalo-asesor-sdk | onfalo-asesor-sdk | onfalo-asesor-sdk | lore-voz | vivo |
| agent-lore-sdk | agent-lore-sdk | AgentLoreSDK | lore-voz | vivo |
| vector-machine-sdk | vector-machine-sdk | VectorMachineSDK | lore-voz | vivo |
| vector-machine-ui | vector-machine-ui | VectorMachineUI | lore-voz | vivo |
| scriptorium-vps | scriptorium-vps | ScriptoriumVps | infra-ui | vivo |
| ui-sdk-threejs | ui-sdk-threejs | UISDKThreejs | infra-ui | vivo |
| vibe-coding-suite | vibe-coding-suite | VibeCodingSuite | infra-ui | latente |

## Enum

| estado | significado jugable |
|--------|---------------------|
| vivo | barrio activo / emite |
| latente | dormido / baja cadencia |
| muerto | apagado / sin emisión |
| roto | descartado / corpus discarded |

## Consumo

- Generadores build-time leen esta tabla (o su proyección JSON en el pack destino).
- Runtime del juego **no** abre la cantera; consume seeds/volumes ya proyectados.
