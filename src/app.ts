import dotenv from "dotenv";
dotenv.config();

import "core/ParsersFactory/ParsersStorage";
import "core/parsers";
import CollectManager from "collector/CollectManager";

enum CONFIGURATION {
    SERVER = "server",
    COLLECTOR = "collector"
}

const configuration = process.argv.slice(2)[0];

switch (configuration) {
    case CONFIGURATION.COLLECTOR: {
        const [generate, save, random] = process.argv.slice(3,6)
        const collectorManager = new CollectManager();
        collectorManager.initInputDataframe(!!generate, !!save, !!random).then(() => {
            collectorManager.collect();
        });
        break;
    }
    case CONFIGURATION.SERVER:
    default: {
        import("network")
    }
}
