import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/// company 주소로 접근하면 리다이렉트
export const load = (async () => {
	throw redirect(301, '/company/greeting');
}) satisfies PageLoad;
