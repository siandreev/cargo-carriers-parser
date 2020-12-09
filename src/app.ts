import "core/ParsersFactory/ParsersStorage";
import "core/parsers";

enum CONFIGURATION {
    SERVER = "server",
    COLLECTOR = "collector"
}

const configuration = process.argv.slice(2)[0];

switch (configuration) {
    case CONFIGURATION.COLLECTOR: {

        break;
    }
    case CONFIGURATION.SERVER:
    default: {
        import("network")
    }
}


