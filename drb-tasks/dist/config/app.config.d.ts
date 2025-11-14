declare const _default: (() => {
    port: number;
    environment: string;
    jwtSecret: string | undefined;
    jwtExpiresIn: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    environment: string;
    jwtSecret: string | undefined;
    jwtExpiresIn: string;
}>;
export default _default;
