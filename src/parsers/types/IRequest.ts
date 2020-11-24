import ICargo from "parsers/types/ICargo";

interface IRequest {
    cityFrom: string,
    cityTo: string,
    cargo: ICargo
}

export default IRequest;