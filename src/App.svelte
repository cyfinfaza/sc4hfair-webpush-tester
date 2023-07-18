<script>
	import TopAppBar, * as TAB from "@smui/top-app-bar";
	import Dialog, * as D from "@smui/dialog";
	import Button, { Label } from "@smui/button";
	import IconButton from "@smui/icon-button";
	import Textfield from "@smui/textfield";
	import LayoutGrid, { Cell } from "@smui/layout-grid";
	import Card, * as C from "@smui/card";

	import { UAParser } from "ua-parser-js";

	import { subscriptions, loadSubscriptions, key, sendNotification } from "./logic/webpush-api";
	import { onMount } from "svelte";
	import SubInfoDisplay from "./components/SubInfoDisplay.svelte";

	let keyDialogOpen = false;

	let sendNotifDialogOpen = false;
	let notif = { title: "Test", body: "Testing Notifications" };
	let subId = null;

	async function triggerLoadSubscriptions() {
		const result = await loadSubscriptions();
		if (result?.showKeyDialog) {
			keyDialogOpen = true;
		}
	}

	async function sendNotif() {
		const result = await sendNotification({ subscriberId: subId, ...notif });
		if (result?.showKeyDialog) {
			keyDialogOpen = true;
		}
	}

	$: console.log($subscriptions);

	onMount(() => {
		triggerLoadSubscriptions();
	});
</script>

<Dialog bind:open={keyDialogOpen} aria-labelledby="simple-title" aria-describedby="simple-content">
	<D.Title id="simple-title">Access Restricted</D.Title>
	<D.Content id="simple-content">
		<p>Enter Webpush server API key to continue.</p>
		<Textfield type="password" style="width: 100%" label="API Key" bind:value={$key} />
	</D.Content>
	<D.Actions>
		<Button>
			<Label>Close</Label>
		</Button>
		<Button variant="raised" on:click={() => triggerLoadSubscriptions()}>
			<Label>Fetch Data</Label>
		</Button>
	</D.Actions>
</Dialog>

<Dialog bind:open={sendNotifDialogOpen} aria-labelledby="simple-title" aria-describedby="simple-content">
	<D.Title id="simple-title">Send Notification</D.Title>
	<D.Content id="simple-content">
		<p>
			Sending To: <br />
			<SubInfoDisplay subscription={$subscriptions.find((sub) => sub._id === subId)} />
		</p>
		<Textfield style="width: 100%" label="Title" bind:value={notif.title} />
		<Textfield style="width: 100%" label="Body" bind:value={notif.body} />
	</D.Content>
	<D.Actions>
		<Button>
			<Label>Close</Label>
		</Button>
		<Button variant="raised" on:click={() => sendNotif()}>
			<Label>Send Notification</Label>
		</Button>
	</D.Actions>
</Dialog>

<main>
	<TopAppBar variant="static" style="position: sticky; top: 0;">
		<TAB.Row>
			<TAB.Section>
				<TAB.Title>Webpush Tester</TAB.Title>
			</TAB.Section>
			<TAB.Section align="end" toolbar>
				<IconButton class="material-icons" aria-label="Key" on:click={() => (keyDialogOpen = true)}>key</IconButton>
				<IconButton class="material-icons" aria-label="Refresh" on:click={() => triggerLoadSubscriptions()}
					>refresh</IconButton
				>
			</TAB.Section>
		</TAB.Row>
	</TopAppBar>
	<p style="text-align: center; margin-bottom: 0;">{$subscriptions.length || 0} Subscriptions</p>
	<LayoutGrid>
		{#each $subscriptions.reverse() as subscription}
			<Cell>
				<Card>
					<C.Content>
						<SubInfoDisplay {subscription} />
					</C.Content>
					<C.Actions>
						<Button
							variant="raised"
							on:click={() => {
								subId = subscription._id;
								sendNotifDialogOpen = true;
							}}
						>
							<Label>Send Notification</Label>
						</Button>
					</C.Actions>
				</Card>
			</Cell>
		{/each}
	</LayoutGrid>
</main>
