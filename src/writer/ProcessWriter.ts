import { BpmnProcess } from "../ir/BpmnProcess";
import { BpmnNode } from "../ir/BpmnNode";
import { BpmnSequenceFlow } from "../ir/BpmnSequenceFlow";
import { PropertyWriter } from "./PropertyWriter";
import { EventWriter } from "./EventWriter";
import { CallActivityWriter } from "./CallActivityWriter";

/**
 * ProcessWriter - Writes BPMN <process> element
 *
 * Contains all nodes (events, activities) and sequence flows.
 *
 * Example output:
 *   <process id="Process_1" name="Integration Process">
 *       <extensionElements>...</extensionElements>
 *       <startEvent id="StartEvent_1" name="Start">...</startEvent>
 *       <callActivity id="CallActivity_1" name="Set Body">...</callActivity>
 *       <endEvent id="EndEvent_1" name="End">...</endEvent>
 *       <sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="CallActivity_1"/>
 *       <sequenceFlow id="SequenceFlow_2" sourceRef="CallActivity_1" targetRef="EndEvent_1"/>
 *   </process>
 */
export class ProcessWriter {

    private propertyWriter = new PropertyWriter();
    private eventWriter = new EventWriter();
    private callActivityWriter = new CallActivityWriter();

    write(process: BpmnProcess): string {
        const lines: string[] = [];

        lines.push(`<process id="${process.id}" name="${this.escape(process.name)}" isExecutable="false">`);

        // Extension elements (process-level properties)
        if (process.properties.length > 0) {
            lines.push(`    <extensionElements>`);
            lines.push(this.propertyWriter.writeAll(process.properties, "        "));
            lines.push(`    </extensionElements>`);
        }

        // Build incoming/outgoing maps
        const incoming = new Map<string, string[]>();
        const outgoing = new Map<string, string[]>();

        process.flows.forEach(flow => {
            if (!outgoing.has(flow.sourceRef)) {
                outgoing.set(flow.sourceRef, []);
            }
            outgoing.get(flow.sourceRef)!.push(flow.id);

            if (!incoming.has(flow.targetRef)) {
                incoming.set(flow.targetRef, []);
            }
            incoming.get(flow.targetRef)!.push(flow.id);
        });

        // Write nodes
        process.nodes.forEach(node => {
            const nodeIncoming = incoming.get(node.id) || [];
            const nodeOutgoing = outgoing.get(node.id) || [];

            let nodeXml: string;

            if (node.type === "startEvent" || node.type === "endEvent") {
                nodeXml = this.eventWriter.write(node, nodeIncoming, nodeOutgoing);
            } else if (node.type === "callActivity") {
                nodeXml = this.callActivityWriter.write(node, nodeIncoming, nodeOutgoing);
            } else {
                throw new Error(`Unsupported node type: ${node.type}`);
            }

            lines.push(this.indent(nodeXml, "    "));
        });

        // Write sequence flows
        process.flows.forEach(flow => {
            lines.push(this.writeSequenceFlow(flow));
        });

        lines.push(`</process>`);

        return lines.join('\n');
    }

    private writeSequenceFlow(flow: BpmnSequenceFlow): string {
        return `    <sequenceFlow id="${flow.id}" sourceRef="${flow.sourceRef}" targetRef="${flow.targetRef}"/>`;
    }

    private indent(text: string, indentStr: string): string {
        return text.split('\n').map(line => indentStr + line).join('\n');
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
