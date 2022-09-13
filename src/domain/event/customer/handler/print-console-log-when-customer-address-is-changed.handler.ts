import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class PrintConsoleLogWhenCustomerAddressChangedHandler implements EventHandlerInterface<CustomerAddressChangedEvent>{
    get typeOfEvent(): CustomerAddressChangedEvent {
        return CustomerAddressChangedEvent.prototype;
    }

    handle(event: CustomerAddressChangedEvent): void {
        const eventData = event.eventData;
        const msg = `Endereço do cliente: ${eventData.id}, ${eventData.name} alterado para: ${eventData.street}, ${eventData.number}, ${eventData.zip}, ${eventData.city}`;
        console.log(msg);
    }

}