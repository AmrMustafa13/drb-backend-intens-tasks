declare const _default: (() => {
    port: number;
    environment: string;
    jwtSecret: string | undefined;
    jwtExpiresIn: string;
    jwtRefreshSecret: string | undefined;
    jwtRefreshExpiresIn: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    environment: string;
    jwtSecret: string | undefined;
    jwtExpiresIn: string;
    jwtRefreshSecret: string | undefined;
    jwtRefreshExpiresIn: string;
}>;
export default _default;
