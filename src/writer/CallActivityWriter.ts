import { BpmnNode } from "../ir/BpmnNode";
import { PropertyWriter } from "./PropertyWriter";

/**
 * CallActivityWriter - Generates BPMN <bpmn2:callActivity> XML
 */
export class CallActivityWriter {

    private propertyWriter = new PropertyWriter();

    write(
        node: BpmnNode,
        incoming: string[],
        outgoing: string[]
    ): string {
        const lines: string[] = [];

        lines.push(`<bpmn2:callActivity id="${node.id}" name="${this.escape(node.name)}">`);

        lines.push(`    <bpmn2:extensionElements>`);
        if (node.iflProperties.length > 0) {
            lines.push(this.propertyWriter.writeAll(node.iflProperties, "        "));
        } else {
            // Add default properties for Content Modifier
            lines.push(`        <ifl:property>`);
            lines.push(`            <key>componentVersion</key>`);
            lines.push(`            <value>1.6</value>`);
            lines.push(`        </ifl:property>`);
            lines.push(`        <ifl:property>`);
            lines.push(`            <key>activityType</key>`);
            lines.push(`            <value>Enricher</value>`);
            lines.push(`        </ifl:property>`);
            lines.push(`        <ifl:property>`);
            lines.push(`            <key>cmdVariantUri</key>`);
            lines.push(`            <value>ctype::FlowstepVariant/cname::Enricher/version::1.6.3</value>`);
            lines.push(`        </ifl:property>`);
        }
        lines.push(`    </bpmn2:extensionElements>`);

        incoming.forEach(flowId => {
            lines.push(`    <bpmn2:incoming>${flowId}</bpmn2:incoming>`);
        });

        outgoing.forEach(flowId => {
            lines.push(`    <bpmn2:outgoing>${flowId}</bpmn2:outgoing>`);
        });

        lines.push(`</bpmn2:callActivity>`);

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
