export default class EBuilderAnimation {
    duration: number;
    then: Thenable;
    constructor(duration?: number);
    swap(a: HTMLElement, b: HTMLElement): void;
    swap2(a: HTMLElement, b: HTMLElement): Thenable;
}
