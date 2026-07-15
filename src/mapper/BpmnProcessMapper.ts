import { IFlow } from "../model/IFlow";
import { BpmnProcess } from "../ir/BpmnProcess";
import { BpmnNode } from "../ir/BpmnNode";
import { BpmnSequenceFlow } from "../ir/BpmnSequenceFlow";
import { BpmnDefinitions } from "../ir/BpmnDefinitions";
import { BpmnCollaboration } from "../ir/BpmnCollaboration";
import { BpmnParticipant } from "../ir/BpmnParticipant";
import { BpmnMessageFlow } from "../ir/BpmnMessageFlow";
import { ComponentMapper } from "./ComponentMapper";

/**
 * BpmnProcessMapper - Maps entire IFlow to complete BpmnDefinitions
 *
 * This completes the FRONT-END of our compiler:
 *
 *   IFlow (Domain Model - entire flow)
 *          ↓
 *   BpmnProcessMapper ← We are here
 *          ↓
 *   ComponentMapper (for each component)
 *          ↓
 *   BpmnDefinitions (IR - complete definitions with collaboration)
 *
 * Responsibilities:
 * - Map IFlow → BpmnDefinitions (root element)
 * - Create BpmnCollaboration with participants and message flows
 * - Create BpmnProcess with nodes and sequence flows
 * - Use ComponentMapper for each component
 * - Add start/end events
 *
 * This is the orchestrator that builds the complete SAP BPMN structure.
 *
 * Example:
 *   IFlow with 3 components
 *        ↓
 *   BpmnProcessMapper
 *        ↓
 *   BpmnProcess with 3 BpmnNodes
 */
export class BpmnProcessMapper {

    private readonly componentMapper: ComponentMapper;

    constructor() {
        this.componentMapper = new ComponentMapper();
    }

    /**
     * Maps an entire IFlow to BpmnDefinitions
     *
     * This is the main entry point for the mapper layer.
     * It orchestrates the complete transformation from domain model to IR.
     *
     * Implementation for HelloWorld MVP:
     * - Creates BpmnCollaboration with HTTPS sender/receiver participants
     * - Creates BpmnProcess with start event, content modifier, end event
     * - Maps components using ComponentMapper
     * - Maps connections to sequence flows
     * - Creates message flows connecting adapters to process
     *
     * @param flow - The IFlow to map
     * @returns Complete BpmnDefinitions ready for XML serialization
     *
     * @example
     * const flow = new IFlow("HelloWorld");
     * const mapper = new BpmnProcessMapper();
     * const definitions = mapper.map(flow);
     * // → BpmnDefinitions with collaboration, participants, process
     */
    public map(flow: IFlow): BpmnDefinitions {

        const process = new BpmnProcess("Process_1", "Integration Process");
        const collaboration = new BpmnCollaboration("Collaboration_1", flow.name);

        // Add process participant
        const processParticipant = new BpmnParticipant(
            "Participant_Process",
            "Integration Process",
            "EndpointProcess",
            "Process_1"
        );
        collaboration.addParticipant(processParticipant);

        // Add HTTPS sender adapter participant
        const senderParticipant = new BpmnParticipant(
            "Participant_Sender",
            "Sender",
            "EndpointSender"
        );
        senderParticipant.addProperty("Address", "/hello");
        collaboration.addParticipant(senderParticipant);

        // Add HTTPS receiver adapter participant
        const receiverParticipant = new BpmnParticipant(
            "Participant_Receiver",
            "Receiver",
            "EndpointReceiver"
        );
        receiverParticipant.addProperty("Address", "https://postman-echo.com/post");
        collaboration.addParticipant(receiverParticipant);

        // Add start event
        const startEvent = new BpmnNode("StartEvent_1", "startEvent", "Start");
        process.nodes.push(startEvent);

        // Map all components to BPMN nodes
        const components = flow.getComponents();
        const nodes = this.componentMapper.mapAll(components);
        nodes.forEach(node => {
            process.nodes.push(node);
        });

        // Add end event
        const endEvent = new BpmnNode("EndEvent_1", "endEvent", "End");
        process.nodes.push(endEvent);

        // Map connections to sequence flows
        const connections = flow.getConnections();
        const flowIds: string[] = [];

        // Start event to first component
        if (components.length > 0) {
            const firstFlow = new BpmnSequenceFlow(
                "SequenceFlow_1",
                "StartEvent_1",
                components[0].id
            );
            process.flows.push(firstFlow);
            flowIds.push(firstFlow.id);
        }

        // Component connections
        connections.forEach((connection, index) => {
            const seqFlow = new BpmnSequenceFlow(
                `SequenceFlow_${index + 2}`,
                connection.from.id,
                connection.to.id
            );
            process.flows.push(seqFlow);
            flowIds.push(seqFlow.id);
        });

        // Last component to end event
        if (components.length > 0) {
            const lastComponent = components[components.length - 1];
            const lastFlow = new BpmnSequenceFlow(
                `SequenceFlow_${connections.length + 2}`,
                lastComponent.id,
                "EndEvent_1"
            );
            process.flows.push(lastFlow);
            flowIds.push(lastFlow.id);
        }

        // Message flow from sender to start event
        const senderMessageFlow = new BpmnMessageFlow(
            "MessageFlow_1",
            "Sender to Process",
            "Participant_Sender",
            "StartEvent_1"
        );
        collaboration.addMessageFlow(senderMessageFlow);

        // Message flow from end event to receiver
        const receiverMessageFlow = new BpmnMessageFlow(
            "MessageFlow_2",
            "Process to Receiver",
            "EndEvent_1",
            "Participant_Receiver"
        );
        collaboration.addMessageFlow(receiverMessageFlow);

        return new BpmnDefinitions("Definitions_1", collaboration, process);
    }

}
