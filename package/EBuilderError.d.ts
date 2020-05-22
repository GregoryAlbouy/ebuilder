export default class EBuilderError extends Error {
    suspect: any;
    constructor(message: string, suspect: any);
}
