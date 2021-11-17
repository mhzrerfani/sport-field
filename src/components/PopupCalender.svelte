<script lang="ts">
	// @ts-nocheck
	import dayjs from 'dayjs';
	import jalaliday from 'jalaliday';
	import { globalStore } from '../stores';
	import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';

	export let value, title;

	dayjs.extend(isSameOrBefore);
	dayjs.extend(jalaliday);
	dayjs.locale('fa');
	dayjs.calendar('jalali');

	let weeks = [[]],
		events = {
			[dayjs().format('YYYY-MM-DD')]: ['hello', 'event'],
			[dayjs().subtract(4, 'day').format('YYYY-MM-DD')]: ['another']
		},
		selectedMonth = dayjs().startOf('month'),
		open = false;

	const generateWeeks = (month) => {
		weeks = [[]];
		let endOfMonth = month.endOf('month');
		let current = selectedMonth.startOf('month');
		let i = 0;

		while (current.day() !== 6) {
			current = current.subtract(1, 'day');
		}
		while (endOfMonth.day() !== 6) {
			endOfMonth = endOfMonth.add(1, 'day');
		}

		while (!current.isSame(endOfMonth, 'day')) {
			if (i !== 0 && current.day() === 6) {
				weeks.push([]);
			}

			weeks[weeks.length - 1].push({
				date: current,
				currentMonth: current.isSame(selectedMonth, 'month'),
				events: events[current.format('YYYY-MM-DD')] || [],
				isToday: current.isSame(dayjs(), 'day'),
				isPast: current.isBefore(dayjs(), 'day')
			});
			current = current.add(1, 'day');
			i++;
		}
	};
	globalStore.setDate(dayjs());
	const addMonth = () => (selectedMonth = selectedMonth.add(1, 'month'));
	const subtractMonth = () => (selectedMonth = selectedMonth.subtract(1, 'month'));
	const handleDayClick = (date) => () => {
		value = date.format('YYYY-MM-DD');
		open = false;
	};
	const goToNextMonth = (date) => {
		if (!selectedMonth.isSame(date, 'month') && selectedMonth.isBefore(date, 'month')) {
			addMonth();
		} else if (!selectedMonth.isSame(date, 'month') && selectedMonth.isAfter(date, 'month')) {
			subtractMonth();
		}
	};
	$: generateWeeks(selectedMonth);
</script>

<div class="w-40" on:click={() => (open = true)} style="direction: ltr">
	<Textfield bind:value label={title}>
		<Icon class="material-icons" slot="leadingIcon">event</Icon>
	</Textfield>
</div>
<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<div
		class="flex flex-col items-center w-min mx-auto shadow-xl rounded-xl p-5"
		style="direction: rtl"
	>
		<div class="month w-full flex items-center">
			<span class="action" on:click={subtractMonth}>{'<'}</span>
			<span class="selectedMonth">{selectedMonth.format('MMMM YYYY')}</span>
			<span class="action" on:click={addMonth}>{'>'}</span>
		</div>
		<div class="w-min">
			{#each weeks as week (`${week[0].date.format('YYYY-MM-DD')}-week`)}
				<div class="week">
					{#each week as day (day.date.format('YYYY-MM-DD'))}
						<div
							class="day"
							class:otherMonth={!day.currentMonth}
							class:selected={day.date.isSame(dayjs(value), 'day')}
							class:past={day.isPast}
							on:click={handleDayClick(day.date)}
							on:click={goToNextMonth(day.date)}
						>
							<span class:today={day.isToday}>
								{day.date.format('DD')}
							</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div></Dialog
>

<style>
	* {
		transition: 0.3s;
	}

	:global(body) {
		direction: rtl;
	}

	.month {
		display: flex;
		justify-content: space-between;
		padding: 0 10px 10px;
	}

	.action {
		padding: 10px;
		cursor: pointer;
	}

	.selectedMonth {
		font-weight: bold;
		padding: 0;
		cursor: initial;
	}

	.week {
		display: grid;
		width: min-content;
		grid-template-columns: repeat(7, 1fr);
	}

	.day {
		padding: 8px 10px;
		border-radius: 100%;
		cursor: pointer;
	}
	.day.otherMonth {
		color: #ccc;
	}
	.day:hover,
	.selected {
		background: #df6531;
	}

	.day .today {
		font-weight: bold;
	}

	.events {
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
