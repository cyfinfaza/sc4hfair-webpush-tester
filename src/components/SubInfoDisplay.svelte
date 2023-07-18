<script>
	import UAParser from "ua-parser-js";

	export let subscription;
	let subscription_data = null;

	$: if (subscription)
		subscription_data = { ...subscription, user_agent: new UAParser(subscription.user_agent).getResult() };
</script>

{#if subscription_data}
	<code>{subscription_data.subscription_info.keys.p256dh.slice(0, 10)}</code> <br />
	{subscription_data.user_agent.browser.name}
	{subscription_data.user_agent.browser.major} <br />
	{subscription_data.user_agent.os.name}
	{subscription_data.user_agent.os.version}
	{#if subscription_data.user_agent.device.vendor}
		<br />
		{subscription_data.user_agent.device.vendor}
		{subscription_data.user_agent.device.model}
	{/if}
	<br /> <strong>Reg. {new Date(subscription_data.created * 1000).toLocaleString()}</strong>
{/if}
