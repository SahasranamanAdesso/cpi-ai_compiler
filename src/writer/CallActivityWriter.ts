import { BpmnNode } from "../ir/BpmnNode";
import { PropertyWriter } from "./PropertyWriter";

/**
 * CallActivityWriter - Generates BPMN <callActivity> XML
 *
 * In CPI, most integration steps are represented as <callActivity>:
 * - Content Modifier (activityType="Enricher")
 * - Router (activityType="Router")
 * - Groovy Script (activityType="ScriptCollection")
 * - Data Store (activityType="DataStoreWrite")
 *
 * Example output:
 *   <callActivity id="CallActivity_1" name="Set Body">
 *       <incoming>SequenceFlow_1</incoming>
 *       <outgoing>SequenceFlow_2</outgoing>
 *       <extensionElements>
 *           <ifl:property>
 *               <key>activityType</key>
 *               <value>Enricher</value>
 *           </ifl:property>
 *           <ifl:property>
 *               <key>bodyType</key>
 *               <value>constant</value>
 *           </ifl:property>
 *       </extensionElements>
 *   </callActivity>
 */
export class CallActivityWriter {

    private propertyWriter = new PropertyWriter();

    write(
        node: BpmnNode,
        incoming: string[],
        outgoing: string[]
    ): string {
        const lines: string[] = [];

        lines.push(`<callActivity id="${node.id}" name="${this.escape(node.name)}">`);

        incoming.forEach(flowId => {
            lines.push(`    <incoming>${flowId}</incoming>`);
        });

        outgoing.forEach(flowId => {
            lines.push(`    <outgoing>${flowId}</outgoing>`);
        });

        if (node.iflProperties.length > 0) {
            lines.push(`    <extensionElements>`);
            lines.push(this.propertyWriter.writeAll(node.iflProperties, "        "));
            lines.push(`    </extensionElements>`);
        }

        lines.push(`</callActivity>`);

        return lines.join('\n');
    }

    private escape(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}
