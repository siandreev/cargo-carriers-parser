import ICargo from "ICargo";

interface IRequest {
    cityFrom: string,
    cityTo: string,
    cargo: ICargo
}

export default IRequest;