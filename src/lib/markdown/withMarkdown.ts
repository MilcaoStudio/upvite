import { Transforms } from 'slate'
import type { ISvelteEditor } from 'svelte-slate'
import remarkSlate from './plugins/remarkSlate'
import { remarkProcessor } from "$lib/markdown/RemarkRenderer.svelte";
import type { IElement } from 'svelte-slate/plugins';

export default function withMarkdown(editor: ISvelteEditor) {
    const { insertData, isInline, isVoid } = editor

    editor.insertData = data => {
        const content = data.getData('text/plain')
        console.log('content', content)

        if (content) {
            remarkProcessor()
                .use(remarkSlate)
                .process(content, (err, file) => {
                    if (err) throw err
                    console.log('previous Transform => ', file?.result)
                    if (Array.isArray(file?.result)) {
                        Transforms.insertFragment(editor, file.result);
                    }
                })
            return
        }

        insertData(data)
    }

    editor.isVoid = (e) => {
        const element = e as IElement;
        if (element.type == "mention") {
            return true;
        }
        return isVoid(e);
    }
    editor.isInline = (e) => {
        const element = e as IElement;
        if (element.type == "mention") {
            return true;
        }
        return isInline(element);
    }
    return editor
}
