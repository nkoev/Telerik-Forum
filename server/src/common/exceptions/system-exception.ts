export class ForumSystemException extends Error {

  constructor(message: string, public readonly status: number) {
    super(message)
  }
}