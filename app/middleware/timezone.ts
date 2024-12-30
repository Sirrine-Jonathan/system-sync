// middleware/timezone.ts
import { Request, Response, NextFunction } from 'express'

export function timezoneMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const timezone = req.headers['x-timezone'] || 'UTC' // default to UTC if none provided
    req.timezone = timezone
    next()
}
