import { get, writable } from "svelte/store";

const api = "https://webpush.sc4hfair.app";

export const key = writable(window.localStorage.getItem("key") || "");
key.subscribe((value) => {
	window.localStorage.setItem("key", value);
});

export const subscriptions = writable([]);

export async function loadSubscriptions() {
	const response = await fetch(api + "/admin/getAllSubscriptions", { headers: [["api-key", get(key)]] });
	const data = await response.json();
	if (data.type === "success") {
		subscriptions.set(data.subscriptions);
		return { success: true, showKeyDialog: false };
	} else if (response.status === 401) {
		console.error(data);
		return { success: false, showKeyDialog: true };
	} else {
		console.error(data);
		return { success: false, showKeyDialog: false };
	}
}

export async function sendNotification({ subscriberId, title, body }) {
	const response = await fetch(api + "/admin/sendNotification", {
		headers: [
			["api-key", get(key)],
			["content-type", "application/json"],
		],
		method: "POST",
		body: JSON.stringify({ subscriberId, title, body }),
	});
	const data = await response.json();
	if (data.type === "success") {
		return { success: true, showKeyDialog: false };
	} else if (response.status === 401) {
		console.error(data);
		return { success: false, showKeyDialog: true };
	} else {
		console.error(data);
		return { success: false, showKeyDialog: false };
	}
}
