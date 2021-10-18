import httpClient from "@/client/httpClient";

export default class RouteService {

	static async calculate(payload) {
		const response = await httpClient().post("route/builder/v1/calculate", payload);
		return response.data;
	}
}
