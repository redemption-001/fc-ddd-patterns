import EventInterface from './event.interface';
export default interface EventHandlerInterface<T extends EventInterface=EventInterface> {
    get typeOfEvent(): T;
    handle(event: T): void;
}