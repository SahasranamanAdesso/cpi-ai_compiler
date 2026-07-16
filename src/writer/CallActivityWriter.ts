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

        // Convert node.properties to ifl:property elements
        const properties = node.properties;

        // Ensure mandatory properties are present
        const mandatoryProperties: Record<string, string> = {
            'bodyType': properties.bodyType || 'constant',
            'propertyTable': properties.propertyTable || '',
            'headerTable': properties.headerTable || '',
            'wrapContent': properties.wrapContent || '',
            'componentVersion': properties.componentVersion || '1.6',
            'activityType': properties.activityType || 'Enricher',
            'cmdVariantUri': properties.cmdVariantUri || 'ctype::FlowstepVariant/cname::Enricher/version::1.6.3'
        };

        // Add body property if present
        if (properties.body) {
            mandatoryProperties['body'] = properties.body;
        }

        // Write all properties
        Object.entries(mandatoryProperties).forEach(([key, value]) => {
            lines.push(`        <ifl:property>`);
            lines.push(`            <key>${key}</key>`);
            lines.push(`            <value>${this.escape(String(value))}</value>`);
            lines.push(`        </ifl:property>`);
        });

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
