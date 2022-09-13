import EventHandlerInterface from "../../@shared/event-handler.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler
  implements EventHandlerInterface<ProductCreatedEvent>
{
  get typeOfEvent(): ProductCreatedEvent {    
    return ProductCreatedEvent.prototype;
  }
  handle(event: ProductCreatedEvent): void {
    console.log(`Sending email to .....`); 
  }
}
