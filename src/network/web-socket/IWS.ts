import IResponse from "types/IResponse";

enum WSStatus {
    PROCESSING = "processing",
    DONE = "done"
}

enum WSResultType {
    SUCCESS = "success",
    ERROR = "error"
}

interface IWSResponse {
    status: WSStatus
}

interface IWSProcessingResponse extends IWSResponse{
    result: IResponse
}

interface IWSDoneResponse extends IWSResponse{
    result: {
        type: WSResultType,
        description?: string
    }
}

export {WSStatus, WSResultType, IWSResponse, IWSDoneResponse, IWSProcessingResponse};