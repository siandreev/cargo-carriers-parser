import InputGenerator from "./input/InputGenerator";
import OutputGenerator from "./output/OutputGenerator";
import ParsersManager from "core/ParsersManager";
import {IResponse, IRequest} from "types";

class CollectManager {
    private inputDataframe: Array<IRequest>;

    public async initInputDataframe(generateData: boolean = false, saveData: boolean = false) {
        const inputGenerator = new InputGenerator();
        if (generateData) {
            console.log("[Info] Input dataframe generation...")
            await inputGenerator.generateDataframe();

            if (saveData) {
                await inputGenerator.saveDataframe();
            }
        } else {
            console.log("[Info] Input dataframe loading...")
            await inputGenerator.loadDataframe();
        }

        console.log("[Info] Input dataframe has been created...")
        this.inputDataframe = inputGenerator.dataframe;
    }

    public async collect() {
        if (!this.inputDataframe.length) {
            await this.initInputDataframe();
        }
        const outputGenerator = new OutputGenerator();

        let _index = 0;
        console.log("[Info] Start parsing requests")

        let resultsList: IResponse[] = [];
        const callback = (result: IResponse) => {
            resultsList.push(result);
        }

        for (let request of this.inputDataframe) {
            const parsersManger = new ParsersManager(request);
            await parsersManger.calculate(callback);
            await outputGenerator.convertAndSave(request, resultsList);

            _index++;
            console.log(`[Info] ${_index} request parsed`)
        }
    }
}

export default CollectManager;