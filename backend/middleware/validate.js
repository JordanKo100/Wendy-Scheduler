// Usage: router.post('/x', validate(schema), handler)
// Replaces req.body with the parsed/sanitized version.
export function validate(schema, target = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.flatten().fieldErrors,
            });
        }
        req[target] = result.data;
        next();
    };
}