<script>
	import { get } from '../helper/token';
	import { isAdmin } from '../stores';

	const { user_name } = get();
</script>

<div class="text-orange mr-8 text-xl">
	{user_name}
	{$isAdmin ? '(ادمین)' : ''}
</div>
