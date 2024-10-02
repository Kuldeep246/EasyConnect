import { toast, ToastOptions } from "react-toastify";

const toastConfig: ToastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
};

export function toastInfo(message: string): void {
    toast.info(message, toastConfig);
}

export function toastSuccess(message: string): void {
    toast.success(message, toastConfig);
}

export function toastWarning(message: string): void {
    toast.warn(message, toastConfig);
}

export function toastError(message: string): void {
    toast.error(message, toastConfig);
}
