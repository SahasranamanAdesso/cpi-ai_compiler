import { BpmnNode } from "../ir/BpmnNode";

/**
 * EventWriter - Writes BPMN events (start, end)
 *
 * Example output:
 *   <startEvent id="StartEvent_1" name="Start">
 *       <outgoing>SequenceFlow_1</outgoing>
 *   </startEvent>
 *
 *   <endEvent id="EndEvent_1" name="End">
 *       <incoming>SequenceFlow_3</incoming>
 *   </endEvent>
 */
export class EventWriter {

    write(
        node: BpmnNode,
        incoming: string[],
        outgoing: string[]
    ): string {
        const lines: string[] = [];

        lines.push(`<${node.type} id="${node.id}" name="${this.escape(node.name)}">`);

        incoming.forEach(flowId => {
            lines.push(`    <incoming>${flowId}</incoming>`);
        });

        outgoing.forEach(flowId => {
            lines.push(`    <outgoing>${flowId}</outgoing>`);
        });

        lines.push(`</${node.type}>`);

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
