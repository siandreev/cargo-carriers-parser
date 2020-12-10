import "core/ParsersFactory/ParsersStorage";
import "core/parsers";
import CollectManager from "collector/CollectManager"

enum CONFIGURATION {
    SERVER = "server",
    COLLECTOR = "collector"
}

const configuration = process.argv.slice(2)[0];

switch (configuration) {
    case CONFIGURATION.COLLECTOR: {
        const [generate, save] = process.argv.slice(3,5)
        const collectorManager = new CollectManager();
        collectorManager.initInputDataframe(!!generate, !!save).then(() => {
            collectorManager.collect();
        });
        break;
    }
    case CONFIGURATION.SERVER:
    default: {
        import("network")
    }
}