import EventDispatcher from "../@shared/event-dispatcher";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import PrintConsoleLog1WhenCustomerCreatedHandler from "./handler/print-console-log-1-when-customer-is-created.handler";
import PrintConsoleLog2WhenCustomerCreatedHandler from "./handler/print-console-log-2-when-customer-is-created.handler";
import PrintConsoleLogWhenCustomerAddressChangedHandler from "./handler/print-console-log-when-customer-address-is-changed.handler";

describe("Test of Customer Address Changed Event", ()=>{

    it("should trigger handlers of customer address changed event", ()=>{
        const consoleSpy = jest.spyOn(console, 'log');    
        const customerAddressChangedHandler = new PrintConsoleLogWhenCustomerAddressChangedHandler();
        const spyEventHandler = jest.spyOn(customerAddressChangedHandler, "handle");

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register("CustomerAddressChangedEvent", customerAddressChangedHandler);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: "123",
            name: "João Santos",
            street: "Street 1",
            number: 500,
            zip: "13330-250",
            city: "São Paulo"
        });

        eventDispatcher.notify(customerAddressChangedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Endereço do cliente: 123, João Santos alterado para: Street 1, 500, 13330-250, São Paulo');

    });

    it("should only trigger handlers of customer address changed event", ()=>{
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
     
        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: "123",
            name: "João Santos",
            street: "Street 1",
            number: 500,
            zip: "13330-250",
            city: "São Paulo"
        });
        
        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyCreatedEventHandler1).toBeCalledTimes(0);
        expect(spyCreatedEventHandler2).toBeCalledTimes(0);

        expect(spyUpdatedEventHandler).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Endereço do cliente: 123, João Santos alterado para: Street 1, 500, 13330-250, São Paulo');

    })


})