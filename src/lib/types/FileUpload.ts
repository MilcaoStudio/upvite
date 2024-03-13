import Axios, { type AxiosRequestConfig } from "axios";

export type BehaviorType =
    | { type: "ask"; onChange: (file: File) => void }
    | {
        type: "upload";
        onUpload: (id: string) => Promise<void>;
        previewAfterUpload?: boolean;
    }
    | {
        type: "multi";
        onChange: (files: File[]) => void;
        append?: (files: File[]) => void;
    };

export type StyleType =
    | {
        type: "icon" | "banner";
        width?: number;
        height?: number;
        previewURL?: string;
        defaultPreview?: string;
        desaturateDefault?: boolean;
    }
    | {
        type: "attachment";
        attached: boolean;
        uploading: boolean;
        cancel: () => void;
        size?: number;
    };

export async function uploadFile(
    autumnURL: string,
    tag: string,
    file: File,
    config?: AxiosRequestConfig,
) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await Axios.post(`${autumnURL}/${tag}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        ...config,
    });

    return res.data.id;
}

let input: HTMLInputElement;
export function grabFiles(
    maxFileSize: number,
    cb: (files: File[]) => void,
    tooLarge: () => void,
    multiple?: boolean,
) {
    if (input) {
        input.remove();
    }

    input = document.createElement("input");

    input.accept = "*";
    input.type = "file";
    input.multiple = multiple ?? false;
    input.style.display = "none";

    input.addEventListener("change", async (e) => {
        const files = (e.currentTarget as HTMLInputElement)?.files;
        if (!files) return;

        for (const file of files) {
            if (file.size > maxFileSize) {
                return tooLarge();
            }
        }

        cb(Array.from(files));
    });

    // iOS requires us to append the file input
    // to DOM to allow us to add any images
    document.body.appendChild(input);
    input.click();
}