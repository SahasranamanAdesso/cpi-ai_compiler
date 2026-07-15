/**
 * ComponentRegistry - SAP CPI Component Metadata
 *
 * This is the SINGLE SOURCE OF TRUTH for how CPI components map to BPMN.
 *
 * Why this exists:
 * - Separates SAP-specific knowledge from compiler logic
 * - Metadata-driven: adding new components = adding entries here
 * - No hardcoded if/switch statements in the compiler
 *
 * Structure:
 * - Key: SAP technical name (matches .iflw exports)
 * - displayName: Friendly name for developers
 * - bpmnElement: The BPMN element type to generate
 * - activityType: SAP-specific activity type (for callActivity)
 *
 * Example:
 *   ComponentRegistry.Enricher
 *   → {
 *       displayName: "Content Modifier",
 *       bpmnElement: "callActivity",
 *       activityType: "Enricher"
 *     }
 *
 * This drives the compiler transformation:
 *   Component("Content Modifier")
 *       ↓
 *   Registry lookup
 *       ↓
 *   callActivity with activityType="Enricher"
 */

/**
 * ComponentDefinition - Metadata for a single CPI component
 */
export interface ComponentDefinition {
    /**
     * Friendly name shown to developers
     * Example: "Content Modifier", "HTTPS Adapter"
     */
    displayName: string;

    /**
     * BPMN element type to generate
     * Example: "callActivity", "participant", "exclusiveGateway"
     */
    bpmnElement: string;

    /**
     * SAP-specific activity type (for callActivity elements)
     * Example: "Enricher", "Router", "ScriptCollection"
     */
    activityType?: string;
}

/**
 * ComponentRegistry - Map of all supported CPI components
 *
 * Key: SAP technical name (stable identifier used in .iflw)
 * Value: ComponentDefinition with BPMN mapping metadata
 */
export const ComponentRegistry: Record<string, ComponentDefinition> = {

    /**
     * Content Modifier
     * BPMN: <callActivity activityType="Enricher">
     */
    Enricher: {
        displayName: "Content Modifier",
        bpmnElement: "callActivity",
        activityType: "Enricher"
    },

    /**
     * HTTPS Adapter (Sender/Receiver)
     * BPMN: <participant>
     */
    HTTPS: {
        displayName: "HTTPS Adapter",
        bpmnElement: "participant"
    },

    /**
     * Router
     * BPMN: <callActivity activityType="Router">
     */
    Router: {
        displayName: "Router",
        bpmnElement: "callActivity",
        activityType: "Router"
    },

    /**
     * Groovy Script
     * BPMN: <callActivity activityType="ScriptCollection">
     */
    ScriptCollection: {
        displayName: "Groovy Script",
        bpmnElement: "callActivity",
        activityType: "ScriptCollection"
    },

    /**
     * Data Store Write
     * BPMN: <callActivity activityType="DBStorage">
     */
    DBStorage: {
        displayName: "Data Store",
        bpmnElement: "callActivity",
        activityType: "DBStorage"
    }

};
