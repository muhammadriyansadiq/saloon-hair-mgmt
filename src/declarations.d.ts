/// <reference types="vite/client" />

declare module '@ant-design/icons';
declare module '*.png' {
    const value: string;
    export default value;
}
