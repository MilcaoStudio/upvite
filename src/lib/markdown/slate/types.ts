import type { BaseText } from "slate";
export interface RichText extends BaseText {
    type: string,
    match?: string,
}