/// <reference types="mdast-util-mdx-expression" />
/// <reference types="mdast-util-mdx-jsx" />
/// <reference types="mdast-util-mdxjs-esm" />
import type { Node, Text, Parent, Parents, Element } from "hast";
import type { Program, Expression, Identifier, SimpleLiteral, MemberExpression } from "estree";
import type { Processor } from "unified";
import { name as isIdentifierName } from "estree-util-is-identifier-name"
import { stringify as spaces } from "space-separated-tokens"
import { stringify as commas } from "comma-separated-tokens"
import { ok as assert } from "devlop";
import { whitespace } from "hast-util-whitespace"
import { find, hastToReact, html, svg } from "property-information"
import styleToObject from "style-to-object"
import type { VFile } from "vfile";
import { VFileMessage } from "vfile-message";
import { svelte, svelteDEV, sveltes, type SvelteElement } from "../runtime/svelteRuntime";
import type { MdxjsEsmHast } from "mdast-util-mdxjs-esm";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx";
import type { Position } from "unist";
import type { ComponentType } from "svelte";
import type { MdxFlowExpression, MdxTextExpression } from "mdast-util-mdx-expression";

const own = {}.hasOwnProperty;
const emptyMap = new Map();

const tableElements = new Set(['table', 'tbody', 'thead', 'tfoot', 'tr']);
const tableCellElement = new Set(['td', 'th']);

const cap = /[A-Z]/g;
const dashSomething = /-([a-z])/g;
const docs = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";

export type RuntimeDevelopment = {
	development: true,
	svelteDEV: Function,
	svelte?: Function,
	sveltes?: Function,
};

export type RuntimeProduction = {
	development: false,
	svelteDEV?: Function,
	svelte: Function,
	sveltes: Function,
}

export type RuntimeUnknown = {
	development?: boolean,
	svelteDEV?: Function,
	svelte?: Function,
	sveltes?: Function,
}
type RegularFields = {
	filePath?: string | null,
	space?: "html" | "svg",
	createElement: Function,
	createEvaluater?: ()=>Evaluater,
	components?: Record<string, string | Function | null>,
	passKeys?: boolean,
	passNode?: boolean,
	tableCellAlignToStyle?: boolean,
	ignoreInvalidStyle?: boolean,
}

export type Options = RuntimeDevelopment & RegularFields | RegularFields & RuntimeProduction | RegularFields & RuntimeUnknown;

type Child = SvelteElement | string | null;
type Style = Record<string, string>;
type Props = Record<string, any>;
type Evaluater = {
	evaluateExpression: (expression: Expression)=>any,
	evaluateProgram: (expression: Program)=>any,
}
type PluginState = {
	ancestors: Array<Parents | MdxJsxFlowElement | MdxJsxTextElement>,
	components: Record<string, string | Function | null>,
	create: (node: Node, type: string | Function, props: Props)=>SvelteElement,
	filePath?: string,
	elementAttributeNameCase: "react" | "html",
	ignoreInvalidStyle: boolean,
	schema: typeof svg,
	evaluater?: Evaluater,
	passKeys: boolean,
	passNode: boolean,
	stylePropertyNameCase: "css" | "dom",
	tableCellAlignToStyle: boolean,
}

export default function rehypeSvelte(this: Processor, options: Options) {
	this.compiler = compiler;
	function compiler(tree: Node, file: VFile) {
		return toSvelteRuntime(tree, {
			filePath: file.path, svelteDEV, svelte, sveltes, ...options,
		})
	}
}
function addChildren(props: Props, children: Array<Child>) {
	if (children.length > 0) {
		const value = children.length > 1 ? children : children[0]

		if (value) {
			props.children = value
		}
	}
}

function root(state: PluginState, node: Parent) {
	const props = {}
	addChildren(props, createChildren(state, node))

	// No fragment in svelte
	return state.create(node, "div", props)
}

function text(_: PluginState, node: Text) {
	return node.value
}

function mdxEsm(state: PluginState, node: MdxjsEsmHast): Child | undefined {
	if (node.data && node.data.estree && state.evaluater) {
		// Assume result is a child.
		return (
			state.evaluater.evaluateProgram(node.data.estree)
		)
	}
	crashEstree(state, node.position)
}

function addNode(state: PluginState, props: Props, type: any, node: Node) {
	// If this is swapped out for a component:
	if (typeof type != "string" && state.passNode) {
		props.node = node
	}
}
function createSvelteElementProps(state: PluginState, node: MdxJsxFlowElement | MdxJsxTextElement) {
	const props: Props = {}
  
	for (const attribute of node.attributes) {
	  if (attribute.type == "mdxJsxExpressionAttribute") {
		if (attribute.data && attribute.data.estree && state.evaluater) {
		  const program = attribute.data.estree
		  const expression = program.body[0]
		  assert(expression.type == "ExpressionStatement")
		  const objectExpression = expression.expression
		  assert(objectExpression.type == "ObjectExpression")
		  const property = objectExpression.properties[0]
		  assert(property.type == "SpreadElement")
  
		  Object.assign(
			props,
			state.evaluater.evaluateExpression(property.argument)
		  )
		} else {
		  crashEstree(state, node.position)
		}
	  } else {
		// For JSX, the author is responsible of passing in the correct values.
		const name = attribute.name
		let value
  
		if (attribute.value && typeof attribute.value == 'object') {
		  if (
			attribute.value.data &&
			attribute.value.data.estree &&
			state.evaluater
		  ) {
			const program = attribute.value.data.estree
			const expression = program.body[0]
			assert(expression.type == "ExpressionStatement")
			value = state.evaluater.evaluateExpression(expression.expression)
		  } else {
			crashEstree(state, node.position)
		  }
		} else {
		  value = attribute.value == null ? true : attribute.value
		}
  
		// Assume a prop.
		props[name] = value as Props[keyof Props];
	  }
	}
  
	return props
}
function createChildren(state: PluginState, node: Parent | MdxJsxFlowElement | MdxJsxTextElement) {
	const children: Array<Child> = [];
	let index = -1;
	const countsByName: Map<string, number> = state.passKeys ? new Map() : emptyMap

	while (++index < node.children.length) {
		const child = node.children[index]
		if (state.passKeys) {
			const name =
				child.type == 'element'
					? child.tagName
					: child.type == 'mdxJsxFlowElement' ||
						child.type == 'mdxJsxTextElement'
						? child.name
						: undefined

			if (name) {
				const count = countsByName.get(name) || 0
				countsByName.set(name, count + 1)
			}
		}

		const result = one(state, child)
		if (result !== undefined) children.push(result)
	}

	return children
}

function element(state: PluginState, node: Element) {
	const parentSchema = state.schema
	let schema = parentSchema

	if (node.tagName.toLowerCase() == "svg" && parentSchema.space == "html") {
		schema = svg
		state.schema = schema
	}

	state.ancestors.push(node)

	const type = findComponentFromName(state, node.tagName, false)
	const props = createElementProps(state, node)
	let children = createChildren(state, node)

	if (tableElements.has(node.tagName)) {
		children = children.filter(function (child) {
			return typeof child == "string" ? !whitespace(child) : true
		})
	}

	addNode(state, props, type, node)
	addChildren(props, children)

	// Restore.
	state.ancestors.pop()
	state.schema = parentSchema

	if (!type) {
		return;
	}

	return state.create(node, type, props)
}

function mdxExpression(state: PluginState, node: MdxFlowExpression | MdxTextExpression): Child | undefined {
	if (node.data && node.data.estree && state.evaluater) {
	  const program = node.data.estree
	  const expression = program.body[0]
	  assert(expression.type == "ExpressionStatement")
  
	  // Assume result is a child.
	  return state.evaluater.evaluateExpression(expression.expression)
	  
	}
  
	crashEstree(state, node.position)
}
function mdxJsxElement(state: PluginState, node: MdxJsxFlowElement | MdxJsxTextElement) {
	const parentSchema = state.schema;
	let schema = parentSchema;

	if (node.name == "svg" && parentSchema.space == "html") {
		schema = svg
		state.schema = schema
	}

	state.ancestors.push(node)

	// No fragments in svelte
	const type =
		node.name === null
			? "div"
			: findComponentFromName(state, node.name, true)
	const props = createSvelteElementProps(state, node)
	const children = createChildren(state, node)

	addNode(state, props, type, node)
	addChildren(props, children)
	if (!type) {
		return;
	}
	// Restore.
	state.ancestors.pop()
	state.schema = parentSchema

	return state.create(node, type, props)
}

function one(state: PluginState, node: Node) {
	if (node.type == "element") {
		return element(state, node as Element)
	}

	if (node.type == "mdxFlowExpression" || node.type == "mdxTextExpression") {
		return mdxExpression(state, node as MdxFlowExpression)
	}

	if (node.type == "mdxJsxFlowElement" || node.type == "mdxJsxTextElement") {
		return mdxJsxElement(state, node as MdxJsxFlowElement)
	}

	if (node.type == "mdxjsEsm") {
		return mdxEsm(state, node as MdxjsEsmHast)
	}

	if (node.type == "root") {
		return root(state, node as Parent)
	}

	if (node.type == "text") {
		return text(state, node as Text)
	}
}
export function toSvelteRuntime(tree: Node, options: Options) {
	let create

	if (options.development) {
		if (typeof options.svelteDEV != 'function') {
			throw new TypeError('Expected `svelteDEV` in options when `development: true`')
		}
		create = developmentCreate(options.svelteDEV);
	} else {
		if (typeof options.svelte != 'function') {
			throw new TypeError('Expected `svelte` in production options')
		}

		if (typeof options.sveltes != 'function') {
			throw new TypeError('Expected `sveltes` in production options')
		}

		create = productionCreate(options.svelte, options.sveltes);
	}

	const state: PluginState = {
		ancestors: [],
		components: options.components || {},
		create,
		filePath: options.filePath || undefined,
		elementAttributeNameCase: "html",
		ignoreInvalidStyle: options.ignoreInvalidStyle || false,
		schema: options.space == "svg" ? svg : html,
		passKeys: options.passKeys !== false,
    	passNode: options.passNode || false,
		evaluater: options.createEvaluater ? options.createEvaluater() : undefined,
		stylePropertyNameCase: "dom",
		tableCellAlignToStyle: options.tableCellAlignToStyle !== false
	}

	const result = one(state, tree)
	// Svelte component.
	if (result && typeof result != "string") {
		return result
	}

	// No fragments in svelte
	return state.create(
		tree,
		"div",
		{children: result || undefined},
	  )
}
function crashEstree(state: PluginState, place?: Position) {
	const message = new VFileMessage(
		'Cannot handle MDX estrees without `createEvaluater`',
		{
			ancestors: state.ancestors,
			place,
			ruleId: 'mdx-estree',
			source: 'hast-util-to-jsx-runtime'
		}
	)
	message.file = state.filePath || undefined
	message.url = docs + '#cannot-handle-mdx-estrees-without-createevaluater'

	throw message
}
function findComponentFromName(state: PluginState, name: string, allowExpression: boolean): string | Function | null | undefined {
	let result: Identifier | SimpleLiteral | MemberExpression;

	if (!allowExpression) {
		result = { type: 'Literal', value: name }
	} else if (name.includes('.')) {
		const identifiers = name.split('.')
		let index = -1;
		let node: Identifier | SimpleLiteral | MemberExpression | undefined;

		while (++index < identifiers.length) {
			const prop: Identifier | SimpleLiteral = isIdentifierName(identifiers[index])
				? { type: 'Identifier', name: identifiers[index] }
				: { type: 'Literal', value: identifiers[index] }
			node = node
				? {
					type: 'MemberExpression',
					object: node,
					property: prop,
					computed: Boolean(index && prop.type == 'Literal'),
					optional: false
				}
				: prop
		}

		assert(node, 'always a result')
		result = node
	} else {
		result =
			isIdentifierName(name) && !/^[a-z]/.test(name)
				? { type: 'Identifier', name }
				: { type: 'Literal', value: name }
	}

	// Only literals can be passed in `components` currently.
	// No identifiers / member expressions.
	if (result.type == "Literal") {
		const name = result.value;

		return typeof name == "string" && own.call(state.components, name) ? state.components[name] : ""+name
	}

	// Assume component.
	if (state.evaluater) {
		return state.evaluater.evaluateExpression(result)
	}

	crashEstree(state)
}

function toCamel(_: unknown, $1: string) {
	return $1.toUpperCase()
}

function toDash($0: string) {
	return '-' + $0.toLowerCase()
}

function parseStyle(state: PluginState, value: string) {
	const result: Style = {}

	try {
		styleToObject(value, replacer)
	} catch (error) {
		if (!state.ignoreInvalidStyle) {
			const cause = error as Error;
			const message = new VFileMessage('Cannot parse `style` attribute', {
				ancestors: state.ancestors,
				cause,
				ruleId: 'style',
				source: 'hast-util-to-jsx-runtime'
			})
			message.file = state.filePath || undefined
			message.url = docs + '#cannot-parse-style-attribute'

			throw message
		}
	}

	return result

	/**
	 * Add a CSS property (normal, so with dashes) to `result` as a DOM CSS
	 * property.
	 *
	 * @returns Nothing.
	 */
	function replacer(name: string, value: string) {
		let key = name

		if (key.slice(0, 2) != "--") {
			if (key.slice(0, 4) == "-ms-") key = 'ms-' + key.slice(4)
			key = key.replace(dashSomething, toCamel)
		}

		result[key] = value
	}
}
function transformStyleToCssCasing(from: string) {
	let to = from.replace(cap, toDash)
	// Handle `ms-xxx` -> `-ms-xxx`.
	if (to.slice(0, 3) == 'ms-') to = '-' + to
	return to
}

function transformStylesToCssCasing(domCasing: Style) {
	const cssCasing: Style = {}

	for (const from in domCasing) {
		if (own.call(domCasing, from)) {
			cssCasing[transformStyleToCssCasing(from)] = domCasing[from]
		}
	}

	return cssCasing
}
function createProperty(state: PluginState, prop: string, value: any) {
	const info = find(state.schema, prop)

	// Ignore nullish and `NaN` values.
	if (
		value === null ||
		value === undefined ||
		(typeof value === 'number' && Number.isNaN(value))
	) {
		return
	}

	if (Array.isArray(value)) {
		// Accept `array`.
		// Most props are space-separated.
		value = info.commaSeparated ? commas(value) : spaces(value)
	}

	// React only accepts `style` as object.
	if (info.property == "style") {
		let styleObject =
			typeof value == "object" ? value : parseStyle(state, String(value))

		if (state.stylePropertyNameCase === 'css') {
			styleObject = transformStylesToCssCasing(styleObject)
		}

		return ['style', styleObject]
	}

	return [
		state.elementAttributeNameCase == "react" && info.space
			? hastToReact[info.property] || info.property
			: info.attribute,
		value
	]
}


function createElementProps(state: PluginState, node: Element) {
	const props: Props = {}
	let alignValue: string | undefined
	let prop: string

	for (prop in node.properties) {
		if (prop != "children" && own.call(node.properties, prop)) {
			const result = createProperty(state, prop, node.properties[prop])

			if (result) {
				const [key, value] = result

				if (
					state.tableCellAlignToStyle &&
					key == "align" &&
					typeof value == "string" &&
					tableCellElement.has(node.tagName)
				) {
					alignValue = value
				} else {
					props[key] = value
				}
			}
		}
	}

	if (alignValue) {
		// Assume style is an object.
		const style: Style = (props.style || (props.style = {}))
		style[state.stylePropertyNameCase == "css" ? 'text-align' : 'textAlign'] =
			alignValue
	}

	return props
}

function developmentCreate(svelte: Function) {
	function create(_: Node, type: string | Function, props: Props) {
		// Only an array when there are 2 or more children.
		const isStaticChildren = Array.isArray(props.children);
		return svelte(type, props, isStaticChildren)
	}
	return create
}

function productionCreate(svelte: Function, sveltes: Function) {
	function create(_: Node, type: string | Function, props: Props) {
		// Only an array when there are 2 or more children.
		const isStaticChildren = Array.isArray(props.children)
		const fn = isStaticChildren ? sveltes : svelte
		return fn(type, props)
	}
	return create
}