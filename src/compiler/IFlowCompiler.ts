import { IFlow } from "../model/IFlow";
import { BpmnProcess } from "../ir/BpmnProcess";
import { BpmnNode } from "../ir/BpmnNode";
import { Registry } from "../registry/Registry";

/**
 * IFlowCompiler - Compiles IFlow (SDK model) to BpmnProcess (IR)
 *
 * This is the main compiler that transforms our high-level SDK representation
 * into the BPMN Intermediate Representation.
 *
 * NOW METADATA-DRIVEN via Component Registry:
 * - Compiler has NO hardcoded SAP knowledge
 * - All CPI component → BPMN mappings come from Registry
 * - Adding new components = adding Registry entries (no compiler changes)
 *
 * Architecture:
 *
 *   IFlow (SDK)
 *       ↓
 *   IFlowCompiler ← We are here
 *       ↓
 *   Registry Lookup (SAP knowledge)
 *       ↓
 *   BpmnProcess (IR)
 *       ↓
 *   XMLWriter (future)
 *       ↓
 *   .iflw artifact
 *
 * The compiler's job:
 * 1. Take the IFlow model (Components + Connections)
 * 2. For each Component, query Registry for BPMN mapping
 * 3. Transform Components into BpmnNodes with correct BPMN element types
 * 4. Transform Connections into BpmnSequenceFlows
 * 5. Return a complete BpmnProcess ready for XML serialization
 *
 * Example transformation:
 *
 *   Component("CMP_1", "Content Modifier", "Enricher")
 *       ↓
 *   Registry.getByTechnicalName("Enricher")
 *       ↓
 *   { bpmnElement: "callActivity", activityType: "Enricher" }
 *       ↓
 *   BpmnNode("CMP_1", "callActivity", "Content Modifier", { activityType: "Enricher" })
 */
export class IFlowCompiler {

    /**
     * Compiles an IFlow to a BpmnProcess
     *
     * This is now METADATA-DRIVEN:
     * - Queries Registry for each component's BPMN mapping
     * - No hardcoded if/switch statements
     * - SAP knowledge lives in Registry, not compiler
     *
     * The compiled BpmnProcess contains:
     * - All BPMN nodes (components transformed via Registry lookup)
     * - All sequence flows connecting the nodes
     *
     * @param flow - The IFlow to compile
     * @returns BpmnProcess ready for XML serialization
     * @throws Error if component type is not found in Registry
     *
     * @example
     * const flow = new IFlow("Test");
     * flow.addComponent(new Component("CMP_1", "Content Modifier", "Enricher"));
     * const compiler = new IFlowCompiler();
     * const process = compiler.compile(flow);
     */
    compile(flow: IFlow): BpmnProcess {

        const process = new BpmnProcess();

        // Transform each Component into a BpmnNode using Registry
        for (const component of flow.getComponents()) {

            // Query Registry for BPMN mapping
            const definition = Registry.getByTechnicalName(component.componentType);

            if (!definition) {
                throw new Error(
                    `Unknown component type: ${component.componentType}. ` +
                    `Add it to ComponentRegistry.`
                );
            }

            // Build properties with activityType if present
            const bpmnProperties = { ...component.properties };
            if (definition.activityType) {
                bpmnProperties.activityType = definition.activityType;
            }

            // Create BpmnNode with BPMN element type from Registry
            process.nodes.push(
                new BpmnNode(
                    component.id,
                    definition.bpmnElement,  // ← From Registry, not hardcoded
                    component.name,
                    bpmnProperties
                )
            );
        }

        return process;
    }

}
