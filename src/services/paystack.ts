import axios, { AxiosInstance } from "axios";

interface TransactionInitResponse {
	access_code: string;
	reference: string;
	authorization_url: string;
}

interface PaystackResponse<T = Record<string, any>> {
	status: boolean;
	message: string;
	data: T;
}

export default class Paystack {
	private static url = "https://api.paystack.co";

	private static secretKey: string;
	private static publicKey: string;

	private static ax: AxiosInstance;

	static async initalizeTransaction(amount: number, email: string) {
		return await this.ax.post<PaystackResponse<TransactionInitResponse>>(
			`${this.url}/transaction/initialize`,
			{ email, amount: amount * 100 },
			{}
		);
	}

	static async verifyTransaction(reference: string) {
		return await this.ax.get<PaystackResponse>(
			`${this.url}/transaction/verify/${reference}`
		);
	}

	static setKeys(secretKey: string, publicKey: string) {
		this.secretKey = secretKey;
		this.publicKey = publicKey;
	}

	static bootstrap() {
		this.ax = axios.create({
			headers: {
				Authorization: `Bearer ${this.secretKey}`,
				"Content-Type": "application/json",
			},
		});
	}
}
