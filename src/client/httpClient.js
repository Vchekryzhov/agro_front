import axios from "axios";

export default () => {
	const baseUrl = "https://agro-api.kovalev.team";

	return axios.create({
		baseURL: baseUrl,
		headers: {
			"Content-Type": "application/json"
		}
	});
};