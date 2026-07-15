import { create } from "xmlbuilder2";
import { BpmnNode } from "../ir/BpmnNode";

/**
 * CallActivityWriter - Generates BPMN <callActivity> XML
 *
 * This is the FIRST actual CPI XML our compiler generates.
 *
 * In CPI, most integration steps are represented as <bpmn2:callActivity>:
 * - Content Modifier (activityType="Enricher")
 * - Router (activityType="Router")
 * - Groovy Script (activityType="ScriptCollection")
 * - Data Store (activityType="DataStoreWrite")
 *
 * The element type is the same, only the activityType differs.
 *
 * This writer generates:
 *   <bpmn2:callActivity id="..." name="..."/>
 *
 * Example usage:
 *   const node = new BpmnNode("CallActivity_1", "Enricher", "Content Modifier");
 *   const writer = new CallActivityWriter();
 *   const xml = writer.write(node).end({ prettyPrint: true });
 *
 * Output:
 *   <?xml version="1.0"?>
 *   <bpmn2:callActivity
 *       id="CallActivity_1"
 *       name="Content Modifier"/>
 */
export class CallActivityWriter {

    /**
     * Generates BPMN callActivity XML from a BpmnNode
     *
     * @param node - The BpmnNode to convert to XML
     * @returns XML builder object (call .end() to get string)
     */
    write(node: BpmnNode) {
        return create().ele("bpmn2:callActivity", {
            id: node.id,
            name: node.name
        });
    }

}
