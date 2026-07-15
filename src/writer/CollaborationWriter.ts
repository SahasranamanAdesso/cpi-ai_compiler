import { BpmnCollaboration } from "../ir/BpmnCollaboration";
import { PropertyWriter } from "./PropertyWriter";

/**
 * CollaborationWriter - Writes BPMN <collaboration> element
 *
 * Contains participants (adapters and process) and message flows.
 *
 * Example output:
 *   <collaboration id="Collaboration_1" name="HelloWorld">
 *       <participant id="Participant_Sender" name="Sender">
 *           <extensionElements>
 *               <ifl:property>
 *                   <key>ifl:type</key>
 *                   <value>EndpointSender</value>
 *               </ifl:property>
 *               <ifl:property>
 *                   <key>Address</key>
 *                   <value>/hello</value>
 *               </ifl:property>
 *           </extensionElements>
 *       </participant>
 *       <participant id="Participant_Process" name="Integration Process" processRef="Process_1"/>
 *       <participant id="Participant_Receiver" name="Receiver">...</participant>
 *       <messageFlow id="MessageFlow_1" name="Sender to Process" sourceRef="Participant_Sender" targetRef="StartEvent_1"/>
 *       <messageFlow id="MessageFlow_2" name="Process to Receiver" sourceRef="EndEvent_1" targetRef="Participant_Receiver"/>
 *   </collaboration>
 */
export class CollaborationWriter {

    private propertyWriter = new PropertyWriter();

    write(collaboration: BpmnCollaboration): string {
        const lines: string[] = [];

        lines.push(`<collaboration id="${collaboration.id}" name="${this.escape(collaboration.name)}">`);

        // Collaboration-level properties
        if (collaboration.properties.length > 0) {
            lines.push(`    <extensionElements>`);
            lines.push(this.propertyWriter.writeAll(collaboration.properties, "        "));
            lines.push(`    </extensionElements>`);
        }

        // Participants
        collaboration.participants.forEach(participant => {
            const attrs: string[] = [
                `id="${participant.id}"`,
                `name="${this.escape(participant.name)}"`
            ];

            if (participant.processRef) {
                attrs.push(`processRef="${participant.processRef}"`);
            }

            if (participant.properties.length === 0) {
                lines.push(`    <participant ${attrs.join(' ')}/>`);
            } else {
                lines.push(`    <participant ${attrs.join(' ')}>`);
                lines.push(`        <extensionElements>`);

                // Add ifl:type property first
                lines.push(`            <ifl:property>`);
                lines.push(`                <key>ifl:type</key>`);
                lines.push(`                <value>${participant.iflType}</value>`);
                lines.push(`            </ifl:property>`);

                // Add other properties
                lines.push(this.propertyWriter.writeAll(participant.properties, "            "));

                lines.push(`        </extensionElements>`);
                lines.push(`    </participant>`);
            }
        });

        // Message flows
        collaboration.messageFlows.forEach(messageFlow => {
            const attrs = [
                `id="${messageFlow.id}"`,
                `name="${this.escape(messageFlow.name)}"`,
                `sourceRef="${messageFlow.sourceRef}"`,
                `targetRef="${messageFlow.targetRef}"`
            ];

            if (messageFlow.properties.length === 0) {
                lines.push(`    <messageFlow ${attrs.join(' ')}/>`);
            } else {
                lines.push(`    <messageFlow ${attrs.join(' ')}>`);
                lines.push(`        <extensionElements>`);
                lines.push(this.propertyWriter.writeAll(messageFlow.properties, "            "));
                lines.push(`        </extensionElements>`);
                lines.push(`    </messageFlow>`);
            }
        });

        lines.push(`</collaboration>`);

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
