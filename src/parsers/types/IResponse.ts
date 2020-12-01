interface IResponse {
    company: string,
    img: string,
    url: string,
    type: string,
    cost: number,
    fullCost: number,
    minTerm: number,
    maxTerm: number,
    comment: Array<string>
}

export default IResponse;