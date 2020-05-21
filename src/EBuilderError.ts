export default class EBuilderError extends Error
{
    suspect: any
    
    constructor(message: string, suspect: any) {
        super(message)
        this.name = 'EBuilderError'
        this.suspect = suspect

        console.warn(
            `${this.name}: ${this.message}:\n`,
            this.suspect, '\n',
            // this.stack
        )
    }
}