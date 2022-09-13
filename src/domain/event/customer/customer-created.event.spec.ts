import EventDispatcher from "../@shared/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import PrintConsoleLog1WhenCustomerCreatedHandler from "./handler/print-console-log-1-when-customer-is-created.handler";
import PrintConsoleLog2WhenCustomerCreatedHandler from "./handler/print-console-log-2-when-customer-is-created.handler";
import PrintConsoleLogWhenCustomerAddressChangedHandler from "./handler/print-console-log-when-customer-address-is-changed.handler";

describe("Customer Created Event tests", ()=>{
    it("should trigger handlers of customer created event", ()=>{
        const consoleSpy = jest.spyOn(console, 'log');
        const customerCreatedHandler1 = new PrintConsoleLog1WhenCustomerCreatedHandler();
        const customerCreatedHandler2 = new PrintConsoleLog2WhenCustomerCreatedHandler();        
        const spyEventHandler1 = jest.spyOn(customerCreatedHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(customerCreatedHandler2, "handle");

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register("CustomerCreatedEvent", customerCreatedHandler1);
        eventDispatcher.register("CustomerCreatedEvent", customerCreatedHandler2);

        const customerEvent = new CustomerCreatedEvent({
            id: "123",
            name: "Maria Silva"
        });

        eventDispatcher.notify(customerEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');

        expect(spyEventHandler2).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');
    });

    it("should only trigger handlers of customer created event", ()=>{
        const consoleSpy = jest.spyOn(console, 'log');
        const customerCreatedHandler1 = new PrintConsoleLog1WhenCustomerCreatedHandler();
        const customerCreatedHandler2 = new PrintConsoleLog2WhenCustomerCreatedHandler();        
        const customerAddressChangedHandler = new PrintConsoleLogWhenCustomerAddressChangedHandler();    
        const spyCreatedEventHandler1 = jest.spyOn(customerCreatedHandler1, "handle");
        const spyCreatedEventHandler2 = jest.spyOn(customerCreatedHandler2, "handle");
        const spyUpdatedEventHandler = jest.spyOn(customerAddressChangedHandler, "handle");

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register("CustomerCreatedEvent", customerCreatedHandler1);
        eventDispatcher.register("CustomerCreatedEvent", customerCreatedHandler2);
        eventDispatcher.register("CustomerAddressChangedEvent", customerAddressChangedHandler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "123",
            name: "João Silva"
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyCreatedEventHandler1).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');

        expect(spyCreatedEventHandler2).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Esse é o segundo console.log do evento: CustomerCreated');        

        expect(spyUpdatedEventHandler).toHaveBeenCalledTimes(0);

    });

})