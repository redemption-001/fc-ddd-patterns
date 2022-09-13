import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class PrintConsoleLog2WhenCustomerCreatedHandler implements EventHandlerInterface<CustomerCreatedEvent>{
    get typeOfEvent(): CustomerCreatedEvent {
        return CustomerCreatedEvent.prototype;
    }

    handle(event: CustomerCreatedEvent): void {
        console.log("Esse é o segundo console.log do evento: CustomerCreated");
    }

}