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
        const collaboration = new BpmnCollaboration("Collaboration_1", "Default Collaboration");

        // Add collaboration-level properties
        collaboration.addProperty("namespaceMapping", "");
        collaboration.addProperty("httpSessionHandling", "None");
        collaboration.addProperty("accessControlMaxAge", "");
        collaboration.addProperty("returnExceptionToSender", "false");
        collaboration.addProperty("log", "All events");
        collaboration.addProperty("corsEnabled", "false");
        collaboration.addProperty("exposedHeaders", "");
        collaboration.addProperty("componentVersion", "1.2");
        collaboration.addProperty("allowedHeaderList", "");
        collaboration.addProperty("ServerTrace", "false");
        collaboration.addProperty("allowedOrigins", "");
        collaboration.addProperty("accessControlAllowCredentials", "false");
        collaboration.addProperty("allowedHeaders", "*");
        collaboration.addProperty("allowedMethods", "GET");
        collaboration.addProperty("cmdVariantUri", "ctype::IFlowVariant/cname::IFlowConfiguration/version::1.2.4");

        // Add HTTPS sender adapter participant
        const senderParticipant = new BpmnParticipant(
            "Participant_1",
            "Sender",
            "EndpointSender"
        );
        senderParticipant.addProperty("enableBasicAuthentication", "false");
        senderParticipant.addProperty("ifl:type", "EndpointSender");
        collaboration.addParticipant(senderParticipant);

        // Add process participant
        const processParticipant = new BpmnParticipant(
            "Participant_Process_1",
            "Integration Process",
            "IntegrationProcess",
            "Process_1"
        );
        collaboration.addParticipant(processParticipant);

        // Add start event
        const startEvent = new BpmnNode("StartEvent_2", "startEvent", "Start");
        process.nodes.push(startEvent);

        // Map all components to BPMN nodes
        const components = flow.getComponents();
        const nodes = this.componentMapper.mapAll(components);
        nodes.forEach(node => {
            process.nodes.push(node);
        });

        // Add end event
        const endEvent = new BpmnNode("EndEvent_2", "endEvent", "End");
        process.nodes.push(endEvent);

        // Map connections to sequence flows
        const connections = flow.getConnections();

        // Start event to first component
        if (components.length > 0) {
            const firstFlow = new BpmnSequenceFlow(
                "SequenceFlow_3",
                "StartEvent_2",
                components[0].id
            );
            process.flows.push(firstFlow);
        }

        // Component connections
        connections.forEach((connection, index) => {
            const seqFlow = new BpmnSequenceFlow(
                `SequenceFlow_${index + 4}`,
                connection.from.id,
                connection.to.id
            );
            process.flows.push(seqFlow);
        });

        // Last component to end event
        if (components.length > 0) {
            const lastComponent = components[components.length - 1];
            const lastFlow = new BpmnSequenceFlow(
                `SequenceFlow_${connections.length + 4}`,
                lastComponent.id,
                "EndEvent_2"
            );
            process.flows.push(lastFlow);
        }

        // Message flow from sender to start event with HTTPS adapter properties
        const senderMessageFlow = new BpmnMessageFlow(
            "MessageFlow_4",
            "HTTPS",
            "Participant_1",
            "StartEvent_2"
        );
        senderMessageFlow.addProperty("ComponentType", "HTTPS");
        senderMessageFlow.addProperty("Description", "");
        senderMessageFlow.addProperty("maximumBodySize", "40");
        senderMessageFlow.addProperty("ComponentNS", "sap");
        senderMessageFlow.addProperty("componentVersion", "1.5");
        senderMessageFlow.addProperty("urlPath", "/hello");
        senderMessageFlow.addProperty("Name", "HTTPS");
        senderMessageFlow.addProperty("TransportProtocolVersion", "1.5.2");
        senderMessageFlow.addProperty("ComponentSWCVName", "external");
        senderMessageFlow.addProperty("system", "Sender");
        senderMessageFlow.addProperty("xsrfProtection", "1");
        senderMessageFlow.addProperty("TransportProtocol", "HTTPS");
        senderMessageFlow.addProperty("cmdVariantUri", "ctype::AdapterVariant/cname::sap:HTTPS/tp::HTTPS/mp::None/direction::Sender/version::1.5.2");
        senderMessageFlow.addProperty("userRole", "ESBMessaging.send");
        senderMessageFlow.addProperty("senderAuthType", "RoleBased");
        senderMessageFlow.addProperty("MessageProtocol", "None");
        senderMessageFlow.addProperty("MessageProtocolVersion", "1.5.2");
        senderMessageFlow.addProperty("ComponentSWCVId", "1.5.2");
        senderMessageFlow.addProperty("direction", "Sender");
        senderMessageFlow.addProperty("clientCertificates", "");
        collaboration.addMessageFlow(senderMessageFlow);

        return new BpmnDefinitions("Definitions_1", collaboration, process);
    }

}
