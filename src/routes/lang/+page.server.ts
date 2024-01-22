import { read } from '$app/server';

type RouteParams = {
	slug: string
}
export async function load({ params }: {params: RouteParams}) {
	const res = read(params.slug);
	const item = await res.json();

	return { item };
}