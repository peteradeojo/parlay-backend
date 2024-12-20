import { DataSource } from "typeorm";

export default class Database {
	static datasource: DataSource;

	static setDatasource(source) {
		if (!Database.datasource) {
			Database.datasource = source;
		}
	}
}
