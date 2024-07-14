import type { Processor } from "unified";
import type { Node, Root, RootContent, PhrasingContent } from "mdast"
import type { IBaseElement, IImageElement, IText } from "svelte-slate/plugins";

export default function plugin(this: Processor, ) {
    this.compiler = function(node: Node) {
        if (node.type == "root") {
            const children = (node as Root).children;
            return children.length ? children.map(transform) : [{type: "paragraph", children:[{text: ""}]}];
        } else {
            return [transform(node as RootContent)];
        }
    }
}

function transform(node: RootContent): IBaseElement|IText {
    
    // Void elements must have an empty child text node
    let children: Array<IBaseElement | IText> = [{text: ""}];

    // Removes position property at compile time
    delete (node as any).position

    // Leaf nodes
    switch(node.type) {
        case "break": case "thematicBreak":
            return {
                text: "\n",
            }
        case "code": case "inlineCode":
            return {
                text: node.value,
                code: true
            }
        case "definition":
            return {
                text: node.label ?? node.url,
            }
        case "footnoteReference":
            return {
                text: node.label ?? node.identifier,
            }
        case "html": case "inlineMath": case "math": case "mdxFlowExpression": case "mdxjsEsm": case "mdxTextExpression": case "text": case "yaml":
            return {
                text: node.value
            }
        case "image":
            return {
                alt: node.alt,
                children,
                label: node.title,
                type: node.type,
                url: node.url,
            } as IImageElement
        case "imageReference":
            return {
                text: node.label ?? node.alt ?? node.identifier
            }
        case "mention":
            return {
                ...node,
                text: `<@${node.match}>`,
            }
    }

    if (Array.isArray(node.children) && node.children.length > 0) {
        children = node.children
            .map(function (child) {
                const res = transform(child)
                return res
            })
            .flat()
    }

    switch (node.type) {
        case 'heading':
            return {
                type: depthToHeading[node.depth],
                children
            }
        case 'list':
            return {
                type: node.ordered ? 'ol_list' : 'ul_list',
                children
            }
        case 'listItem':
            return {
                type: 'list_item',
                children
            }
        case 'emphasis':
            return {
                type: node.type,
                children: node.children.map(child => {
                    console.debug("emphasis child", child)
                    return addAttrs(child, {italic: true})
                })}
        case 'strong':
            return {
                type: node.type,
                children: node.children.map(child => {
                    console.debug("strong child", child)
                    return addAttrs(child, {bold: true})
                })}
        case 'delete':
            return {
                type: node.type,
                children: node.children.map(child => {
                    console.debug("delete child", child)
                    return addAttrs(child, {strikeThrough: true})
                })}
        case 'blockquote':
            return {
                type: 'block-quote',
                children
            }
        default:
            return {
                ...node,
                children,
            }
    }
}

const depthToHeading = {
    1: 'heading1',
    2: 'heading2',
    3: 'heading3',
    4: 'heading4',
    5: 'heading5',
    6: 'heading6'
}

function addAttrs(child: PhrasingContent, attrs: Omit<IText, "text"> = {}): IText|IBaseElement {
    switch (child.type) {
        case "break":
          return {
            text: "\n"
        }
        case "html": case "inlineCode": case "inlineMath": case "mdxTextExpression": case "text":
            return {
                text: child.value,
                ...attrs
            }
        case "footnoteReference":
            return {
                text: child.label ?? "",
                ...attrs
            }
        case "image": case "imageReference":
            return transform(child)
    }
    return {
        type: child.type,
        children: child.children.map(item => addAttrs(item, attrs))
    }
}
