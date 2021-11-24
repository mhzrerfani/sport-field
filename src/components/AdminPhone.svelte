<script lang="ts">
	import { Label } from '@smui/common';
    import DataTable, { Row, Cell } from '@smui/data-table';
    import {adminPhoneSelected} from '../stores'
	let selected;
	$: $adminPhoneSelected = selected;
</script>

	
            <input
                bind:value={selected}
                class="rounded-md p-1"
                type="text"
                placeholder="نام ورزش جدید"
            />
        
