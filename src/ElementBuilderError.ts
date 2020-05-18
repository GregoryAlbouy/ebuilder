export default class ElementBuilderError extends Error
{
    suspect: any
    
    constructor(message: string, suspect: any) {
        super(message)
        this.name = 'ElementBuilderError'
        this.suspect = suspect

        console.warn(
            `${this.name}: ${this.message}:\n`,
            this.suspect, '\n',
            this.stack
        )
    }
}