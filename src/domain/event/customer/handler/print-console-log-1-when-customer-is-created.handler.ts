import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class PrintConsoleLog1WhenCustomerCreatedHandler implements EventHandlerInterface<CustomerCreatedEvent>{
    get typeOfEvent(): CustomerCreatedEvent {
        return CustomerCreatedEvent.prototype;
    }

    handle(event: CustomerCreatedEvent): void {
        console.log("Esse é o primeiro console.log do evento: CustomerCreated");
    }

}